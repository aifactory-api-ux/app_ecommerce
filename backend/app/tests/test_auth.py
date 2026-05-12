import pytest
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate


class TestAuthService:
    def test_hash_password(self, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        password = "TestPassword123"
        hashed = service.hash_password(password)

        assert hashed != password
        assert service.verify_password(password, hashed) is True
        assert service.verify_password("wrongpassword", hashed) is False

    @pytest.mark.asyncio
    async def test_register(self, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="TestPassword123",
            full_name="Test User"
        )

        user = await service.register(user_data)

        assert user.email == "test@example.com"
        assert user.full_name == "Test User"
        assert user.password_hash != "TestPassword123"

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="TestPassword123"
        )

        await service.register(user_data)

        with pytest.raises(ValueError, match="Email already registered"):
            await service.register(user_data)

    @pytest.mark.asyncio
    async def test_login_success(self, db_session, redis_client):
        service = AuthService(db_session, redis_client)
        user_data = UserCreate(
            email="test@example.com",
            password="TestPassword123"
        )
        await service.register(user_data)

        user, token = await service.login(
            type("Credentials", (), {"email": "test@example.com", "password": "TestPassword123"})()
        )

        assert user.email == "test@example.com"
        assert token.access_token is not None
        assert token.refresh_token is not None

    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, db_session, redis_client):
        service = AuthService(db_session, redis_client)

        with pytest.raises(ValueError, match="Invalid credentials"):
            await service.login(
                type("Credentials", (), {"email": "nonexistent@example.com", "password": "wrong"})()
            )
