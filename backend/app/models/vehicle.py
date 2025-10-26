from sqlalchemy import Column, String, Integer, Enum, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import re
from datetime import datetime
from typing import Optional
import enum

from .base import Base, UUIDMixin, TimestampMixin

class VehicleStatus(enum.Enum):
    """Статусы автомобиля"""
    AVAILABLE = "AVAILABLE"
    RENTED_TAXI = "RENTED_TAXI"
    RENTED_TOUR = "RENTED_TOUR"
    MAINTENANCE = "MAINTENANCE"
    INSPECTION = "INSPECTION"
    INACTIVE = "INACTIVE"

class VehicleCity(enum.Enum):
    """Города"""
    PSKOV = "Псков"
    PECHORY = "Печоры"
    SEBEZH = "Себеж"
    OSTROV = "Остров"
    OPOCHKA = "Опочка"

class Vehicle(Base, UUIDMixin, TimestampMixin):
    """Модель автомобиля"""
    __tablename__ = "vehicles"

    # Основные поля
    plate_number = Column(String(20), nullable=False, unique=True, index=True)
    vin = Column(String(17), nullable=True, unique=True, index=True)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    color = Column(String(50), nullable=True)
    status = Column(Enum(VehicleStatus), nullable=False, default=VehicleStatus.AVAILABLE, index=True)
    mileage_km = Column(Integer, nullable=False, default=0)
    city = Column(Enum(VehicleCity), nullable=True, index=True)
    owner_name = Column(String(200), nullable=True)
    osago_policy_number = Column(String(50), nullable=True)

    # Индексы
    __table_args__ = (
        Index('idx_vehicle_status', 'status'),
        Index('idx_vehicle_city', 'city'),
        Index('idx_vehicle_plate_unique', 'plate_number', unique=True),
        Index('idx_vehicle_vin_unique', 'vin', unique=True, postgresql_where=vin.isnot(None)),
        CheckConstraint('year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 1', name='check_year_range'),
        CheckConstraint('mileage_km >= 0', name='check_mileage_positive'),
        CheckConstraint("plate_number ~ '^[АВЕКМНОРСТУХ]\\d{3}[АВЕКМНОРСТУХ]{2}\\d{2,3}$'", name='check_plate_format'),
        CheckConstraint("vin ~ '^[A-HJ-NPR-Z0-9]{17}$'", name='check_vin_format'),
    )

    def __repr__(self):
        return f"<Vehicle(plate_number='{self.plate_number}', brand='{self.brand}', model='{self.model}')>"

    @staticmethod
    def validate_plate_number(plate_number: str) -> bool:
        """Валидация российского номера"""
        pattern = r'^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$'
        return bool(re.match(pattern, plate_number.upper()))

    @staticmethod
    def validate_vin(vin: str) -> bool:
        """Валидация VIN номера"""
        if not vin:
            return True  # VIN опциональный
        pattern = r'^[A-HJ-NPR-Z0-9]{17}$'
        return bool(re.match(pattern, vin.upper()))

    @staticmethod
    def validate_year(year: int) -> bool:
        """Валидация года выпуска"""
        current_year = datetime.now().year
        return 1990 <= year <= current_year + 1
