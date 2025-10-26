from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def ping():
    """Простой ping эндпоинт для проверки API"""
    return {"pong": True}
