from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from app.database import get_db
from app.redis_client import get_redis
from app.dependencies import get_current_user_id
from app.schemas.cart import CartItemCreate, CartItemRead, CartItemUpdate
from app.services.cart_service import CartService

router = APIRouter()


@router.get("/", response_model=list[CartItemRead])
async def get_cart(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = CartService(db, redis)
    items = await service.get_cart(uuid.UUID(user_id))
    return [CartItemRead.model_validate(item) for item in items]


@router.post("/items", response_model=CartItemRead, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    item_data: CartItemCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = CartService(db, redis)
    try:
        item = await service.add_item(uuid.UUID(user_id), item_data)
        return CartItemRead.model_validate(item)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/items/{item_id}", response_model=CartItemRead)
async def update_cart_item(
    item_id: str,
    item_data: CartItemUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = CartService(db, redis)
    item = await service.update_item(uuid.UUID(user_id), uuid.UUID(item_id), item_data)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    return CartItemRead.model_validate(item)


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(
    item_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = CartService(db, redis)
    removed = await service.remove_item(uuid.UUID(user_id), uuid.UUID(item_id))
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = CartService(db, redis)
    await service.clear_cart(uuid.UUID(user_id))
