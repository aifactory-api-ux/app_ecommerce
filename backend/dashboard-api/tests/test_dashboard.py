import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import date

from dashboard-api.api.dashboard import router
from dashboard-api.services.dashboard_service import DashboardService
from dashboard-api.db.session import get_db

from app.main import app
from app.database import Base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

import fakeredis.aioredis


TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture
async def db_session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def redis_client():
    fake_redis = fakeredis.aioredis.FakeRedis(decode_responses=True)
    yield fake_redis
    await fake_redis.close()


@pytest_asyncio.fixture
async def client(db_session, redis_client):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_generate_sales_report_valid_dates_returns_200_and_expected_response(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024-06-01", "end_date": "2024-06-30"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "total_sales" in data["summary"]
    assert "total_revenue" in data["summary"]
    assert "period_start" in data["summary"]
    assert "period_end" in data["summary"]
    assert "top_products" in data
    assert isinstance(data["top_products"], list)


@pytest.mark.asyncio
async def test_generate_sales_report_missing_start_date_returns_422(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"end_date": "2024-06-30"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_generate_sales_report_missing_end_date_returns_422(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024-06-01"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_generate_sales_report_invalid_date_format_returns_422(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "06-01-2024", "end_date": "2024-06-30"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_generate_sales_report_start_date_after_end_date_returns_400(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024-07-01", "end_date": "2024-06-30"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_generate_sales_report_empty_database_returns_zero_summary_and_empty_top_products(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024-06-01", "end_date": "2024-06-30"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["total_sales"] == 0
    assert data["summary"]["total_revenue"] == 0.0
    assert data["summary"]["period_start"] == "2024-06-01"
    assert data["summary"]["period_end"] == "2024-06-30"
    assert data["top_products"] == []


@pytest.mark.asyncio
async def test_generate_sales_report_large_date_range_returns_valid_response(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2020-01-01", "end_date": "2024-12-31"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "top_products" in data
    assert data["summary"]["period_start"] == "2020-01-01"
    assert data["summary"]["period_end"] == "2024-12-31"


@pytest.mark.asyncio
async def test_generate_sales_report_nonexistent_endpoint_returns_404(client):
    response = await client.post(
        "/api/dashboard/sales-reportt",
        json={"start_date": "2024-06-01", "end_date": "2024-06-30"}
    )
    assert response.status_code == 404