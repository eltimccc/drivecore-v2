from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Настройки приложения"""
    
    # Database
    postgres_db: str = "drivecore"
    postgres_user: str = "drivecore"
    postgres_password: str = "drivecore"
    postgres_host: str = "postgres"
    postgres_port: int = 5432
    
    # Redis
    redis_url: str = "redis://redis:6379/0"
    
    # Security
    secret_key: str = "your-secret-key-here"
    debug: bool = True
    
    # Timezone
    timezone: str = "Europe/Moscow"
    
    @property
    def database_url(self) -> str:
        """URL для подключения к базе данных"""
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
