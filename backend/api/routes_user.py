from fastapi import APIRouter, Path, Body, HTTPException, Depends
from repository.user_repository import actualizar_temporizador_usuario
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.scheduler import iniciar_scheduler
from utils.token_utils import verificar_token

router = APIRouter()
security = HTTPBearer()

@router.get("/health", tags=["User"])
async def user_health():
    return {"status": "200"}

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
