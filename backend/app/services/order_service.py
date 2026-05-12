import uuid
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
import redis.asyncio as redis

from app.models.order import Order, OrderItem, OrderStatus
from app.models.cart import CartItem
from app.models.product import Product
from app.services.license_service import LicenseService


class OrderService:
    def __init__(self, db: AsyncSession, redis: redis.Redis):
        self.db = db
        self.redis = redis
        self.license_service = LicenseService()

    async def get_user_orders(self, user_id: uuid.UUID) -> list[Order]:
        result = await self.db.execute(
            select(Order)
            .where(Order.user_id == user_id)
            .options(selectinload(Order.items))
            .order_by(Order.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_order_by_id(self, user_id: uuid.UUID, order_id: uuid.UUID) -> Order | None:
        result = await self.db.execute(
            select(Order)
            .where(Order.id == order_id, Order.user_id == user_id)
            .options(selectinload(Order.items))
        )
        return result.scalar_one_or_none()

    async def checkout(self, user_id: uuid.UUID) -> Order:
        cart_result = await self.db.execute(
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .options(selectinload(CartItem.product))
        )
        cart_items = list(cart_result.scalars().all())

        if not cart_items:
            raise ValueError("Cart is empty")

        total_amount = sum(item.product.price * item.quantity for item in cart_items)

        order = Order(
            user_id=user_id,
            status=OrderStatus.PENDING,
            total_amount=total_amount,
        )
        self.db.add(order)
        await self.db.flush()

        for item in cart_items:
            license_key = self.license_service.generate_license()
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=float(item.product.price),
                license_key=license_key,
            )
            self.db.add(order_item)

        await self.db.flush()

        await asyncio.sleep(1)

        order.status = OrderStatus.COMPLETED
        order.payment_method = "simulated"
        order.payment_reference = f"SIM-{uuid.uuid4().hex[:12].upper()}"

        await self.db.execute(
            delete(CartItem).where(CartItem.user_id == user_id)
        )

        await self.db.refresh(order)

        result = await self.db.execute(
            select(Order)
            .where(Order.id == order.id)
            .options(selectinload(Order.items))
        )
        return result.scalar_one()

    async def cancel_order(self, user_id: uuid.UUID, order_id: uuid.UUID) -> Order | None:
        result = await self.db.execute(
            select(Order)
            .where(Order.id == order_id, Order.user_id == user_id)
            .options(selectinload(Order.items))
        )
        order = result.scalar_one_or_none()

        if not order:
            return None

        if order.status not in [OrderStatus.PENDING, OrderStatus.PAID]:
            raise ValueError("Cannot cancel order in current status")

        order.status = OrderStatus.CANCELLED
        await self.db.flush()
        await self.db.refresh(order)
        return order
