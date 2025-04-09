from datetime import datetime, timedelta
from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from sqlalchemy import Column, Integer, Boolean, DateTime
from database import get_db
from models.chat import Chat
from database import SessionLocal
from models.message import Message
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

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    # ... otros campos

    timer_enabled = Column(Boolean, default=False)
    timer_duration = Column(Integer, nullable=True)  # segundos
    timer_activated_at = Column(DateTime, nullable=True)

router = APIRouter()

@router.put("/chat/{chat_id}/timer")
def set_timer(chat_id: int, duration: int, db=Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if duration == 0:
        chat.timer_enabled = False
        chat.timer_duration = None
        chat.timer_activated_at = None
    else:
        chat.timer_enabled = True
        chat.timer_duration = duration
        chat.timer_activated_at = datetime.utcnow()

    db.commit()
    return {"message": "Timer updated"}


def delete_expired_messages():
    db = SessionLocal()
    now = datetime.utcnow()
    chats = db.query(Chat).filter(Chat.timer_enabled == True).all()

    for chat in chats:
        if not chat.timer_activated_at:
            continue

        threshold = now - timedelta(seconds=chat.timer_duration)
        expired_messages = db.query(Message).filter(
            Message.chat_id == chat.id,
            Message.created_at >= chat.timer_activated_at,
            Message.created_at <= threshold
        ).all()

        for msg in expired_messages:
            db.delete(msg)

    db.commit()
    db.close()




