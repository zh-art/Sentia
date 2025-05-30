from fastapi import APIRouter, Request, Path, Body, HTTPException
from services.chat_service import handle_generate_response, obtener_historial, actualizar_temporizador_usuario
from services.rag_service import answer_with_context
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RAGQuery(BaseModel):
    user_message: str

@router.put("/{user_id}/timer")
async def configurar_temporizador_usuario(user_id: str = Path(...), duration: int = Body(...)):
    try:
        print(duration)
        actualizar_temporizador_usuario(user_id, duration)
        return {"message": f"Temporizador configurado para el usuario {user_id} a {duration} minutos."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate")
async def generate_response(request: Request):
    return await handle_generate_response(request)

@router.get("/historial/{user_id}")
def historial(user_id: str):
    return obtener_historial(user_id)

@router.post("/chat-rag")
def chat_rag(query: RAGQuery):
    result = answer_with_context(query.user_message)
    return {"response": result}
