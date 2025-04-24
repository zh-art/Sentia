from apscheduler.schedulers.background import BackgroundScheduler
from repository.chat_repository import eliminar_mensajes_expirados
from database.mongo_client import chat_collection

def eliminar_mensajes_expirados_global():
    user_ids = chat_collection.distinct("user_id", {"timer_enabled": True})
    total_eliminados = 0

    for user_id in user_ids:
        eliminados = eliminar_mensajes_expirados(user_id)
        total_eliminados += eliminados

    print(f"[Scheduler] Se eliminaron {total_eliminados} mensajes expirados.")

scheduler = BackgroundScheduler()

def iniciar_scheduler():
    scheduler.add_job(eliminar_mensajes_expirados_global, "interval", minutes=5)  # cada 5 minutos hace la revisión
    scheduler.start()
    print("[Scheduler] Tareas programadas iniciadas.")
