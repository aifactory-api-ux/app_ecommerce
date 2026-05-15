import pytest
from datetime import date

from dashboard_api.services.dashboard_service import DashboardService
from dashboard_api.models.sale import Order, OrderItem, Product


@pytest.mark.asyncio
async def test_generate_sales_report_returns_correct_summary_and_top_products(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_sales_report(
        start_date=date(2024, 6, 1),
        end_date=date(2024, 6, 30)
    )
    assert "summary" in result
    assert "top_products" in result
    assert hasattr(result.summary, 'period_start')
    assert hasattr(result.summary, 'period_end')
    assert result.summary.period_start == date(2024, 6, 1)
    assert result.summary.period_end == date(2024, 6, 30)


@pytest.mark.asyncio
async def test_generate_sales_report_no_sales_returns_zero_summary_and_empty_top_products(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_sales_report(
        start_date=date(1999, 1, 1),
        end_date=date(1999, 1, 31)
    )
    assert result.summary.total_sales == 0
    assert result.summary.total_revenue == 0.0
    assert result.top_products == []


@pytest.mark.asyncio
async def test_generate_sales_report_start_date_after_end_date_raises_value_error(db_session, redis_client):
    service = DashboardService(db_session)
    with pytest.raises(ValueError):
        await service.fetch_sales_report(
            start_date=date(2024, 7, 1),
            end_date=date(2024, 6, 30)
        )


@pytest.mark.asyncio
async def test_generate_sales_report_handles_products_with_zero_sales(db_session, redis_client):
    service = DashboardService(db_session)
    result = await service.fetch_sales_report(
        start_date=date(2024, 6, 1),
        end_date=date(2024, 6, 30)
    )
    for product in result.top_products:
        assert product.units_sold > 0