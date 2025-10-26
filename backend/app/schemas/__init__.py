from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
import re

from app.models.vehicle import VehicleStatus, VehicleCity

class VehicleBase(BaseModel):
    """Базовая схема автомобиля"""
    plate_number: str = Field(..., min_length=8, max_length=20, description="Государственный номер")
    vin: Optional[str] = Field(None, min_length=17, max_length=17, description="VIN номер")
    brand: str = Field(..., min_length=1, max_length=100, description="Марка")
    model: str = Field(..., min_length=1, max_length=100, description="Модель")
    year: int = Field(..., ge=1990, le=2025, description="Год выпуска")
    color: Optional[str] = Field(None, max_length=50, description="Цвет")
    status: VehicleStatus = Field(VehicleStatus.AVAILABLE, description="Статус")
    mileage_km: int = Field(0, ge=0, description="Пробег в км")
    city: Optional[VehicleCity] = Field(None, description="Город")
    owner_name: Optional[str] = Field(None, max_length=200, description="Владелец")
    osago_policy_number: Optional[str] = Field(None, max_length=50, description="Номер ОСАГО")

    @validator('plate_number')
    def validate_plate_number(cls, v):
        """Валидация российского номера"""
        pattern = r'^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$'
        if not re.match(pattern, v.upper()):
            raise ValueError('Неверный формат номера. Используйте формат: А111АА77')
        return v.upper()

    @validator('vin')
    def validate_vin(cls, v):
        """Валидация VIN номера"""
        if v is None:
            return v
        pattern = r'^[A-HJ-NPR-Z0-9]{17}$'
        if not re.match(pattern, v.upper()):
            raise ValueError('VIN должен содержать 17 символов (латиница и цифры)')
        return v.upper()

class VehicleCreate(VehicleBase):
    """Схема для создания автомобиля"""
    pass

class VehicleUpdate(BaseModel):
    """Схема для обновления автомобиля"""
    plate_number: Optional[str] = Field(None, min_length=8, max_length=20)
    vin: Optional[str] = Field(None, min_length=17, max_length=17)
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    year: Optional[int] = Field(None, ge=1990, le=2025)
    color: Optional[str] = Field(None, max_length=50)
    status: Optional[VehicleStatus] = None
    mileage_km: Optional[int] = Field(None, ge=0)
    city: Optional[VehicleCity] = None
    owner_name: Optional[str] = Field(None, max_length=200)
    osago_policy_number: Optional[str] = Field(None, max_length=50)

    @validator('plate_number')
    def validate_plate_number(cls, v):
        if v is None:
            return v
        pattern = r'^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$'
        if not re.match(pattern, v.upper()):
            raise ValueError('Неверный формат номера. Используйте формат: А111АА77')
        return v.upper()

    @validator('vin')
    def validate_vin(cls, v):
        if v is None:
            return v
        pattern = r'^[A-HJ-NPR-Z0-9]{17}$'
        if not re.match(pattern, v.upper()):
            raise ValueError('VIN должен содержать 17 символов (латиница и цифры)')
        return v.upper()

class VehicleResponse(VehicleBase):
    """Схема ответа с автомобилем"""
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VehicleListResponse(BaseModel):
    """Схема ответа со списком автомобилей"""
    items: List[VehicleResponse]
    page: int
    page_size: int
    total: int

class VehicleFilters(BaseModel):
    """Схема фильтров для поиска автомобилей"""
    q: Optional[str] = Field(None, description="Поиск по номеру, VIN, марке, модели")
    status: Optional[VehicleStatus] = Field(None, description="Фильтр по статусу")
    city: Optional[VehicleCity] = Field(None, description="Фильтр по городу")
    page: int = Field(1, ge=1, description="Номер страницы")
    page_size: int = Field(10, ge=1, le=100, description="Размер страницы")
    ordering: str = Field("-created_at", description="Сортировка")

class ErrorResponse(BaseModel):
    """Схема ошибки"""
    detail: str
