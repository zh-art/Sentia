from database.mongo_client import user_collection

def usuario_existe(user_id: str) -> bool:
    return user_collection.find_one({"user_id": user_id}) is not None