from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@postgres:5500/ecommerce"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@postgres:5500/ecommerce"

    DASHBOARD_API_PORT: int = 23010

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()