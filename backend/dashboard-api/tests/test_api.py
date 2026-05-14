import pytest
from httpx import AsyncClient, ASGITransport
from datetime import date
from unittest.mock import patch, AsyncMock

from app.dashboard-api.main import app
from app.database import get_db


@pytest.fixture
def mock_db_session():
    session = AsyncMock()
    return session


@pytest.fixture
def client(mock_db_session):
    async def override_get_db():
        yield mock_db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_post_sales_report_valid_dates_returns_200_and_sales_report_response(client, mock_db_session):
    with patch('app.dashboard-api.api.generate_sales_report') as mock_generate:
        mock_generate.return_value = {
            'summary': {
                'total_sales': 100,
                'total_revenue': 12345.67,
                'period_start': date(2024, 1, 1),
                'period_end': date(2024, 1, 31)
            },
            'top_products': [
                {'product_id': 1, 'product_name': 'Widget', 'units_sold': 50, 'revenue': 5000.0}
            ]
        }

        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "2024-01-01", "end_date": "2024-01-31"}
        )

        assert response.status_code == 200
        data = response.json()
        assert 'summary' in data
        assert 'top_products' in data
        assert data['summary']['total_sales'] == 100
        assert data['summary']['total_revenue'] == 12345.67
        assert 'period_start' in data['summary']
        assert 'period_end' in data['summary']
        assert len(data['top_products']) > 0
        item = data['top_products'][0]
        assert 'product_id' in item
        assert 'product_name' in item
        assert 'units_sold' in item
        assert 'revenue' in item


@pytest.mark.asyncio
async def test_post_sales_report_missing_start_date_returns_422(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"end_date": "2024-01-31"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_missing_end_date_returns_422(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024-01-01"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_invalid_date_format_returns_422(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024/01/01", "end_date": "2024-01-31"}
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_post_sales_report_start_date_after_end_date_returns_400(client):
    response = await client.post(
        "/api/dashboard/sales-report",
        json={"start_date": "2024-02-01", "end_date": "2024-01-31"}
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_post_sales_report_no_sales_in_period_returns_zeroed_summary_and_empty_top_products(client, mock_db_session):
    with patch('app.dashboard-api.api.generate_sales_report') as mock_generate:
        mock_generate.return_value = {
            'summary': {
                'total_sales': 0,
                'total_revenue': 0.0,
                'period_start': date(1999, 1, 1),
                'period_end': date(1999, 1, 31)
            },
            'top_products': []
        }

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
async def test_post_sales_report_large_date_range_returns_valid_response(client, mock_db_session):
    with patch('app.dashboard-api.api.generate_sales_report') as mock_generate:
        mock_generate.return_value = {
            'summary': {
                'total_sales': 1000,
                'total_revenue': 100000.0,
                'period_start': date(2020, 1, 1),
                'period_end': date(2024, 12, 31)
            },
            'top_products': []
        }

        response = await client.post(
            "/api/dashboard/sales-report",
            json={"start_date": "2020-01-01", "end_date": "2024-12-31"}
        )

        assert response.status_code == 200
        data = response.json()
        assert 'summary' in data
        assert 'top_products' in data