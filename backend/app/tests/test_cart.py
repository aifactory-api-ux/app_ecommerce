import pytest
import uuid
from app.services.cart_service import CartService
from app.services.product_service import ProductService
from app.schemas.cart import CartItemCreate, CartItemUpdate
from app.schemas.product import ProductCreate


class TestCartService:
    @pytest.mark.asyncio
    async def test_add_item_to_cart(self, db_session, redis_client):
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Cart Test Product",
            slug="cart-test",
            price=15.00,
            product_type="download"
        ))

        user_id = uuid.uuid4()
        item = await cart_service.add_item(user_id, CartItemCreate(
            product_id=product.id,
            quantity=2
        ))

        assert item.quantity == 2
        assert str(item.product_id) == str(product.id)

    @pytest.mark.asyncio
    async def test_update_cart_item(self, db_session, redis_client):
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Update Cart Test",
            slug="update-cart-test",
            price=20.00,
            product_type="license"
        ))

        user_id = uuid.uuid4()
        item = await cart_service.add_item(user_id, CartItemCreate(
            product_id=product.id,
            quantity=1
        ))

        updated = await cart_service.update_item(user_id, item.id, CartItemUpdate(quantity=5))

        assert updated.quantity == 5

    @pytest.mark.asyncio
    async def test_clear_cart(self, db_session, redis_client):
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)

        product1 = await product_service.create_product(ProductCreate(
            name="Product 1",
            slug="p1",
            price=10.00,
            product_type="download"
        ))
        product2 = await product_service.create_product(ProductCreate(
            name="Product 2",
            slug="p2",
            price=20.00,
            product_type="download"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product1.id))
        await cart_service.add_item(user_id, CartItemCreate(product_id=product2.id))

        await cart_service.clear_cart(user_id)
        cart = await cart_service.get_cart(user_id)

        assert len(cart) == 0
