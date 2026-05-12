from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from app.database import get_db
from app.redis_client import get_redis
from app.dependencies import get_current_user_id
from app.schemas.order import OrderRead, OrderCreate
from app.services.order_service import OrderService

router = APIRouter()


@router.get("/", response_model=list[OrderRead])
async def list_orders(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = OrderService(db, redis)
    orders = await service.get_user_orders(uuid.UUID(user_id))
    return [OrderRead.model_validate(order) for order in orders]


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = OrderService(db, redis)
    order = await service.get_order_by_id(uuid.UUID(user_id), uuid.UUID(order_id))
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return OrderRead.model_validate(order)


@router.post("/checkout", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def checkout(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = OrderService(db, redis)
    try:
        order = await service.checkout(uuid.UUID(user_id))
        return OrderRead.model_validate(order)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{order_id}/cancel", response_model=OrderRead)
async def cancel_order(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = OrderService(db, redis)
    try:
        order = await service.cancel_order(uuid.UUID(user_id), uuid.UUID(order_id))
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return OrderRead.model_validate(order)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
