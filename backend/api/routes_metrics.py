from fastapi import APIRouter, Request
from starlette.responses import JSONResponse
import psutil
import GPUtil
import requests
import os

from core.middleware import request_timestamps
from database.mongo_client import client
# from utils.token_utils import validate_admin_jwt

router = APIRouter()

# Middleware de autorización (desactivado por ahora)
def verify_admin(request: Request):
    token = request.headers.get("Authorization", "").removeprefix("Bearer ")
    # if not validate_admin_jwt(token):
    #     raise HTTPException(403, "Forbidden")
    return True

@router.get("/")  # , dependencies=[Depends(verify_admin)]
async def get_metrics(request: Request):
    # Uso de CPU
    cpu_usage = psutil.cpu_percent(interval=1)

    # Uso de GPU (si existe)
    try:
        gpus = GPUtil.getGPUs()
        gpu_usage = gpus[0].load * 100 if gpus else 0
    except Exception:
        gpu_usage = -1

    # Estado de la base de datos
    try:
        client.admin.command("ping")
        db_status = True

        stats = client["sentia_db"].command("dbstats")
        db_storage_used = stats.get("storageSize", 0)  # en bytes
        db_storage_total = stats.get("fsUsedSize", stats.get("storageSize", 1))  # evita div 0
        db_storage_usage = (db_storage_used / db_storage_total) * 100

    except Exception:
        db_status = False
        db_storage_usage = 0.0


    # Frecuencia de peticiones (último minuto)
    request_frequency = len(request_timestamps)

    # Healthchecks por endpoint
    base_url = os.getenv("BACKEND_BASE_URL", "http://localhost:8000")

    async def hc(path: str, method="GET", data=None):
        url = f"{base_url}{path}"
        try:
            if method == "GET":
                r = requests.get(url, timeout=10)
            elif method == "POST":
                r = requests.post(url, json=data or {}, timeout=10)
            elif method == "PUT":
                r = requests.put(url, json=data or {}, timeout=10)
            else:
                return "unsupported"

            return "up" if r.ok else f"down ({r.status_code})"
        except Exception as e:
            return f"error: {str(e)}"

    health = {
        "login":     await hc("/user/health"),
        "ia":        await hc("/chat/generate", method="POST", data={"user_id": "healthcheck", "message": "ping", "type": "anonymous"}),
        "scheduler": await hc("/user/start-scheduler", method="POST"),
        "timer":     await hc("/user/timer/test", method="PUT", data={"duration": 0}),
        "dbStatus":  "up" if db_status else "down",
    }

    return JSONResponse({
        "cpuUsage": cpu_usage,
        "gpuUsage": gpu_usage,
        "requestFrequency": request_frequency,
        "health": health,
        "dbStorageUsage": round(db_storage_usage, 2),
    })
