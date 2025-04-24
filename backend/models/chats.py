from pydantic import BaseModel

class ChatEntrada(BaseModel):
    user_id: str
    message: str
    response: str
