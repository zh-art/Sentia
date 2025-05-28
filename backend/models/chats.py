from pydantic import BaseModel
from typing import Literal

class ChatEntrada(BaseModel):
    user_id: str
    message: str
    response: str
    message_type: Literal["normal", "system", "welcome", "rag"] = "normal"