from database.mongo_client import user_collection

def usuario_existe(user_id: str) -> bool:
    return user_collection.find_one({"user_id": user_id}) is not None


def crear_usuario_si_no_existe(user_id: str):
    if not usuario_existe(user_id):
        user_collection.insert_one({
            "user_id": user_id,
            "name": "Usuario Anónimo"
        })

def actualizar_temporizador_usuario(user_id: str, duration: int):
    if not user_id or duration < 0:
        raise ValueError("Parámetros inválidos")

    user_collection.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "timer_enabled": duration > 0,
                "timer_duration": duration * 60  # Guardar en segundos
            }
        },
        upsert=True
    )