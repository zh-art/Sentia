from fastapi import APIRouter, Request
import psutil
import GPUtil
import requests
from core.middleware import request_timestamps
from database.mongo_client import client
import os

router = APIRouter()

# Cargar URL base del backend desde .env
origin = os.getenv("BACKEND_BASE_URL", "http://127.0.0.1:8000")

@router.get("/")
async def get_metrics(request: Request):
    # CPU sin delay
    cpu_usage = psutil.cpu_percent(interval=None)

    # GPU
    try:
        gpus = GPUtil.getGPUs()
        gpu_usage = gpus[0].load * 100 if gpus else 0
    except Exception:
        gpu_usage = -1

    # DB status
    try:
        client.admin.command("ping")
        db_status = True
    except:
        db_status = False

    # Health checks
    try:
        r = requests.post(f"{origin}/user/health-systems", data={}, timeout=5)
        health = r.json()
    except Exception as e:
        health = {
            "ia": f"error: {str(e)}",
            "timer": f"error: {str(e)}",
            "scheduler": f"error: {str(e)}",
        }

    return {
        "cpuUsage": cpu_usage,
        "gpuUsage": gpu_usage,
        "dbStatus": db_status,
        "requestFrequency": len(request_timestamps),
        "health": health
    }
