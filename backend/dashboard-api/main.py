from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.dashboard-api.api import router as dashboard_router

settings_dict = {
    "DATABASE_URL": "sqlite+aiosqlite:///:memory:",
    "DEBUG": False,
    "CORS_ORIGINS": ["*"],
}


class FakeSettings:
    def __init__(self, d):
        for k, v in d.items():
            setattr(self, k, v)


settings = FakeSettings(settings_dict)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Dashboard API",
    description="API for dashboard analytics",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/health")
async def health():
    return {"status": "ok"}