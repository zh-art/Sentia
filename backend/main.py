from fastapi import FastAPI
from core.config import configure_app
from core.middleware import RequestTrackerMiddleware
from api.routes_chat import router as chat_router
from api.routes_user import router as user_router
from api.routes_metrics import router as metrics_router

app = FastAPI()

configure_app(app)
app.add_middleware(RequestTrackerMiddleware)
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(metrics_router, prefix="/admin/metrics", tags=["AdminMetrics"])

@app.get("/debug/routes")
def listar_rutas():
    return [route.path for route in app.routes]