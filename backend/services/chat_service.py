from db.mongo_client import chat_collection
from datetime import datetime
from services.user_service import usuario_existe
from models.chat_model import ChatEntrada, ChatGuardado

def guardar_chat(chat: ChatEntrada):
    if not usuario_existe(chat.user_id):
        return {"error": "Usuario no registrado"}

    chat_document = ChatGuardado(
        user_id=chat.user_id,
        message=chat.message,
        response=chat.response,
        timestamp=datetime.utcnow()
    ).dict()

    chat_collection.insert_one(chat_document)
    return {"msg": "Chat guardado exitosamente"}

def obtener_historial(user_id: str):
    if not usuario_existe(user_id):
        return {"error": "Usuario no registrado"}

    historial = list(chat_collection.find({"user_id": user_id}, {"_id": 0}))
    return historial
