from fastapi import FastAPI
from core.config import configure_app
from api.routes_chat import router as chat_router
from api.routes_user import router as user_router
from core.scheduler import iniciar_scheduler

app = FastAPI()

configure_app(app)
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(user_router, prefix="/user", tags=["User"])

iniciar_scheduler()
