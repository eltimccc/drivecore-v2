from fastapi import APIRouter
from app.api.v1.endpoints import ping, vehicles

api_router = APIRouter()

# Подключение эндпоинтов
api_router.include_router(ping.router, prefix="/ping", tags=["ping"])
api_router.include_router(vehicles.router, tags=["vehicles"])
