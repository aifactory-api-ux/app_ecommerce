import pytest
from app.services.product_service import ProductService
from app.schemas.product import ProductCreate, ProductUpdate


class TestProductService:
    @pytest.mark.asyncio
    async def test_create_product(self, db_session, redis_client):
        service = ProductService(db_session, redis_client)
        product_data = ProductCreate(
            name="Test Product",
            slug="test-product",
            description="Test description",
            price=29.99,
            product_type="license"
        )

        product = await service.create_product(product_data)

        assert product.name == "Test Product"
        assert product.slug == "test-product"
        assert float(product.price) == 29.99

    @pytest.mark.asyncio
    async def test_get_products(self, db_session, redis_client):
        service = ProductService(db_session, redis_client)

        for i in range(5):
            await service.create_product(ProductCreate(
                name=f"Product {i}",
                slug=f"product-{i}",
                price=10.00 + i,
                product_type="download"
            ))

        products, total = await service.get_products(page=1, per_page=3)

        assert len(products) == 3
        assert total == 5

    @pytest.mark.asyncio
    async def test_get_product_by_slug(self, db_session, redis_client):
        service = ProductService(db_session, redis_client)
        await service.create_product(ProductCreate(
            name="Unique Product",
            slug="unique-product",
            price=49.99,
            product_type="software"
        ))

        product = await service.get_product_by_slug("unique-product")

        assert product is not None
        assert product.name == "Unique Product"

    @pytest.mark.asyncio
    async def test_update_product(self, db_session, redis_client):
        service = ProductService(db_session, redis_client)
        created = await service.create_product(ProductCreate(
            name="Original Name",
            slug="original-slug",
            price=19.99,
            product_type="license"
        ))

        updated = await service.update_product(created.id, ProductUpdate(name="Updated Name"))

        assert updated.name == "Updated Name"
        assert updated.slug == "original-slug"
