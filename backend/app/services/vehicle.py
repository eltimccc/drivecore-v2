from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional, Tuple
from uuid import UUID

from app.models.vehicle import Vehicle, VehicleStatus, VehicleCity
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleFilters

class VehicleService:
    """Сервис для работы с автомобилями"""
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_vehicles(
        self, 
        filters: VehicleFilters
    ) -> Tuple[List[Vehicle], int]:
        """Получить список автомобилей с фильтрацией и пагинацией"""
        
        # Базовый запрос
        query = select(Vehicle)
        count_query = select(func.count(Vehicle.id))
        
        # Применяем фильтры
        conditions = []
        
        if filters.q:
            search_term = f"%{filters.q}%"
            conditions.append(
                or_(
                    Vehicle.plate_number.ilike(search_term),
                    Vehicle.vin.ilike(search_term),
                    Vehicle.brand.ilike(search_term),
                    Vehicle.model.ilike(search_term)
                )
            )
        
        if filters.status:
            conditions.append(Vehicle.status == filters.status)
            
        if filters.city:
            conditions.append(Vehicle.city == filters.city)
        
        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))
        
        # Применяем сортировку
        if filters.ordering.startswith('-'):
            order_field = filters.ordering[1:]
            if hasattr(Vehicle, order_field):
                query = query.order_by(getattr(Vehicle, order_field).desc())
        else:
            if hasattr(Vehicle, filters.ordering):
                query = query.order_by(getattr(Vehicle, filters.ordering))
        
        # Применяем пагинацию
        offset = (filters.page - 1) * filters.page_size
        query = query.offset(offset).limit(filters.page_size)
        
        # Выполняем запросы
        result = await self.db.execute(query)
        vehicles = result.scalars().all()
        
        count_result = await self.db.execute(count_query)
        total = count_result.scalar()
        
        return vehicles, total

    async def get_vehicle_by_id(self, vehicle_id: UUID) -> Optional[Vehicle]:
        """Получить автомобиль по ID"""
        query = select(Vehicle).where(Vehicle.id == vehicle_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_vehicle_by_plate(self, plate_number: str) -> Optional[Vehicle]:
        """Получить автомобиль по номеру"""
        query = select(Vehicle).where(Vehicle.plate_number == plate_number.upper())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_vehicle(self, vehicle_data: VehicleCreate) -> Vehicle:
        """Создать новый автомобиль"""
        
        # Проверяем уникальность номера
        existing = await self.get_vehicle_by_plate(vehicle_data.plate_number)
        if existing:
            raise ValueError("Автомобиль с таким номером уже существует")
        
        # Проверяем уникальность VIN (если указан)
        if vehicle_data.vin:
            vin_query = select(Vehicle).where(Vehicle.vin == vehicle_data.vin.upper())
            vin_result = await self.db.execute(vin_query)
            if vin_result.scalar_one_or_none():
                raise ValueError("Автомобиль с таким VIN уже существует")
        
        # Создаем новый автомобиль
        vehicle = Vehicle(**vehicle_data.dict())
        self.db.add(vehicle)
        await self.db.commit()
        await self.db.refresh(vehicle)
        
        return vehicle

    async def update_vehicle(
        self, 
        vehicle_id: UUID, 
        vehicle_data: VehicleUpdate
    ) -> Optional[Vehicle]:
        """Обновить автомобиль"""
        
        vehicle = await self.get_vehicle_by_id(vehicle_id)
        if not vehicle:
            return None
        
        # Проверяем уникальность номера (если изменяется)
        if vehicle_data.plate_number and vehicle_data.plate_number != vehicle.plate_number:
            existing = await self.get_vehicle_by_plate(vehicle_data.plate_number)
            if existing:
                raise ValueError("Автомобиль с таким номером уже существует")
        
        # Проверяем уникальность VIN (если изменяется)
        if vehicle_data.vin and vehicle_data.vin != vehicle.vin:
            vin_query = select(Vehicle).where(Vehicle.vin == vehicle_data.vin.upper())
            vin_result = await self.db.execute(vin_query)
            if vin_result.scalar_one_or_none():
                raise ValueError("Автомобиль с таким VIN уже существует")
        
        # Обновляем поля
        update_data = vehicle_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(vehicle, field, value)
        
        await self.db.commit()
        await self.db.refresh(vehicle)
        
        return vehicle

    async def delete_vehicle(self, vehicle_id: UUID) -> bool:
        """Удалить автомобиль"""
        
        vehicle = await self.get_vehicle_by_id(vehicle_id)
        if not vehicle:
            return False
        
        await self.db.delete(vehicle)
        await self.db.commit()
        
        return True
