from fastapi import APIRouter, Path, Body, HTTPException, Depends
from repository.user_repository import actualizar_temporizador_usuario
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.scheduler import iniciar_scheduler, scheduler
from utils.token_utils import verificar_token
from fastapi.responses import JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler
from services.chat_service import handle_generate_response
from starlette.requests import Request as StarletteRequest
import json

scheduler = BackgroundScheduler()
router = APIRouter()
security = HTTPBearer()

@router.post("/health-systems")
async def sistema_healthcheck():
    # 1. Verificar IA
    try:
        req = StarletteRequest(scope={
            "type": "http",
            "method": "POST",
            "headers": [],
            "path": "/chat/generate"
        }, receive=lambda: None)

        # Simular body con mensaje corto
        setattr(req, "_body", json.dumps({
            "user_id": "healthcheck",
            "message": "ping",
            "type": "anonymous"
        }).encode("utf-8"))

        result = await handle_generate_response(req)
        ia = "ok" if result.get("response") else "fail"

    except Exception as e:
        ia = f"error: {str(e)}"

    # 2. Verificar Timer
    try:
        actualizar_temporizador_usuario("healthcheck", 5)
        timer = "ok"
    except Exception as e:
        timer = f"error: {str(e)}"

    # 3. Verificar si el scheduler está activo
    try:
        sch = "ok" if scheduler.running else "not running"
    except Exception as e:
        sch = f"error: {str(e)}"

    return JSONResponse({
        "ia": ia,
        "timer": timer,
        "scheduler": sch
    })


@router.put("/timer/{user_id}")
def configurar_temporizador_usuario(user_id: str = Path(...), duration: int = Body(...)):
    try:
        actualizar_temporizador_usuario(user_id, duration)
        return {"message": f"Temporizador configurado para el usuario {user_id} a {duration} minutos."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/start-scheduler")
def start_scheduler(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_data = verificar_token(credentials)
    user_id = user_data.get("sub")

    if not scheduler.running:
        iniciar_scheduler()

    return {"success": True, "message": f"Scheduler activado por {user_id}"}
