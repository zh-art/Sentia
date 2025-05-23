from fastapi import APIRouter, HTTPException
from core.config import client as openai_client
from core.scheduler import scheduler
from database.mongo_client import client as mongo_client
from repository.user_repository import actualizar_temporizador_usuario
from openai import AuthenticationError
import httpx
import os

router = APIRouter()

@router.get("/ia-auth")
async def health_ia_auth():
    try:
        openai_client.models.list()
        return {"status": "ok", "message": "API key válida"}
    except AuthenticationError:
        raise HTTPException(status_code=401, detail="API key inválida o expirada")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error desconocido: {str(e)}")

@router.get("/ia-api")
async def health_ia_api():
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        headers = {"Authorization": f"Bearer {api_key}"}
        response = httpx.get("https://api.openai.com/v1/models", headers=headers, timeout=3)

        if response.status_code == 200:
            return {"status": "ok", "message": "API disponible"}
        else:
            return {"status": "error", "message": f"API respondió con {response.status_code}"}
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="API no disponible (timeout o red)")

@router.get("/timer")
async def health_timer():
    try:
        actualizar_temporizador_usuario("healthcheck", 5)
        return {"status": "ok", "message": "Temporizador funcionando"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en temporizador: {str(e)}")

@router.get("/scheduler")
async def health_scheduler():
    try:
        if scheduler.running:
            return {"status": "ok", "message": "Scheduler activo"}
        else:
            return {"status": "warn", "message": "Scheduler no iniciado, pero funcional"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en scheduler: {str(e)}")

@router.get("/db")
async def health_db():
    try:
        mongo_client.admin.command("ping")
        return {"status": "ok", "message": "Base de datos activa"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Base de datos no disponible: " + str(e))
