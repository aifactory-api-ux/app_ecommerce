import pytest
import uuid
from datetime import datetime, date, timedelta
from decimal import Decimal

from app.services.admin_service import AdminService
from app.services.product_service import ProductService
from app.services.order_service import OrderService
from app.services.cart_service import CartService
from app.models.order import OrderStatus
from app.models.product import ProductType
from app.schemas.product import ProductCreate
from app.schemas.cart import CartItemCreate


class TestAdminService:
    @pytest.mark.asyncio
    async def test_get_sales_summary_no_orders(self, db_session, redis_client):
        service = AdminService(db_session)
        today = date.today()

        result = await service.get_sales_summary(today, today)

        assert result["total_orders"] == 0
        assert result["total_revenue"] == 0.0
        assert result["total_products_sold"] == 0

    @pytest.mark.asyncio
    async def test_get_sales_summary_with_completed_orders(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product1 = await product_service.create_product(ProductCreate(
            name="Product 1", slug="product-1", price=100.00, product_type="license"
        ))
        product2 = await product_service.create_product(ProductCreate(
            name="Product 2", slug="product-2", price=50.00, product_type="download"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product1.id, quantity=2))
        await cart_service.add_item(user_id, CartItemCreate(product_id=product2.id, quantity=1))
        order = await order_service.checkout(user_id)

        today = date.today()
        result = await service.get_sales_summary(today, today)

        assert result["total_orders"] == 1
        assert result["total_revenue"] == 250.00
        assert result["total_products_sold"] == 3

    @pytest.mark.asyncio
    async def test_get_sales_summary_excludes_cancelled(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Expensive Item", slug="expensive-item", price=500.00, product_type="license"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=1))
        order = await order_service.checkout(user_id)

        order.status = OrderStatus.CANCELLED
        await db_session.flush()

        today = date.today()
        result = await service.get_sales_summary(today, today)

        assert result["total_orders"] == 0
        assert result["total_revenue"] == 0.0

    @pytest.mark.asyncio
    async def test_get_sales_summary_date_range(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Dated Product", slug="dated-product", price=75.00, product_type="download"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=1))
        await order_service.checkout(user_id)

        today = date.today()
        tomorrow = today + timedelta(days=1)
        yesterday = today - timedelta(days=1)

        result_today = await service.get_sales_summary(today, today)
        assert result_today["total_orders"] == 1

        result_future = await service.get_sales_summary(tomorrow, tomorrow)
        assert result_future["total_orders"] == 0

        result_past = await service.get_sales_summary(yesterday, yesterday)
        assert result_past["total_orders"] == 0

    @pytest.mark.asyncio
    async def test_get_top_selling_products_empty(self, db_session, redis_client):
        service = AdminService(db_session)
        today = date.today()

        result = await service.get_top_selling_products(today, today)

        assert result == []

    @pytest.mark.asyncio
    async def test_get_top_selling_products_multiple(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product1 = await product_service.create_product(ProductCreate(
            name="Popular Item", slug="popular-item", price=10.00, product_type="download"
        ))
        product2 = await product_service.create_product(ProductCreate(
            name="Less Popular", slug="less-popular", price=20.00, product_type="license"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product1.id, quantity=5))
        await cart_service.add_item(user_id, CartItemCreate(product_id=product2.id, quantity=1))
        await order_service.checkout(user_id)

        today = date.today()
        result = await service.get_top_selling_products(today, today)

        assert len(result) == 2
        assert result[0]["product_name"] == "Popular Item"
        assert result[0]["quantity_sold"] == 5
        assert result[1]["product_name"] == "Less Popular"
        assert result[1]["quantity_sold"] == 1

    @pytest.mark.asyncio
    async def test_get_top_selling_products_respects_limit(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        for i in range(10):
            product = await product_service.create_product(ProductCreate(
                name=f"Product {i}", slug=f"product-{i}", price=10.00 + i, product_type="download"
            ))
            user_id = uuid.uuid4()
            await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=i + 1))
            await order_service.checkout(user_id)

        today = date.today()
        result = await service.get_top_selling_products(today, today, limit=3)

        assert len(result) == 3

    @pytest.mark.asyncio
    async def test_get_top_selling_products_ordered_by_quantity(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product1 = await product_service.create_product(ProductCreate(
            name="First Sold", slug="first-sold", price=5.00, product_type="license"
        ))
        product2 = await product_service.create_product(ProductCreate(
            name="Best Seller", slug="best-seller", price=15.00, product_type="subscription"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product1.id, quantity=1))
        await order_service.checkout(user_id)

        user_id2 = uuid.uuid4()
        await cart_service.add_item(user_id2, CartItemCreate(product_id=product2.id, quantity=10))
        await order_service.checkout(user_id2)

        today = date.today()
        result = await service.get_top_selling_products(today, today)

        assert result[0]["product_name"] == "Best Seller"
        assert result[0]["quantity_sold"] == 10
        assert result[1]["product_name"] == "First Sold"
        assert result[1]["quantity_sold"] == 1

    @pytest.mark.asyncio
    async def test_get_sales_history_empty(self, db_session, redis_client):
        service = AdminService(db_session)
        today = date.today()

        result = await service.get_sales_history(today, today)

        assert result == []

    @pytest.mark.asyncio
    async def test_get_sales_history_daily_aggregation(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Daily Test", slug="daily-test", price=30.00, product_type="download"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=2))
        await order_service.checkout(user_id)

        today = date.today()
        result = await service.get_sales_history(today, today)

        assert len(result) == 1
        assert result[0]["date"] == str(today)
        assert result[0]["orders_count"] == 1
        assert result[0]["revenue"] == 60.00

    @pytest.mark.asyncio
    async def test_get_sales_history_date_range(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Range Test", slug="range-test", price=40.00, product_type="license"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=1))
        await order_service.checkout(user_id)

        today = date.today()
        tomorrow = today + timedelta(days=1)

        result = await service.get_sales_history(today, tomorrow)

        assert len(result) >= 1

    @pytest.mark.asyncio
    async def test_get_orders_for_export_empty(self, db_session, redis_client):
        service = AdminService(db_session)
        today = date.today()

        result = await service.get_orders_for_export(today, today)

        assert result == []

    @pytest.mark.asyncio
    async def test_get_orders_for_export_with_data(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Export Test", slug="export-test", price=25.00, product_type="download"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=3))
        order = await order_service.checkout(user_id)

        today = date.today()
        result = await service.get_orders_for_export(today, today)

        assert len(result) == 1
        assert result[0]["order_id"] == str(order.id)
        assert result[0]["product_name"] == "Export Test"
        assert result[0]["quantity"] == 3
        assert result[0]["unit_price"] == 25.00
        assert result[0]["line_total"] == 75.00
        assert result[0]["order_total"] == 75.00

    @pytest.mark.asyncio
    async def test_get_orders_for_export_includes_product_info(self, db_session, redis_client):
        service = AdminService(db_session)
        product_service = ProductService(db_session, redis_client)
        cart_service = CartService(db_session, redis_client)
        order_service = OrderService(db_session, redis_client)

        product = await product_service.create_product(ProductCreate(
            name="Info Test", slug="info-test", price=100.00, product_type="subscription"
        ))

        user_id = uuid.uuid4()
        await cart_service.add_item(user_id, CartItemCreate(product_id=product.id, quantity=1))
        await order_service.checkout(user_id)

        today = date.today()
        result = await service.get_orders_for_export(today, today)

        assert result[0]["product_type"] == "subscription"
        assert result[0]["order_status"] == "completed"