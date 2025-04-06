from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatEntrada(BaseModel):
    user_id: str
    message: str
    response: str

class ChatGuardado(BaseModel):
    user_id: str
    message: str
    response: str
    timestamp: Optional[datetime]
