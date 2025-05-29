from backend.database.mongo_client import user_collection

def usuario_existe(user_id: str) -> bool:
    return user_collection.find_one({"user_id": user_id}) is not None


def crear_usuario_si_no_existe(user_id: str):
    if not usuario_existe(user_id):
        user_collection.insert_one({
            "user_id": user_id,
            "name": "Usuario Anónimo"
        })
