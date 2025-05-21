from database.mongo_client import chat_collection, user_collection
from models.chats import ChatEntrada
from datetime import datetime, timedelta

def actualizar_temporizador(user_id: str, duration_minutes: int):
    chat_collection.update_many(
        {"user_id": user_id},
        {
            "$set": {
                "timer_enabled": duration_minutes > 0,
                "timer_duration": duration_minutes * 60,  # en segundos
                "timer_activated_at": datetime.utcnow()
            }
        }
    )

def eliminar_mensajes_expirados(user_id: str):
    now = datetime.utcnow()

    # Solo eliminar los que hayan alcanzado su tiempo individual
    result = chat_collection.delete_many({
        "user_id": user_id,
        "timer_enabled": True,
        "delete_after": {"$lte": now}
    })

    return result.deleted_count

def guardar_chat(chat: ChatEntrada, timer_enabled: bool = False, timer_duration: int = 0):
    timestamp = datetime.utcnow()
    chat_data = {
        "user_id": chat.user_id,
        "message": chat.message,
        "response": chat.response,
        "timestamp": timestamp,
        "timer_enabled": timer_enabled,
    }

    if timer_enabled and timer_duration > 0:
        chat_data.update({
            "timer_duration": timer_duration,
            "delete_after": datetime.utcnow() + timedelta(seconds=timer_duration)
        })
    else:
        chat_data["timer_enabled"] = False  

    chat_collection.insert_one(chat_data)

def obtener_historial(user_id: str):
    resultados =  list(chat_collection.find({"user_id": user_id}).sort("timestamp", 1))
    for r in resultados:
        r["_id"] = str(r["_id"])
    return resultados

def obtener_configuracion_temporizador_usuario(user_id: str):
    usuario = user_collection.find_one({"user_id": user_id})
    if not usuario:
        return {"enabled": False, "duration": 0}

    return {
        "enabled": usuario.get("timer_enabled", False),
        "duration": usuario.get("timer_duration", 0)
    }
