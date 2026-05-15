import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_post_sales_report_valid_dates_returns_200_and_expected_schema():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "2024-01-01", "end_date": "2024-01-31"}
        )

        assert response.status_code == 200
        data = response.json()
        assert 'summary' in data
        assert 'top_products' in data
        assert 'total_sales' in data['summary']
        assert 'total_revenue' in data['summary']
        assert 'period_start' in data['summary']
        assert 'period_end' in data['summary']
        if len(data['top_products']) > 0:
            assert 'product_id' in data['top_products'][0]
            assert 'product_name' in data['top_products'][0]
            assert 'units_sold' in data['top_products'][0]
            assert 'revenue' in data['top_products'][0]


@pytest.mark.asyncio
async def test_post_sales_report_missing_start_date_returns_422():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"end_date": "2024-01-31"}
        )

        assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_missing_end_date_returns_422():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "2024-01-01"}
        )

        assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_invalid_date_format_returns_422():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "01-01-2024", "end_date": "2024-01-31"}
        )

        assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_start_date_after_end_date_returns_400():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "2024-02-01", "end_date": "2024-01-31"}
        )

        assert response.status_code == 400


@pytest.mark.asyncio
async def test_post_sales_report_empty_body_returns_422():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={}
        )

        assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_no_data_in_range_returns_empty_top_products_and_zero_summary():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "1999-01-01", "end_date": "1999-01-31"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data['summary']['total_sales'] == 0
        assert data['summary']['total_revenue'] == 0.0
        assert data['top_products'] == []


@pytest.mark.asyncio
async def test_post_sales_report_large_date_range_returns_valid_response():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "2020-01-01", "end_date": "2024-12-31"}
        )

        assert response.status_code == 200
        data = response.json()
        assert 'summary' in data
        assert 'top_products' in data