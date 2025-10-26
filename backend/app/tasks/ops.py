from celery import current_task
from app.workers.celery import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task
def heartbeat():
    """Периодическая задача для проверки работы Celery"""
    logger.info(f"💓 Heartbeat task executed: {current_task.request.id}")
    return {"status": "ok", "message": "Heartbeat успешно выполнен"}
