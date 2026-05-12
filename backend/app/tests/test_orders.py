import pytest
import uuid
from app.services.cart_service import CartService
from app.services.order_service import OrderService
from app.services.product_service import ProductService
from app.schemas.cart import CartItemCreate
from app.schemas.product import ProductCreate


class TestOrderService:
    @pytest.mark.asyncio
    async def test_checkout_creates_order(self, db_session, redis_client):
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Order Test Product",
            slug="order-test",
            price=25.00,
            product_type="license"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=1))

        order = await order_service.checkout(user_id)

        assert order is not None
        assert float(order.total_amount) == 25.00
        assert len(order.items) == 1

    @pytest.mark.asyncio
    async def test_checkout_empty_cart_raises(self, db_session, redis_client):
        order_service = OrderService(db_session, redis_client)
        user_id = uuid.uuid4()

        with pytest.raises(ValueError, match="Cart is empty"):
            await order_service.checkout(user_id)

    @pytest.mark.asyncio
    async def test_order_generates_license_keys(self, db_session, redis_client):
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="License Product",
            slug="license-product",
            price=50.00,
            product_type="license"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id))

        order = await order_service.checkout(user_id)

        assert all(item.license_key is not None for item in order.items)
        assert all(item.license_key.startswith("LIC-") for item in order.items)
