import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from backend.dashboard-api.main import app
from backend.dashboard-api.db import get_db


class Base(DeclarativeBase):
    pass


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


@pytest.mark.asyncio
async def test_get_top_products_happy_path_returns_top_products(client, db_session):
    from backend.dashboard-api.crud import create_top_product, get_top_products

    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product A", units_sold=10, revenue=100.0)
    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product B", units_sold=20, revenue=200.0)

    response = await client.get("/api/dashboard/top-products?start_date=2024-01-01&end_date=2024-01-31")

    assert response.status_code == 200
    data = response.json()
    assert "products" in data
    products = data["products"]
    assert len(products) <= 5
    for p in products:
        assert "product_id" in p
        assert "product_name" in p
        assert "units_sold" in p
        assert "revenue" in p


@pytest.mark.asyncio
async def test_get_top_products_with_custom_limit_returns_limited_products(client, db_session):
    from backend.dashboard-api.crud import create_top_product

    for i in range(5):
        await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name=f"Product {i}", units_sold=i * 10, revenue=i * 100.0)

    response = await client.get("/api/dashboard/top-products?start_date=2024-01-01&end_date=2024-01-31&limit=3")

    assert response.status_code == 200
    data = response.json()
    assert len(data["products"]) <= 3


@pytest.mark.asyncio
async def test_get_top_products_missing_start_date_returns_422(client):
    response = await client.get("/api/dashboard/top-products?end_date=2024-01-31")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_missing_end_date_returns_422(client):
    response = await client.get("/api/dashboard/top-products?start_date=2024-01-01")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_invalid_limit_returns_422(client):
    response = await client.get("/api/dashboard/top-products?start_date=2024-01-01&end_date=2024-01-31&limit=abc")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_top_products_start_date_after_end_date_returns_empty_list(client):
    response = await client.get("/api/dashboard/top-products?start_date=2024-02-01&end_date=2024-01-01")
    assert response.status_code == 200
    data = response.json()
    assert data["products"] == []


@pytest.mark.asyncio
async def test_get_top_products_no_sales_in_range_returns_empty_list(client):
    response = await client.get("/api/dashboard/top-products?start_date=1999-01-01&end_date=1999-01-31")
    assert response.status_code == 200
    data = response.json()
    assert data["products"] == []


@pytest.mark.asyncio
async def test_get_top_products_limit_greater_than_available_products_returns_all_products(client, db_session):
    from backend.dashboard-api.crud import create_top_product

    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product A", units_sold=10, revenue=100.0)

    response = await client.get("/api/dashboard/top-products?start_date=2024-01-01&end_date=2024-01-31&limit=100")

    assert response.status_code == 200
    data = response.json()
    assert len(data["products"]) == 1