import uuid
import json
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import redis.asyncio as redis

from app.models.product import Product, ProductType
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    CACHE_TTL = 300

    def __init__(self, db: AsyncSession, redis: redis.Redis):
        self.db = db
        self.redis = redis

    async def get_products(self, page: int = 1, per_page: int = 20) -> tuple[list[Product], int]:
        cache_key = f"products:list:{page}"
        cached = await self.redis.get(cache_key)
        if cached:
            data = json.loads(cached)
            return [self._dict_to_product(p) for p in data["items"]], data["total"]

        offset = (page - 1) * per_page
        total_result = await self.db.execute(select(func.count(Product.id)))
        total = total_result.scalar()

        result = await self.db.execute(
            select(Product)
            .where(Product.is_active == True)
            .order_by(Product.created_at.desc())
            .offset(offset)
            .limit(per_page)
        )
        products = list(result.scalars().all())

        cache_data = {
            "items": [self._product_to_dict(p) for p in products],
            "total": total,
        }
        await self.redis.setex(cache_key, self.CACHE_TTL, json.dumps(cache_data))

        return products, total

    async def get_product_by_slug(self, slug: str) -> Product | None:
        cache_key = f"products:detail:{slug}"
        cached = await self.redis.get(cache_key)
        if cached:
            return self._dict_to_product(json.loads(cached))

        result = await self.db.execute(select(Product).where(Product.slug == slug))
        product = result.scalar_one_or_none()

        if product:
            await self.redis.setex(cache_key, self.CACHE_TTL * 2, json.dumps(self._product_to_dict(product)))

        return product

    async def create_product(self, product_data: ProductCreate) -> Product:
        product = Product(**product_data.model_dump())
        self.db.add(product)
        await self.db.flush()
        await self.db.refresh(product)
        await self._invalidate_cache()
        return product

    async def update_product(self, product_id: uuid.UUID, product_data: ProductUpdate) -> Product | None:
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            return None

        for key, value in product_data.model_dump(exclude_unset=True).items():
            setattr(product, key, value)

        await self.db.flush()
        await self.db.refresh(product)
        await self._invalidate_cache(product.slug)
        return product

    async def delete_product(self, product_id: uuid.UUID) -> bool:
        result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            return False

        await self.db.delete(product)
        await self._invalidate_cache(product.slug)
        return True

    async def _invalidate_cache(self, slug: str | None = None) -> None:
        keys = []
        async for key in self.redis.scan_iter("products:*"):
            keys.append(key)
        if keys:
            await self.redis.delete(*keys)

    def _product_to_dict(self, product: Product) -> dict:
        return {
            "id": str(product.id),
            "name": product.name,
            "slug": product.slug,
            "description": product.description,
            "price": float(product.price),
            "product_type": product.product_type.value,
            "file_url": product.file_url,
            "is_active": product.is_active,
            "stock": product.stock,
            "created_at": product.created_at.isoformat(),
        }

    def _dict_to_product(self, data: dict) -> Product:
        data["id"] = uuid.UUID(data["id"])
        data["price"] = float(data["price"])
        data["product_type"] = ProductType(data["product_type"])
        data["created_at"] = datetime.fromisoformat(data["created_at"])
        return Product(**data)
