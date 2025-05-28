from pydantic import BaseModel, Field
from datetime import datetime

class ReporteEntrada(BaseModel):
    user_id: str

class ReporteBD(BaseModel):
    user_id: str
    contenido: str
    fecha: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True  
