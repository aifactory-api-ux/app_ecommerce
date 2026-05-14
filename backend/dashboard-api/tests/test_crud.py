import pytest
from datetime import date
from unittest.mock import AsyncMock, patch

from app.dashboard-api.crud import generate_sales_report, get_sales_summary, get_top_products


class TestGenerateSalesReport:
    @pytest.mark.asyncio
    async def test_generate_sales_report_returns_correct_summary_and_top_products(self, db_session):
        with patch('app.dashboard-api.crud.get_sales_summary') as mock_summary, \
             patch('app.dashboard-api.crud.get_top_products') as mock_top:
            mock_summary.return_value = {
                'total_sales': 150,
                'total_revenue': 15000.0,
                'period_start': date(2024, 1, 1),
                'period_end': date(2024, 1, 31)
            }
            mock_top.return_value = [
                {'product_id': 1, 'product_name': 'Widget', 'units_sold': 50, 'revenue': 5000.0}
            ]

            result = await generate_sales_report(db_session, date(2024, 1, 1), date(2024, 1, 31))

            assert result['summary']['total_sales'] == 150
            assert result['summary']['total_revenue'] == 15000.0
            assert result['summary']['period_start'] == date(2024, 1, 1)
            assert result['summary']['period_end'] == date(2024, 1, 31)
            assert len(result['top_products']) == 1
            assert result['top_products'][0]['product_name'] == 'Widget'

    @pytest.mark.asyncio
    async def test_generate_sales_report_no_sales_returns_zeroed_summary_and_empty_top_products(self, db_session):
        with patch('app.dashboard-api.crud.get_sales_summary') as mock_summary, \
             patch('app.dashboard-api.crud.get_top_products') as mock_top:
            mock_summary.return_value = {
                'total_sales': 0,
                'total_revenue': 0.0,
                'period_start': date(1999, 1, 1),
                'period_end': date(1999, 1, 31)
            }
            mock_top.return_value = []

            result = await generate_sales_report(db_session, date(1999, 1, 1), date(1999, 1, 31))

            assert result['summary']['total_sales'] == 0
            assert result['summary']['total_revenue'] == 0.0
            assert result['top_products'] == []

    @pytest.mark.asyncio
    async def test_generate_sales_report_start_date_after_end_date_raises_value_error(self, db_session):
        with pytest.raises(ValueError):
            await generate_sales_report(db_session, date(2024, 2, 1), date(2024, 1, 31))

    @pytest.mark.asyncio
    async def test_generate_sales_report_handles_single_day_range(self, db_session):
        with patch('app.dashboard-api.crud.get_sales_summary') as mock_summary, \
             patch('app.dashboard-api.crud.get_top_products') as mock_top:
            mock_summary.return_value = {
                'total_sales': 5,
                'total_revenue': 500.0,
                'period_start': date(2024, 1, 15),
                'period_end': date(2024, 1, 15)
            }
            mock_top.return_value = []

            result = await generate_sales_report(db_session, date(2024, 1, 15), date(2024, 1, 15))

            assert result['summary']['period_start'] == date(2024, 1, 15)
            assert result['summary']['period_end'] == date(2024, 1, 15)

    @pytest.mark.asyncio
    async def test_generate_sales_report_returns_top_products_sorted_by_units_sold(self, db_session):
        with patch('app.dashboard-api.crud.get_sales_summary') as mock_summary, \
             patch('app.dashboard-api.crud.get_top_products') as mock_top:
            mock_summary.return_value = {
                'total_sales': 100,
                'total_revenue': 10000.0,
                'period_start': date(2024, 1, 1),
                'period_end': date(2024, 1, 31)
            }
            mock_top.return_value = [
                {'product_id': 1, 'product_name': 'Product A', 'units_sold': 100, 'revenue': 5000.0},
                {'product_id': 2, 'product_name': 'Product B', 'units_sold': 50, 'revenue': 3000.0},
                {'product_id': 3, 'product_name': 'Product C', 'units_sold': 25, 'revenue': 2000.0}
            ]

            result = await generate_sales_report(db_session, date(2024, 1, 1), date(2024, 1, 31))

            top_products = result['top_products']
            assert top_products[0]['units_sold'] == 100
            assert top_products[1]['units_sold'] == 50
            assert top_products[2]['units_sold'] == 25