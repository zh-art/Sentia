from fastapi import FastAPI
from core.config import configure_app
from core.middleware import RequestTrackerMiddleware
from api.routes_chat import router as chat_router
from api.routes_user import router as user_router
from api.routes_metrics import router as metrics_router
from api.routes_health import router as health_router
from api.routes_report import router as report_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

configure_app(app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestTrackerMiddleware)
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(metrics_router, prefix="/admin/metrics", tags=["AdminMetrics"])
app.include_router(health_router, prefix="/health", tags=["Health"])
app.include_router(report_router,prefix="/reporte", tags=["reporte"])

@app.get("/debug/routes")
def listar_rutas():
    return [route.path for route in app.routes]