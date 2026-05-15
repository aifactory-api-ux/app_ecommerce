import pytest
from httpx import AsyncClient
from decimal import Decimal


class TestDashboardRouter:
    @pytest.mark.asyncio
    async def test_get_dashboard_summary_valid_dates_returns_200_with_data(self, client: AsyncClient, db_session, redis_client):
        response = await client.get(
            "/api/v1/dashboard/summary",
            params={"start_date": "2023-01-01", "end_date": "2023-01-31"},
            headers={"Authorization": "Bearer valid_access_token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "sales_by_date" in data
        assert "top_products" in data
        assert "sales_by_category" in data
        assert "orders_by_status" in data
        assert "period_start" in data
        assert "period_end" in data

    @pytest.mark.asyncio
    async def test_get_dashboard_summary_missing_start_date_returns_422(self, client: AsyncClient):
        response = await client.get(
            "/api/v1/dashboard/summary",
            params={"end_date": "2023-01-31"},
            headers={"Authorization": "Bearer valid_access_token"}
        )

        assert response.status_code == 422
        assert "detail" in response.json()

    @pytest.mark.asyncio
    async def test_get_dashboard_summary_invalid_date_format_returns_422(self, client: AsyncClient):
        response = await client.get(
            "/api/v1/dashboard/summary",
            params={"start_date": "2023/01/01", "end_date": "2023-01-31"},
            headers={"Authorization": "Bearer valid_access_token"}
        )

        assert response.status_code == 422
        assert "detail" in response.json()

    @pytest.mark.asyncio
    async def test_get_dashboard_summary_start_date_after_end_date_returns_422(self, client: AsyncClient):
        response = await client.get(
            "/api/v1/dashboard/summary",
            params={"start_date": "2023-01-31", "end_date": "2023-01-01"},
            headers={"Authorization": "Bearer valid_access_token"}
        )

        assert response.status_code == 422
        assert "detail" in response.json()

    @pytest.mark.asyncio
    async def test_get_dashboard_summary_no_data_for_period_returns_200_empty_lists(self, client: AsyncClient):
        response = await client.get(
            "/api/v1/dashboard/summary",
            params={"start_date": "2024-01-01", "end_date": "2024-01-31"},
            headers={"Authorization": "Bearer valid_access_token"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["summary"]["total_sales"] == 0.0
        assert data["summary"]["total_orders"] == 0
        assert data["summary"]["total_products_sold"] == 0
        assert data["summary"]["average_order_value"] == 0.0
        assert data["summary"]["sales_change_percent"] == 0.0
        assert data["sales_by_date"] == []
        assert data["top_products"] == []
        assert data["sales_by_category"] == []
        assert data["orders_by_status"] == []
        assert data["period_start"] == "2024-01-01"
        assert data["period_end"] == "2024-01-31"

    @pytest.mark.asyncio
    async def test_get_dashboard_summary_unauthenticated_returns_401(self, client: AsyncClient):
        response = await client.get(
            "/api/v1/dashboard/summary",
            params={"start_date": "2023-01-01", "end_date": "2023-01-31"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Not authenticated"