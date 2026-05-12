from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from app.database import get_db
from app.redis_client import get_redis
from app.dependencies import get_current_user_id
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter()


@router.get("/", response_model=list[ProductRead])
async def list_products(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    service = ProductService(db, redis)
    products, total = await service.get_products(page, per_page)
    return [ProductRead.model_validate(p) for p in products]


@router.get("/{slug}", response_model=ProductRead)
async def get_product(
    slug: str,
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    service = ProductService(db, redis)
    product = await service.get_product_by_slug(slug)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductRead.model_validate(product)


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    service = ProductService(db, redis)
    product = await service.create_product(product_data)
    return ProductRead.model_validate(product)


@router.put("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = ProductService(db, redis)
    product = await service.update_product(uuid.UUID(product_id), product_data)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductRead.model_validate(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis: redis.Redis = Depends(get_redis),
):
    import uuid
    service = ProductService(db, redis)
    deleted = await service.delete_product(uuid.UUID(product_id))
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
