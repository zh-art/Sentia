from backend.database.mongo_client import user_collection

def crear_usuario_si_no_existe(user_id: str):
    if not user_collection.find_one({"user_id": user_id}):
        user_collection.insert_one({
            "user_id": user_id,
            "timer_enabled": False,
            "timer_duration": 0
        })

def actualizar_temporizador_usuario(user_id: str, duration_minutes: int):
    if duration_minutes not in [0, 5, 1440, 10080, 129600]:
        raise ValueError("Duración no permitida")

    user_collection.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "timer_enabled": duration_minutes > 0,
                "timer_duration": duration_minutes * 60  # segundos
            }
        }
    )

def obtener_configuracion_temporizador_usuario(user_id: str):
    usuario = user_collection.find_one({"user_id": user_id})
    if not usuario:
        return {"enabled": False, "duration": 0}

    return {
        "enabled": usuario.get("timer_enabled", False),
        "duration": usuario.get("timer_duration", 0)
    }
