from pydantic import BaseModel

class Usuario(BaseModel):
    user_id: str
    nombre: str
