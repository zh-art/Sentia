from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# Inicializar FastAPI
app = FastAPI()

# Permitir conexión desde Next.js (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo de Hugging Face
pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-V3-0324", trust_remote_code=True)

# Esquema del cuerpo de solicitud
class UserMessage(BaseModel):
    message: str

@app.post("/generate")
def generate_response(user_input: UserMessage):
    output = pipe(user_input.message, max_new_tokens=100, temperature=0.7)
    return {"response": output[0]["generated_text"]}
