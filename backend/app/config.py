from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@postgres:5500/ecommerce"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@postgres:5500/ecommerce"

    REDIS_URL: str = "redis://redis:6500/0"

    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    CORS_ORIGINS: list[str] = ["http://localhost:3500"]

    ADMIN_EMAIL: str = "admin@ecommerce.local"
    ADMIN_PASSWORD: str = "Admin123!"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
