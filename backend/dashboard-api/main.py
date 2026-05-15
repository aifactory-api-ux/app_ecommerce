from fastapi import FastAPI

from api import router

app = FastAPI(title="Dashboard API", version="1.0.0")
app.include_router(router, prefix="/api/dashboard", tags=["dashboard"])