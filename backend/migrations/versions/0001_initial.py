"""Initial migration

Revision ID: 0001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Первичная миграция - создание базовой структуры"""
    # Пока что пустая миграция, но структура готова для будущих моделей
    pass


def downgrade() -> None:
    """Откат миграции"""
    pass
