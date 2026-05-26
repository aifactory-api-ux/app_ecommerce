"""
Unit tests for AdminService using mocks only (no database).

These tests run in <5ms each and require no external dependencies.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import date, datetime
from decimal import Decimal


class TestAdminServiceUnit:
    """Unit tests for AdminService - pure logic testing with mocked DB."""

    @pytest.fixture
    def mock_db(self):
        """Create a mock database session."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db):
        """Create AdminService with mocked DB."""
        from app.services.admin_service import AdminService
        return AdminService(mock_db)

    # ==================== get_sales_summary tests ====================

    @pytest.mark.asyncio
    async def test_get_sales_summary_returns_zeros_on_empty(self, service, mock_db):
        """When no orders exist, should return zeros."""
        mock_result = MagicMock()
        mock_result.one.return_value = MagicMock(
            total_orders=0, total_revenue=Decimal(0), total_products_sold=0
        )
        mock_db.execute.return_value = mock_result

        result = await service.get_sales_summary(date.today(), date.today())

        assert result["total_orders"] == 0
        assert result["total_revenue"] == 0.0
        assert result["total_products_sold"] == 0

    @pytest.mark.asyncio
    async def test_get_sales_summary_with_orders(self, service, mock_db):
        """Should calculate correct totals with orders."""
        mock_result = MagicMock()
        mock_result.one.return_value = MagicMock(
            total_orders=5, total_revenue=Decimal(1500.50), total_products_sold=12
        )
        mock_db.execute.return_value = mock_result

        result = await service.get_sales_summary(date.today(), date.today())

        assert result["total_orders"] == 5
        assert result["total_revenue"] == 1500.50
        assert result["total_products_sold"] == 12

    @pytest.mark.asyncio
    async def test_get_sales_summary_handles_none_revenue(self, service, mock_db):
        """Should handle None revenue gracefully."""
        mock_result = MagicMock()
        mock_result.one.return_value = MagicMock(
            total_orders=0, total_revenue=None, total_products_sold=0
        )
        mock_db.execute.return_value = mock_result

        result = await service.get_sales_summary(date.today(), date.today())

        assert result["total_revenue"] == 0.0

    @pytest.mark.asyncio
    async def test_get_sales_summary_with_decimal_conversion(self, service, mock_db):
        """Should convert Decimal to float."""
        mock_result = MagicMock()
        mock_result.one.return_value = MagicMock(
            total_orders=1, total_revenue=Decimal("99.99"), total_products_sold=2
        )
        mock_db.execute.return_value = mock_result

        result = await service.get_sales_summary(date.today(), date.today())

        assert isinstance(result["total_revenue"], float)
        assert result["total_revenue"] == 99.99

    # ==================== get_top_selling_products tests ====================

    @pytest.mark.asyncio
    async def test_get_top_selling_products_empty(self, service, mock_db):
        """Should return empty list when no products sold."""
        mock_rows = []
        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=mock_rows))

        result = await service.get_top_selling_products(date.today(), date.today())

        assert result == []

    @pytest.mark.asyncio
    async def test_get_top_selling_products_single(self, service, mock_db):
        """Should return single product correctly."""
        mock_row = MagicMock()
        mock_row.name = "Test Product"
        mock_row.quantity_sold = 10
        mock_row.revenue = Decimal(100.00)

        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=[mock_row]))

        result = await service.get_top_selling_products(date.today(), date.today())

        assert len(result) == 1
        assert result[0]["product_name"] == "Test Product"
        assert result[0]["quantity_sold"] == 10
        assert result[0]["revenue"] == 100.00

    @pytest.mark.asyncio
    async def test_get_top_selling_products_multiple_sorted(self, service, mock_db):
        """Should return products sorted by quantity descending."""
        def create_mock_row(name, qty, rev):
            row = MagicMock()
            row.name = name
            row.quantity_sold = qty
            row.revenue = Decimal(rev)
            return row

        mock_rows = [
            create_mock_row("Product A", 50, 500),
            create_mock_row("Product B", 10, 100),
            create_mock_row("Product C", 30, 300),
        ]
        mock_result = MagicMock()
        mock_result.all.return_value = mock_rows
        mock_db.execute.return_value = mock_result

        result = await service.get_top_selling_products(date.today(), date.today())

        assert len(result) == 3
        assert result[0]["product_name"] == "Product A"
        assert result[0]["quantity_sold"] == 50

    @pytest.mark.asyncio
    async def test_get_top_selling_products_respects_limit(self, service, mock_db):
        """Should respect the limit parameter."""
        mock_rows = [
            MagicMock(name=f"Product {i}", quantity_sold=i * 5, revenue=Decimal(i * 50))
            for i in range(1, 11)
        ]
        mock_result = MagicMock()
        mock_result.all.return_value = mock_rows[:3]  # Simulate limit applied
        mock_db.execute.return_value = mock_result

        result = await service.get_top_selling_products(date.today(), date.today(), limit=3)

        assert len(result) == 3

    @pytest.mark.asyncio
    async def test_get_top_selling_products_handles_none_values(self, service, mock_db):
        """Should handle None values in quantity and revenue."""
        mock_row = MagicMock()
        mock_row.name = "Test"
        mock_row.quantity_sold = None
        mock_row.revenue = None

        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=[mock_row]))

        result = await service.get_top_selling_products(date.today(), date.today())

        assert result[0]["quantity_sold"] == 0
        assert result[0]["revenue"] == 0.0

    # ==================== get_sales_history tests ====================

    @pytest.mark.asyncio
    async def test_get_sales_history_empty(self, service, mock_db):
        """Should return empty list when no sales."""
        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=[]))

        result = await service.get_sales_history(date.today(), date.today())

        assert result == []

    @pytest.mark.asyncio
    async def test_get_sales_history_single_day(self, service, mock_db):
        """Should return single day data."""
        mock_row = MagicMock()
        mock_row.date = date(2026, 5, 26)
        mock_row.orders_count = 5
        mock_row.revenue = Decimal(500.00)

        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=[mock_row]))

        result = await service.get_sales_history(date(2026, 5, 26), date(2026, 5, 26))

        assert len(result) == 1
        assert result[0]["date"] == "2026-05-26"
        assert result[0]["orders_count"] == 5
        assert result[0]["revenue"] == 500.00

    @pytest.mark.asyncio
    async def test_get_sales_history_multiple_days(self, service, mock_db):
        """Should return data for multiple days."""
        mock_rows = [
            MagicMock(date=date(2026, 5, 24), orders_count=3, revenue=Decimal(300)),
            MagicMock(date=date(2026, 5, 25), orders_count=7, revenue=Decimal(700)),
            MagicMock(date=date(2026, 5, 26), orders_count=2, revenue=Decimal(200)),
        ]
        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=mock_rows))

        result = await service.get_sales_history(date(2026, 5, 24), date(2026, 5, 26))

        assert len(result) == 3
        assert result[0]["date"] == "2026-05-24"
        assert result[2]["date"] == "2026-05-26"

    @pytest.mark.asyncio
    async def test_get_sales_history_handles_none_values(self, service, mock_db):
        """Should handle None values gracefully."""
        mock_row = MagicMock()
        mock_row.date = date.today()
        mock_row.orders_count = None
        mock_row.revenue = None

        mock_db.execute.return_value = MagicMock(all=MagicMock(return_value=[mock_row]))

        result = await service.get_sales_history(date.today(), date.today())

        assert result[0]["orders_count"] == 0
        assert result[0]["revenue"] == 0.0

    # ==================== get_orders_for_export tests ====================

    @pytest.mark.asyncio
    async def test_get_orders_for_export_empty(self, service, mock_db):
        """Should return empty list when no orders."""
        mock_db.execute.return_value = MagicMock(scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[]))))

        result = await service.get_orders_for_export(date.today(), date.today())

        assert result == []

    @pytest.mark.asyncio
    async def test_get_orders_for_export_no_items(self, service, mock_db):
        """Should return empty when orders have no items."""
        mock_order = MagicMock()
        mock_order.id = "order-123"
        mock_order.created_at = datetime(2026, 5, 26, 10, 30, 0)
        mock_order.status = MagicMock(value="completed")
        mock_order.total_amount = Decimal("0.00")
        mock_order.user = MagicMock(email="user@test.com")
        mock_order.items = []

        mock_db.execute.return_value = MagicMock(
            scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[mock_order])))
        )

        result = await service.get_orders_for_export(date.today(), date.today())

        assert result == []

    @pytest.mark.asyncio
    async def test_get_orders_for_export_single_item(self, service, mock_db):
        """Should correctly format single order item."""
        mock_order = MagicMock()
        mock_order.id = "order-123"
        mock_order.created_at = datetime(2026, 5, 26, 10, 30, 0)
        mock_order.status.value = "completed"
        mock_order.total_amount = Decimal("100.00")
        mock_order.user.email = "user@test.com"

        mock_item = MagicMock()
        mock_item.product.name = "Test Product"
        mock_item.product.product_type.value = "license"
        mock_item.quantity = 2
        mock_item.unit_price = Decimal("50.00")

        mock_order.items = [mock_item]

        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [mock_order]
        mock_db.execute.return_value = mock_result

        result = await service.get_orders_for_export(date.today(), date.today())

        assert len(result) == 1
        assert result[0]["order_id"] == "order-123"
        assert result[0]["product_name"] == "Test Product"
        assert result[0]["quantity"] == 2
        assert result[0]["unit_price"] == 50.00
        assert result[0]["line_total"] == 100.00

    @pytest.mark.asyncio
    async def test_get_orders_for_export_multiple_items(self, service, mock_db):
        """Should expand order with multiple items."""
        mock_order = MagicMock()
        mock_order.id = "order-456"
        mock_order.created_at = datetime(2026, 5, 26, 12, 0, 0)
        mock_order.status.value = "completed"
        mock_order.total_amount = Decimal("150.00")
        mock_order.user.email = "user@test.com"

        mock_item1 = MagicMock()
        mock_item1.product.name = "Product 1"
        mock_item1.product.product_type.value = "software"
        mock_item1.quantity = 1
        mock_item1.unit_price = Decimal("100.00")

        mock_item2 = MagicMock()
        mock_item2.product.name = "Product 2"
        mock_item2.product.product_type.value = "download"
        mock_item2.quantity = 2
        mock_item2.unit_price = Decimal("25.00")

        mock_order.items = [mock_item1, mock_item2]

        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = [mock_order]
        mock_db.execute.return_value = mock_result

        result = await service.get_orders_for_export(date.today(), date.today())

        assert len(result) == 2
        assert result[0]["product_name"] == "Product 1"
        assert result[0]["line_total"] == 100.00
        assert result[1]["product_name"] == "Product 2"
        assert result[1]["line_total"] == 50.00

    @pytest.mark.asyncio
    async def test_get_orders_for_export_handles_missing_user(self, service, mock_db):
        """Should handle order with no user gracefully."""
        mock_order = MagicMock()
        mock_order.id = "order-789"
        mock_order.created_at = datetime(2026, 5, 26, 14, 0, 0)
        mock_order.status = MagicMock(value="pending")
        mock_order.total_amount = Decimal("50.00")
        mock_order.user = None

        mock_item = MagicMock()
        mock_item.product = MagicMock(name="Test", product_type=MagicMock(value="license"))
        mock_item.quantity = 1
        mock_item.unit_price = Decimal("50.00")

        mock_order.items = [mock_item]

        mock_db.execute.return_value = MagicMock(
            scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[mock_order])))
        )

        result = await service.get_orders_for_export(date.today(), date.today())

        assert result[0]["customer_email"] == "N/A"

    @pytest.mark.asyncio
    async def test_get_orders_for_export_handles_missing_product(self, service, mock_db):
        """Should handle item with no product gracefully."""
        mock_order = MagicMock()
        mock_order.id = "order-999"
        mock_order.created_at = datetime(2026, 5, 26, 15, 0, 0)
        mock_order.status = MagicMock(value="completed")
        mock_order.total_amount = Decimal("25.00")
        mock_order.user = MagicMock(email="user@test.com")

        mock_item = MagicMock()
        mock_item.product = None
        mock_item.quantity = 1
        mock_item.unit_price = Decimal("25.00")

        mock_order.items = [mock_item]

        mock_db.execute.return_value = MagicMock(
            scalars=MagicMock(return_value=MagicMock(all=MagicMock(return_value=[mock_order])))
        )

        result = await service.get_orders_for_export(date.today(), date.today())

        assert result[0]["product_name"] == "N/A"
        assert result[0]["product_type"] == "N/A"