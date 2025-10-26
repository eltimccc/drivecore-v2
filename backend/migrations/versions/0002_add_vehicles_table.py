"""Add vehicles table

Revision ID: 0002
Revises: 0001
Create Date: 2024-01-15 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Создание таблицы vehicles"""
    # Создаем enum типы
    vehicle_status_enum = postgresql.ENUM(
        'AVAILABLE', 'RENTED_TAXI', 'RENTED_TOUR', 'MAINTENANCE', 'INSPECTION', 'INACTIVE',
        name='vehiclestatus',
        create_type=False
    )
    vehicle_status_enum.create(op.get_bind())
    
    vehicle_city_enum = postgresql.ENUM(
        'Псков', 'Печоры', 'Себеж', 'Остров', 'Опочка',
        name='vehiclecity',
        create_type=False
    )
    vehicle_city_enum.create(op.get_bind())
    
    # Создаем таблицу vehicles
    op.create_table('vehicles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('plate_number', sa.String(length=20), nullable=False),
        sa.Column('vin', sa.String(length=17), nullable=True),
        sa.Column('brand', sa.String(length=100), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('status', vehicle_status_enum, nullable=False, server_default='AVAILABLE'),
        sa.Column('mileage_km', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('city', vehicle_city_enum, nullable=True),
        sa.Column('owner_name', sa.String(length=200), nullable=True),
        sa.Column('osago_policy_number', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Создаем индексы
    op.create_index('idx_vehicle_status', 'vehicles', ['status'])
    op.create_index('idx_vehicle_city', 'vehicles', ['city'])
    op.create_index('idx_vehicle_plate_unique', 'vehicles', ['plate_number'], unique=True)
    op.create_index('idx_vehicle_vin_unique', 'vehicles', ['vin'], unique=True, postgresql_where=sa.text('vin IS NOT NULL'))
    
    # Создаем ограничения
    op.create_check_constraint(
        'check_year_range',
        'vehicles',
        'year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 1'
    )
    op.create_check_constraint(
        'check_mileage_positive',
        'vehicles',
        'mileage_km >= 0'
    )
    op.create_check_constraint(
        'check_plate_format',
        'vehicles',
        "plate_number ~ '^[АВЕКМНОРСТУХ]\\d{3}[АВЕКМНОРСТУХ]{2}\\d{2,3}$'"
    )
    op.create_check_constraint(
        'check_vin_format',
        'vehicles',
        "vin ~ '^[A-HJ-NPR-Z0-9]{17}$'"
    )


def downgrade() -> None:
    """Удаление таблицы vehicles"""
    op.drop_table('vehicles')
    op.execute('DROP TYPE IF EXISTS vehiclestatus')
    op.execute('DROP TYPE IF EXISTS vehiclecity')
