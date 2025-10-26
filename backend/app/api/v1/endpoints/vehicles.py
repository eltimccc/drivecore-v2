from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID
import logging

from app.core.database import get_db
from app.schemas.vehicle import (
    VehicleCreate, 
    VehicleUpdate, 
    VehicleResponse, 
    VehicleListResponse,
    VehicleFilters,
    ErrorResponse
)
from app.services.vehicle import VehicleService
from app.tasks.ops import vehicle_created_event

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.get(
    "/",
    response_model=VehicleListResponse,
    summary="Получить список автомобилей",
    description="Получить список автомобилей с фильтрацией, поиском и пагинацией"
)
async def get_vehicles(
    q: Optional[str] = Query(None, description="Поиск по номеру, VIN, марке, модели"),
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    city: Optional[str] = Query(None, description="Фильтр по городу"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    page_size: int = Query(10, ge=1, le=100, description="Размер страницы"),
    ordering: str = Query("-created_at", description="Сортировка"),
    db: AsyncSession = Depends(get_db)
):
    """Получить список автомобилей"""
    try:
        filters = VehicleFilters(
            q=q,
            status=status,
            city=city,
            page=page,
            page_size=page_size,
            ordering=ordering
        )
        
        service = VehicleService(db)
        vehicles, total = await service.get_vehicles(filters)
        
        return VehicleListResponse(
            items=vehicles,
            page=page,
            page_size=page_size,
            total=total
        )
    except Exception as e:
        logger.error(f"Ошибка при получении списка автомобилей: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера"
        )

@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    summary="Получить автомобиль по ID",
    description="Получить детальную информацию об автомобиле"
)
async def get_vehicle(
    vehicle_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Получить автомобиль по ID"""
    try:
        service = VehicleService(db)
        vehicle = await service.get_vehicle_by_id(vehicle_id)
        
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Автомобиль не найден"
            )
        
        return vehicle
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении автомобиля {vehicle_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера"
        )

@router.post(
    "/",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать автомобиль",
    description="Создать новый автомобиль в автопарке"
)
async def create_vehicle(
    vehicle_data: VehicleCreate,
    db: AsyncSession = Depends(get_db)
):
    """Создать новый автомобиль"""
    try:
        service = VehicleService(db)
        vehicle = await service.create_vehicle(vehicle_data)
        
        # Отправляем задачу в Celery
        vehicle_created_event.delay(str(vehicle.id))
        
        logger.info(f"Создан автомобиль: {vehicle.plate_number} (ID: {vehicle.id})")
        
        return vehicle
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Ошибка при создании автомобиля: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера"
        )

@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse,
    summary="Обновить автомобиль",
    description="Обновить информацию об автомобиле"
)
async def update_vehicle(
    vehicle_id: UUID,
    vehicle_data: VehicleUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Обновить автомобиль"""
    try:
        service = VehicleService(db)
        vehicle = await service.update_vehicle(vehicle_id, vehicle_data)
        
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Автомобиль не найден"
            )
        
        logger.info(f"Обновлен автомобиль: {vehicle.plate_number} (ID: {vehicle.id})")
        
        return vehicle
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при обновлении автомобиля {vehicle_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера"
        )

@router.delete(
    "/{vehicle_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить автомобиль",
    description="Удалить автомобиль из автопарка"
)
async def delete_vehicle(
    vehicle_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Удалить автомобиль"""
    try:
        service = VehicleService(db)
        success = await service.delete_vehicle(vehicle_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Автомобиль не найден"
            )
        
        logger.info(f"Удален автомобиль (ID: {vehicle_id})")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при удалении автомобиля {vehicle_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера"
        )
