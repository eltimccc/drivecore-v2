from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="DriveCore API",
    description="API для системы управления автопарком",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://frontend:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    """Проверка состояния сервиса"""
    return {"status": "ok"}

@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {"message": "Добро пожаловать в DriveCore API"}
