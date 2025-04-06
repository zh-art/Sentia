from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
from models.chat_model import ChatEntrada
from services.chat_service import guardar_chat, obtener_historial

# Inicializar FastAPI
app = FastAPI()

# Permitir conexión desde Next.js (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo de Hugging Face
pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-V3-0324", trust_remote_code=True)

# Esquema del cuerpo de solicitud
class UserMessage(BaseModel):
    message: str

@app.post("/generate")
def generate_response(user_input: UserMessage):
    output = pipe(user_input.message, max_new_tokens=100, temperature=0.7)
    return {"response": output[0]["generated_text"]}

@app.post("/guardar-chat")
def guardar(chat: ChatEntrada):
    return guardar_chat(chat)

@app.get("/historial/{user_id}")
def historial(user_id: str):
    return obtener_historial(user_id)