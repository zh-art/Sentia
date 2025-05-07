from jose import jwt
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
import requests
import os

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_IDENTIFIER = os.getenv("AUTH0_API_IDENTIFIER")
JWKS_URL = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"

ALGORITHMS = ["RS256"]

def obtener_jwk():
    jwks = requests.get(JWKS_URL).json()
    return {key["kid"]: key for key in jwks["keys"]}

def verificar_token(credentials: HTTPAuthorizationCredentials):
    token = credentials.credentials
    print("[DEBUG] Token recibido:", token)
    jwks = obtener_jwk()

    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    key = jwks.get(kid)

    if not key:
        raise HTTPException(status_code=401, detail="Clave pública no encontrada")

    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=ALGORITHMS,
            audience=API_IDENTIFIER,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


def construir_input_con_historial(prompt, historial, message, tokenizer, max_tokens=1024):
    prompt_tokens = tokenizer.encode(prompt, return_tensors="pt").shape[-1]
    message_tokens = tokenizer.encode(message + tokenizer.eos_token, return_tensors="pt").shape[-1]
    available_tokens = max_tokens - prompt_tokens - message_tokens

    history_text = ""
    tokens_used = 0
    mensajes_usados = 0

    for item in reversed(historial):
        chunk = item["message"] + tokenizer.eos_token + item["response"] + tokenizer.eos_token
        chunk_tokens = tokenizer.encode(chunk, return_tensors="pt").shape[-1]

        if tokens_used + chunk_tokens > available_tokens:
            break
        history_text = chunk + history_text
        tokens_used += chunk_tokens
        mensajes_usados += 1

    print(f"[INFO] Prompt: {prompt_tokens} | Message: {message_tokens} | Historial tokens: {tokens_used} | Mensajes usados: {mensajes_usados}")
    return prompt +  history_text + message + tokenizer.eos_token
