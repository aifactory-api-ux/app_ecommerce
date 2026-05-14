import pytest
from datetime import date
from backend.dashboard-api.crud import get_top_products


@pytest.mark.asyncio
async def test_get_top_products_returns_products_sorted_by_units_sold(db_session):
    from backend.dashboard-api.crud import create_top_product

    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product A", units_sold=10, revenue=100.0)
    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product B", units_sold=20, revenue=200.0)

    result = await get_top_products(db_session, "2024-01-01", "2024-01-31", 5)

    assert len(result) == 2
    assert result[0].units_sold >= result[1].units_sold


@pytest.mark.asyncio
async def test_get_top_products_with_no_sales_returns_empty_list(db_session):
    result = await get_top_products(db_session, "1999-01-01", "1999-01-31", 5)
    assert result == []


@pytest.mark.asyncio
async def test_get_top_products_with_limit_greater_than_products_returns_all_products(db_session):
    from backend.dashboard-api.crud import create_top_product

    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product A", units_sold=10, revenue=100.0)

    result = await get_top_products(db_session, "2024-01-01", "2024-01-31", 100)

    assert len(result) == 1


@pytest.mark.asyncio
async def test_get_top_products_with_zero_limit_returns_empty_list(db_session):
    from backend.dashboard-api.crud import create_top_product

    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product A", units_sold=10, revenue=100.0)

    result = await get_top_products(db_session, "2024-01-01", "2024-01-31", 0)

    assert result == []


@pytest.mark.asyncio
async def test_get_top_products_with_start_date_after_end_date_returns_empty_list(db_session):
    from backend.dashboard-api.crud import create_top_product

    await create_top_product(db_session, "2024-01-01", "2024-01-31", product_name="Product A", units_sold=10, revenue=100.0)

    result = await get_top_products(db_session, "2024-02-01", "2024-01-01", 5)

    assert result == []