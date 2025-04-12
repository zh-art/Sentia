from fastapi import FastAPI, HTTPException, Query, Path, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from transformers import AutoTokenizer, AutoModelForCausalLM
from database.mongo_client import chat_collection
from services.chat_service import guardar_chat, obtener_historial
from services.user_service import usuario_existe, crear_usuario_si_no_existe
from models.chats import ChatEntrada
from bson.objectid import ObjectId
import torch
import traceback

app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carga de DialoGPT-Medium de HuggingFace
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

# Nos aseguramos que todo vaya a CPU
device = torch.device("cpu")
model.to(device)

# Modelo para actualización de temporizador
class TimerUpdate(BaseModel):
    user_id: str
    duration_minutes: int


@app.post("/generate")
async def generate_response(request: Request):
    data = await request.json()
    print("[POST /generate] Body recibido:", data)

    user_id = data.get("user_id")
    message = data.get("message")

    if not user_id or not message:
        raise HTTPException(status_code=400, detail="Faltan campos requeridos: user_id y message")

    crear_usuario_si_no_existe(user_id)

    try:
        print("Generando respuesta con DialoGPT...")

        if len(message) > 200:
            message = message[:200]

        inputs = tokenizer.encode(message + tokenizer.eos_token, return_tensors="pt").to(device)

        reply_ids = model.generate(
            inputs,
            max_new_tokens=100,
            pad_token_id=tokenizer.eos_token_id,
            temperature=0.7,
            do_sample=True,
            top_k=50,
            top_p=0.95,
        )

        respuesta = tokenizer.decode(reply_ids[:, inputs.shape[-1]:][0], skip_special_tokens=True).strip()

        print("Respuesta generada:", respuesta)

        guardar_chat(ChatEntrada(
            user_id=user_id,
            message=message,
            response=respuesta
        ))

        return {"response": respuesta}

    except Exception as e:
        print("Error generando respuesta:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error interno al generar respuesta.")

# Obtener historial de usuario
@app.get("/historial/{user_id}")
def historial(user_id: str):
    return obtener_historial(user_id)

# Actualizar temporizador de un chat
@app.put("/chat/{chat_id}/timer")
def set_timer(chat_id: str = Path(...), duration: int = Body(...)):
    try:
        chat_collection.update_many(
            {"user_id": chat_id},
            {
                "$set": {
                    "timer_enabled": duration > 0,
                    "timer_duration": duration * 60,
                    "timer_activated_at": datetime.utcnow()
                }
            }
        )

        if duration == 0:
            return {"message": "Temporizador desactivado. No se eliminaron mensajes."}

        threshold = datetime.utcnow() - timedelta(minutes=duration)

        result = chat_collection.delete_many({
            "user_id": chat_id,
            "timestamp": {"$lt": threshold}
        })

        return {
            "message": f"Temporizador actualizado. {result.deleted_count} mensaje(s) antiguos eliminados.",
            "deleted": result.deleted_count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Eliminar manualmente mensajes expirados
@app.delete("/eliminar-expirados")
def eliminar_mensajes_expirados():
    now = datetime.utcnow()
    total_eliminados = 0

    chats = chat_collection.find({"timer_enabled": True})
    for chat in chats:
        activated_at = chat.get("timer_activated_at")
        duration = chat.get("timer_duration")

        if not activated_at or not duration:
            continue

        umbral = activated_at + timedelta(seconds=duration)
        if now >= umbral:
            result = chat_collection.delete_one({"_id": ObjectId(chat["_id"])})
            total_eliminados += result.deleted_count

    return {"message": f"{total_eliminados} mensaje(s) eliminados por expiración"}
