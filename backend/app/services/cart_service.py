import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
import redis.asyncio as redis

from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate


class CartService:
    def __init__(self, db: AsyncSession, redis: redis.Redis):
        self.db = db
        self.redis = redis

    async def get_cart(self, user_id: uuid.UUID) -> list[CartItem]:
        result = await self.db.execute(
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .order_by(CartItem.created_at.desc())
        )
        return list(result.scalars().all())

    async def add_item(self, user_id: uuid.UUID, item_data: CartItemCreate) -> CartItem:
        result = await self.db.execute(
            select(CartItem)
            .where(CartItem.user_id == user_id, CartItem.product_id == item_data.product_id)
        )
        existing = result.scalar_one_or_none()

        if existing:
            existing.quantity += item_data.quantity
            await self.db.flush()
            await self.db.refresh(existing)
            return existing

        product_result = await self.db.execute(
            select(Product).where(Product.id == item_data.product_id, Product.is_active == True)
        )
        if not product_result.scalar_one_or_none():
            raise ValueError("Product not found or inactive")

        cart_item = CartItem(user_id=user_id, **item_data.model_dump())
        self.db.add(cart_item)
        await self.db.flush()
        await self.db.refresh(cart_item)
        return cart_item

    async def update_item(self, user_id: uuid.UUID, item_id: uuid.UUID, item_data: CartItemUpdate) -> CartItem | None:
        result = await self.db.execute(
            select(CartItem)
            .where(CartItem.id == item_id, CartItem.user_id == user_id)
        )
        item = result.scalar_one_or_none()
        if not item:
            return None

        item.quantity = item_data.quantity
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def remove_item(self, user_id: uuid.UUID, item_id: uuid.UUID) -> bool:
        result = await self.db.execute(
            select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user_id)
        )
        item = result.scalar_one_or_none()
        if not item:
            return False

        await self.db.delete(item)
        return True

    async def clear_cart(self, user_id: uuid.UUID) -> None:
        await self.db.execute(delete(CartItem).where(CartItem.user_id == user_id))
