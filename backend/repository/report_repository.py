from models.reports import ReporteBD
from database.mongo_client import db
from bson import ObjectId
from datetime import datetime

reportes_collection = db["reports"]

def guardar_reporte(reporte: ReporteBD) -> str:
    """Guarda un nuevo reporte para un usuario."""
    reporte_dict = reporte.dict(by_alias=True, exclude_unset=True)
    reporte_dict["fecha"] = datetime.utcnow()
    result = reportes_collection.insert_one(reporte_dict)
    return str(result.inserted_id)

def obtener_reportes_por_usuario(user_id: str) -> list[ReporteBD]:
    cursor = reportes_collection.find({"user_id": user_id}).sort("fecha", -1)
    reportes = []
    for r in cursor:
        print("DEBUG - Documento desde Mongo:", r)  # <-- Añade esto
        reporte = ReporteBD(
            user_id=r["user_id"],
            contenido=r["contenido"],
            fecha=r.get("fecha", datetime.utcnow())
        )
        reportes.append(reporte)
    return reportes

def eliminar_reporte_por_id(user_id: str, reporte_id: str) -> bool:
    """Elimina un reporte por su ID, pero solo si pertenece al mismo usuario."""
    result = reportes_collection.delete_one({
        "_id": ObjectId(reporte_id),
        "user_id": user_id
    })
    return result.deleted_count == 1
