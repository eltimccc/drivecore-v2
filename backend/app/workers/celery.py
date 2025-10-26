from celery import Celery
from app.core.config import settings

# Создание экземпляра Celery
celery_app = Celery(
    "drivecore",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.ops"]
)

# Конфигурация Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone=settings.timezone,
    enable_utc=True,
    beat_schedule={
        "heartbeat-task": {
            "task": "app.tasks.ops.heartbeat",
            "schedule": 60.0,  # Каждую минуту
        },
    },
)
