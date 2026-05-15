import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import date

from dashboard_api.api.dashboard import router
from dashboard_api.services.dashboard_service import DashboardService
from dashboard_api.db.session import get_db

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
async def test_get_top_products_happy_path_returns_top_products(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 3}
    )
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert isinstance(data["products"], list)
    assert len(data["products"]) <= 3
    for product in data["products"]:
        assert "product_id" in product
        assert "product_name" in product
        assert "units_sold" in product
        assert "revenue" in product


@pytest.mark.asyncio
async def test_get_top_products_missing_start_date_returns_422(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"end_date": "2024-01-31", "limit": 5}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_missing_end_date_returns_422(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-01-01", "limit": 5}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_invalid_date_format_returns_422(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024/01/01", "end_date": "2024-01-31"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_limit_not_integer_returns_422(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": "five"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_limit_less_than_one_returns_422(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 0}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_default_limit_is_5(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-01-01", "end_date": "2024-01-31"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "products" in data


@pytest.mark.asyncio
async def test_get_top_products_no_products_in_range_returns_empty_list(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "1999-01-01", "end_date": "1999-01-31", "limit": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert len(data["products"]) == 0


@pytest.mark.asyncio
async def test_get_top_products_limit_greater_than_available_products_returns_all_products(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 10}
    )
    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    assert len(data["products"]) <= 10


@pytest.mark.asyncio
async def test_get_top_products_start_date_after_end_date_returns_422(client):
    response = await client.get(
        "/api/dashboard/top-products",
        params={"start_date": "2024-02-01", "end_date": "2024-01-01", "limit": 5}
    )
    assert response.status_code == 422