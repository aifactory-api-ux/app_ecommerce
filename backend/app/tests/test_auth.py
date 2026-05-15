import pytest
from httpx import AsyncClient
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate


class TestAuthRouter:
    @pytest.mark.asyncio
    async def test_login_valid_credentials_returns_200_with_tokens(self, client: AsyncClient, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="SecurePassword123",
            full_name="Test User"
        )
        await service.register(user_data)

        response = await client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "SecurePassword123"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data

    @pytest.mark.asyncio
    async def test_login_missing_password_returns_422(self, client: AsyncClient):
        response = await client.post(
            "/api/auth/login",
            json={"email": "test@example.com"}
        )

        assert response.status_code == 422
        assert "detail" in response.json()

    @pytest.mark.asyncio
    async def test_login_non_existent_user_returns_401(self, client: AsyncClient):
        response = await client.post(
            "/api/auth/login",
            json={"email": "nonexistent@example.com", "password": "AnyPassword123"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid credentials"

    @pytest.mark.asyncio
    async def test_login_invalid_password_returns_401(self, client: AsyncClient, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="SecurePassword123",
            full_name="Test User"
        )
        await service.register(user_data)

        response = await client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "WrongPassword"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid credentials"

    @pytest.mark.asyncio
    async def test_refresh_valid_token_returns_new_access_token(self, client: AsyncClient, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="SecurePassword123",
            full_name="Test User"
        )
        await service.register(user_data)
        _, token = await service.login(
            type("Credentials", (), {"email": "test@example.com", "password": "SecurePassword123"})()
        )

        response = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": token.refresh_token}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data

    @pytest.mark.asyncio
    async def test_refresh_missing_token_returns_422(self, client: AsyncClient):
        response = await client.post(
            "/api/auth/refresh",
            json={}
        )

        assert response.status_code == 422
        assert "detail" in response.json()

    @pytest.mark.asyncio
    async def test_refresh_invalid_token_returns_401(self, client: AsyncClient):
        response = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid_or_expired_token"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid or expired refresh token"

    @pytest.mark.asyncio
    async def test_get_me_authenticated_user_returns_200_with_user_info(self, client: AsyncClient, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="SecurePassword123",
            full_name="Test User"
        )
        await service.register(user_data)
        _, token = await service.login(
            type("Credentials", (), {"email": "test@example.com", "password": "SecurePassword123"})()
        )

        response = await client.get(
            "/api/users/me",
            headers={"Authorization": f"Bearer {token.access_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "email" in data
        assert "full_name" in data
        assert "role" in data
        assert "is_active" in data
        assert "created_at" in data
        assert "updated_at" in data

    @pytest.mark.asyncio
    async def test_get_me_unauthenticated_returns_401(self, client: AsyncClient):
        response = await client.get("/api/users/me")

        assert response.status_code == 401
        assert response.json()["detail"] == "Not authenticated"

    @pytest.mark.asyncio
    async def test_get_me_invalid_token_returns_401(self, client: AsyncClient):
        response = await client.get(
            "/api/users/me",
            headers={"Authorization": "Bearer invalid_access_token"}
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid token"