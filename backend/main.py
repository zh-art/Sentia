from fastapi import FastAPI, HTTPException, Query, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from transformers import pipeline
from services.chat_service import guardar_chat, obtener_historial
from services.user_service import usuario_existe
from database.mongo_client import chat_collection
from models.chats import ChatEntrada, ChatGuardado
from bson.objectid import ObjectId

app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HuggingFace
pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-V3-0324", trust_remote_code=True)

# Alternativa con CPU (No sirve) pipe = pipeline("text-generation", model="distilgpt2")

# Modelo para entrada de usuario
class UserMessage(BaseModel):
    user_id: str
    message: str

# Modelo para configuración de temporizador
class TimerUpdate(BaseModel):
    user_id: str
    duration_minutes: int  # duración en minutos (0 para desactivar)

# Endpoint para generar respuesta
@app.post("/generate")
def generate_response(data: UserMessage):
    print("[POST /generate] Solicitud recibida:", data.dict())

    if not usuario_existe(data.user_id):
        print("Usuario no registrado:", data.user_id)
        raise HTTPException(status_code=404, detail="Usuario no registrado")

    try:
        print("Generando respuesta con HuggingFace...")
        output = pipe(data.message, max_new_tokens=100, temperature=0.7)
        respuesta = output[0]["generated_text"]
        print("Respuesta generada:", respuesta)

        guardar_chat(ChatEntrada(
            user_id=data.user_id,
            message=data.message,
            response=respuesta
        ))

        return {"response": respuesta}
    except Exception as e:
        print("Error generando respuesta:", str(e))
        raise HTTPException(status_code=500, detail="Error interno al generar respuesta.")


# Endpoint para consultar historial
@app.get("/historial/{user_id}")
def historial(user_id: str):
    return obtener_historial(user_id)

# Endpoint para configurar temporizador
@app.put("/chat/{chat_id}/timer")
def set_timer(chat_id: str = Path(...), duration: int = Body(...)):
    try:
        # Guardar configuración del temporizador
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

        # Calcular umbral para mensajes a eliminar
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

# Endpoint manual para eliminar mensajes expirados
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
