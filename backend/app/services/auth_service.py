import uuid
import json
from datetime import datetime, timedelta
from jose import jwt
import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import redis.asyncio as redis

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.schemas.auth import Token
from app.config import get_settings

settings = get_settings()


class AuthService:
    def __init__(self, db: AsyncSession, redis: redis.Redis):
        self.db = db
        self.redis = redis

    def hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    async def register(self, user_data: UserCreate) -> User:
        result = await self.db.execute(
            select(User).where(User.email == user_data.email)
        )
        existing = result.scalar_one_or_none()
        if existing:
            raise ValueError("Email already registered")

        user = User(
            email=user_data.email,
            password_hash=self.hash_password(user_data.password),
            full_name=user_data.full_name,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def login(self, credentials: UserLogin) -> tuple[User, Token]:
        result = await self.db.execute(
            select(User).where(User.email == credentials.email)
        )
        user = result.scalar_one_or_none()
        if not user or not self.verify_password(credentials.password, user.password_hash):
            raise ValueError("Invalid credentials")

        return user, await self._create_tokens(str(user.id))

    async def _create_tokens(self, user_id: str) -> Token:
        jti = str(uuid.uuid4())
        now = datetime.utcnow()

        access_payload = {
            "sub": user_id,
            "jti": jti,
            "type": "access",
            "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
            "iat": now,
        }
        refresh_payload = {
            "sub": user_id,
            "jti": jti,
            "type": "refresh",
            "exp": now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            "iat": now,
        }

        access_token = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

        session_key = f"session:{user_id}:{jti}"
        await self.redis.setex(
            session_key,
            timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            "active"
        )

        return Token(access_token=access_token, refresh_token=refresh_token)

    async def refresh_tokens(self, refresh_token: str) -> Token:
        try:
            payload = jwt.decode(refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")
            user_id = payload.get("sub")
            jti = payload.get("jti")
        except Exception:
            raise ValueError("Invalid refresh token")

        old_session_key = f"session:{user_id}:{jti}"
        if not await self.redis.exists(old_session_key):
            raise ValueError("Session expired or invalid")

        await self.redis.delete(old_session_key)
        return await self._create_tokens(user_id)

    async def logout(self, user_id: str, jti: str) -> None:
        session_key = f"session:{user_id}:{jti}"
        await self.redis.delete(session_key)
