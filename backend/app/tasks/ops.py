from celery import current_task
from app.workers.celery import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task
def heartbeat():
    """Периодическая задача для проверки работы Celery"""
    logger.info(f"💓 Heartbeat task executed: {current_task.request.id}")
    return {"status": "ok", "message": "Heartbeat успешно выполнен"}

@celery_app.task
def vehicle_created_event(vehicle_id: str):
    """Задача, выполняемая при создании автомобиля"""
    logger.info(f"🚗 Авто создано: {vehicle_id}")
    return {"status": "success", "message": f"Автомобиль {vehicle_id} успешно создан"}
