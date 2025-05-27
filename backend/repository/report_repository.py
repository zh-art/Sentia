from models.reports import Reporte
from database.mongo_client import db
from bson import ObjectId
from datetime import datetime

reportes_collection = db["reportes"]

def guardar_reporte(reporte: Reporte) -> str:
    """Guarda un nuevo reporte para un usuario."""
    reporte_dict = reporte.dict(by_alias=True, exclude_unset=True)
    reporte_dict["created_at"] = datetime.utcnow()
    result = reportes_collection.insert_one(reporte_dict)
    return str(result.inserted_id)

def obtener_reportes_por_usuario(user_id: str) -> list[Reporte]:
    """Obtiene todos los reportes del usuario autenticado."""
    cursor = reportes_collection.find({"user_id": user_id}).sort("created_at", -1)
    return [Reporte(**{**r, "id": str(r["_id"])}) for r in cursor]

def eliminar_reporte_por_id(user_id: str, reporte_id: str) -> bool:
    """Elimina un reporte por su ID, pero solo si pertenece al mismo usuario."""
    result = reportes_collection.delete_one({
        "_id": ObjectId(reporte_id),
        "user_id": user_id
    })
    return result.deleted_count == 1
