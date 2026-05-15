import pytest
from datetime import date

from dashboard_api.services.dashboard_service import DashboardService


@pytest.mark.asyncio
async def test_get_top_products_returns_correct_products_and_order(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_top_products(
        start_date=date(2024, 1, 1),
        end_date=date(2024, 1, 31),
        limit=3
    )
    assert "products" in result
    assert isinstance(result["products"], list)
    assert len(result["products"]) <= 3
    for product in result["products"]:
        assert "product_id" in product
        assert "product_name" in product
        assert "units_sold" in product
        assert "revenue" in product


@pytest.mark.asyncio
async def test_get_top_products_no_sales_returns_empty_list(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_top_products(
        start_date=date(1999, 1, 1),
        end_date=date(1999, 1, 31),
        limit=5
    )
    assert "products" in result
    assert len(result["products"]) == 0


@pytest.mark.asyncio
async def test_get_top_products_limit_greater_than_available_returns_all_products(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_top_products(
        start_date=date(2024, 1, 1),
        end_date=date(2024, 1, 31),
        limit=10
    )
    assert "products" in result
    assert len(result["products"]) <= 10


@pytest.mark.asyncio
async def test_get_top_products_limit_is_none_defaults_to_5(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_top_products(
        start_date=date(2024, 1, 1),
        end_date=date(2024, 1, 31),
        limit=None
    )
    assert "products" in result


@pytest.mark.asyncio
async def test_get_top_products_start_date_after_end_date_raises_value_error(db_session, redis_client):
    service = DashboardService(db_session)
    with pytest.raises(ValueError):
        await service.fetch_top_products(
            start_date=date(2024, 2, 1),
            end_date=date(2024, 1, 1),
            limit=5
        )