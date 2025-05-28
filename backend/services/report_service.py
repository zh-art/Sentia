from openai import OpenAI
from datetime import datetime
from core.config import client
from fastapi import HTTPException
from models.reports import ReporteBD
from repository.report_repository import (
    guardar_reporte,
    obtener_reportes_por_usuario,
    eliminar_reporte_por_id
)

async def generar_reporte_semanal(user_id: str):
    try:
        prompt = (
            "Imagina que eres un acompañante emocional para alguien con síntomas depresivos. "
            "Genera un reporte de seguimiento semanal personalizado que incluya una lista de actividades "
            "emocionales o físicas (como meditación, caminar, escribir un diario, conversar con alguien cercano) "
            "que pueden apoyar el bienestar del usuario. No recetes medicamentos ni sugieras diagnóstico. "
            "Presenta la información en tono empático y motivador, como un diario o guía."
        )

        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Necesito un seguimiento terapéutico para esta semana."}
        ]

        completion = client.chat.completions.create(
            model="ft:gpt-4o-mini-2024-07-18:sentia:dataset-depresion-sentia-v1:BbYv6ZsM",
            messages=messages
        )

        contenido_reporte = completion.choices[0].message.content

        reporte = ReporteBD(
            user_id=user_id,
            contenido=contenido_reporte
        )

        reporte_id = guardar_reporte(reporte)
        return {"reporte_id": reporte_id, "contenido": contenido_reporte}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el reporte: {str(e)}")


def obtener_reportes_usuario(user_id: str):
    return obtener_reportes_por_usuario(user_id)


def eliminar_reporte_usuario(reporte_id: str, user_id: str):
    return eliminar_reporte_por_id(user_id, reporte_id)
