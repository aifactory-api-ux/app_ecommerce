import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.main import app
from app.database import Base, get_db


TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture
async def db_session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


class TestGetSalesSummary:
    @pytest.mark.asyncio
    async def test_get_sales_summary_valid_dates_returns_200_and_summary(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"start_date": "2024-06-01", "end_date": "2024-06-30"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_sales" in data
        assert "total_revenue" in data
        assert "period_start" in data
        assert "period_end" in data
        assert data["period_start"] == "2024-06-01"
        assert data["period_end"] == "2024-06-30"

    @pytest.mark.asyncio
    async def test_get_sales_summary_missing_start_date_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"end_date": "2024-06-30"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_sales_summary_missing_end_date_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"start_date": "2024-06-01"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_sales_summary_invalid_date_format_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"start_date": "2024/06/01", "end_date": "2024-06-30"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_sales_summary_start_date_after_end_date_returns_400(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"start_date": "2024-07-01", "end_date": "2024-06-30"}
        )
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_get_sales_summary_no_sales_in_period_returns_zero_summary(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"start_date": "2023-01-01", "end_date": "2023-01-31"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_sales"] == 0
        assert data["total_revenue"] == 0.0
        assert data["period_start"] == "2023-01-01"
        assert data["period_end"] == "2023-01-31"

    @pytest.mark.asyncio
    async def test_get_sales_summary_large_date_range_returns_correct_aggregation(self, client):
        response = await client.get(
            "/api/dashboard/sales-summary",
            params={"start_date": "2024-01-01", "end_date": "2024-12-31"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_sales" in data
        assert "total_revenue" in data
        assert "period_start" in data
        assert "period_end" in data

    @pytest.mark.asyncio
    async def test_get_sales_summary_database_error_returns_500(self, client, db_session):
        async def raise_db_error():
            raise Exception("Database error")

        app.dependency_overrides[get_db] = lambda: raise_db_error()
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.get(
                "/api/dashboard/sales-summary",
                params={"start_date": "2024-06-01", "end_date": "2024-06-30"}
            )
        assert response.status_code == 500
        app.dependency_overrides.clear()