from fastapi import APIRouter, Path, Body, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from repository.user_repository import actualizar_temporizador_usuario
from core.scheduler import iniciar_scheduler, scheduler
from utils.token_utils import verificar_token
from utils.token_utils import get_management_token
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests
import os

scheduler = BackgroundScheduler()
router = APIRouter()
security = HTTPBearer()
AUTH0_API_IDENTIFIER = os.getenv('AUTH0_API_IDENTIFIER')

@router.get("/active")
async def get_active_users():
    token = get_management_token()
    headers = {"Authorization": f"Bearer {token}"}

    five_minutes_ago = (datetime.utcnow() - timedelta(minutes=5)).isoformat(timespec="seconds") + "Z"
    query = f'type:"s" AND date:[{five_minutes_ago} TO *]'

    url = f"{AUTH0_API_IDENTIFIER}logs"
    params = {
        "q": query,
        "search_engine": "v3",
        "per_page": 100
    }

    response = requests.get(url, headers=headers, params=params)
    logs = response.json()

    unique_users = {log["user_id"] for log in logs if "user_id" in log}
    return {"active_users": len(unique_users)}

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
