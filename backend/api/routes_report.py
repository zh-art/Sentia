from fastapi import APIRouter, HTTPException, Query
from services.report_service import (
    generar_reporte_semanal,
    obtener_reportes_usuario,
    eliminar_reporte_usuario
)
from models.reports import ReporteEntrada, ReporteBD
from typing import List

router = APIRouter(prefix="/reporte", tags=["reporte"])

@router.post("/generar")
async def generar_reporte(data: ReporteEntrada):
    return await generar_reporte_semanal(data.user_id)

@router.get("/", response_model=List[ReporteBD])
async def listar_reportes(user_id: str = Query(..., description="ID del usuario")):
    reportes = obtener_reportes_usuario(user_id)
    if not reportes:
        raise HTTPException(status_code=404, detail="No se encontraron reportes para este usuario.")
    return reportes

@router.delete("/{reporte_id}")
async def eliminar_reporte(reporte_id: str, user_id: str = Query(...)):
    eliminado = eliminar_reporte_usuario(reporte_id, user_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="No se pudo eliminar el reporte.")
    return {"mensaje": "Reporte eliminado correctamente"}
