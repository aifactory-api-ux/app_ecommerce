import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from dashboard_api.main import app
from dashboard_api.db.session import Base, get_db


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


class TestGetTopProducts:
    @pytest.mark.asyncio
    async def test_get_top_products_happy_path_returns_top_products(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-01-01", "end_date": "2024-01-31"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert isinstance(data["products"], list)
        for product in data["products"]:
            assert "product_id" in product
            assert "product_name" in product
            assert "units_sold" in product
            assert "revenue" in product
        assert len(data["products"]) <= 5

    @pytest.mark.asyncio
    async def test_get_top_products_with_custom_limit_returns_limited_products(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 3}
        )
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert len(data["products"]) <= 3

    @pytest.mark.asyncio
    async def test_get_top_products_missing_start_date_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"end_date": "2024-01-31"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_top_products_missing_end_date_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-01-01"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_top_products_invalid_date_format_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-13-01", "end_date": "2024-01-31"}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_top_products_limit_zero_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 0}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_top_products_limit_negative_returns_422(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": -5}
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_top_products_start_date_after_end_date_returns_400(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-02-01", "end_date": "2024-01-01"}
        )
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_get_top_products_no_products_in_range_returns_empty_list(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "1999-01-01", "end_date": "1999-01-31"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert data["products"] == []

    @pytest.mark.asyncio
    async def test_get_top_products_limit_greater_than_available_products_returns_all_products(self, client):
        response = await client.get(
            "/api/dashboard/top-products",
            params={"start_date": "2024-01-01", "end_date": "2024-01-31", "limit": 100}
        )
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert isinstance(data["products"], list)