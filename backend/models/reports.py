from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReporteEntrada(BaseModel):
    user_id: str

class ReporteBD(BaseModel):
    user_id: str
    contenido: str
    fecha: datetime = Field(default_factory=datetime.utcnow)
