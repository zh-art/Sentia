from fastapi import APIRouter, Path, Body, HTTPException
from repository.user_repository import actualizar_temporizador_usuario

router = APIRouter()

@router.put("/timer/{user_id}")
def configurar_temporizador_usuario(user_id: str = Path(...), duration: int = Body(...)):
    try:
        actualizar_temporizador_usuario(user_id, duration)
        return {"message": f"Temporizador configurado para el usuario {user_id} a {duration} minutos."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))