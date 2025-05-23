from fastapi import APIRouter, Request
from core.middleware import request_timestamps
from database.mongo_client import client
import psutil
import GPUtil

router = APIRouter()

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

    # Uso de base de datos MongoDB
    try:
        db_stats = client.admin.command("dbStats")
        db_storage_usage_mb = db_stats.get("storageSize", 0) / (1024 * 1024)  # en MB
        db_max_allowed_mb = 1024

        if db_max_allowed_mb > 0:
            db_storage_usage_percent = round((db_storage_usage_mb / db_max_allowed_mb) * 100, 2)
        else:
            db_storage_usage_percent = -1
    except Exception:
        db_storage_usage_mb = -1
        db_storage_usage_percent = -1

    return {
    "cpuUsage": cpu_usage,
    "gpuUsage": gpu_usage,
    "dbStorageUsage": db_storage_usage_mb,
    "dbStorageUsagePercent": db_storage_usage_percent,
    "requestFrequency": len(request_timestamps),
    "usersActivity": ""
}