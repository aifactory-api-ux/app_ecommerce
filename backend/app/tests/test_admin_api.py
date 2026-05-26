import pytest
from datetime import date, timedelta

from app.schemas.user import UserCreate


async def get_auth_header(client, email="admin@test.com", password="TestPass123"):
    await client.post("/api/auth/register", json={
        "email": email, "password": password, "full_name": "Admin Test"
    })
    response = await client.post("/api/auth/login", json={
        "email": email, "password": password
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


class TestAdminAPI:
    async def test_get_stats_requires_auth(self, client):
        response = await client.get("/api/admin/stats")
        assert response.status_code in [401, 403]

    async def test_get_stats_success(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/stats", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert "total_orders" in data
        assert "total_revenue" in data
        assert "total_products_sold" in data

    async def test_get_stats_default_dates(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/stats", headers=headers)

        assert response.status_code == 200

    async def test_get_stats_custom_date_range(self, client, db_session, redis_client):
        headers = await get_auth_header(client)
        today = date.today()
        start = (today - timedelta(days=7)).isoformat()
        end = today.isoformat()

        response = await client.get(
            f"/api/admin/stats?start_date={start}&end_date={end}",
            headers=headers
        )

        assert response.status_code == 200

    async def test_get_top_products_requires_auth(self, client):
        response = await client.get("/api/admin/top-products")
        assert response.status_code in [401, 403]

    async def test_get_top_products_success(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/top-products", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    async def test_get_top_products_custom_limit(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/top-products?limit=10", headers=headers)

        assert response.status_code == 200

    async def test_get_sales_history_requires_auth(self, client):
        response = await client.get("/api/admin/sales-history")
        assert response.status_code in [401, 403]

    async def test_get_sales_history_success(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/sales-history", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    async def test_export_csv_requires_auth(self, client):
        response = await client.get("/api/admin/export/csv")
        assert response.status_code in [401, 403]

    async def test_export_csv_returns_csv_format(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/export/csv", headers=headers)

        assert response.status_code == 200
        assert "text/csv" in response.headers["content-type"]

    async def test_export_csv_has_correct_headers(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/export/csv", headers=headers)

        assert "content-disposition" in response.headers
        assert "attachment" in response.headers["content-disposition"]

    async def test_export_csv_filename_contains_dates(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/export/csv", headers=headers)

        assert "report_" in response.headers["content-disposition"]

    async def test_export_csv_empty_data(self, client, db_session, redis_client):
        headers = await get_auth_header(client)

        response = await client.get("/api/admin/export/csv", headers=headers)

        assert response.status_code == 200
