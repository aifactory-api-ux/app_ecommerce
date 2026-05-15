from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from backend.shared.models import (
    SalesSummary,
    ProductStat,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportResponse
)
from dashboard-api.models.sale import Order, OrderItem, Product


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def fetch_sales_summary(
        self, start_date: date, end_date: date
    ) -> SalesSummary:
        if start_date > end_date:
            raise ValueError("start_date cannot be greater than end_date")

        result = await self.db.execute(
            select(
                func.count(func.distinct Order.id)).label("total_sales"),
                func.sum(Order.total_amount).label("total_revenue"),
            )
            .where(Order.created_at >= start_date)
            .where(Order.created_at <= end_date)
            .where(Order.status == "completed")
        )
        row = result.one()
        total_sales = row.total_sales or 0
        total_revenue = float(row.total_revenue or 0.0)

        return SalesSummary(
            total_sales=total_sales,
            total_revenue=total_revenue,
            period_start=start_date,
            period_end=end_date,
        )

    async def fetch_top_products(
        self, start_date: date, end_date: date, limit: int = 5
    ) -> TopProductsResponse:
        if start_date > end_date:
            raise ValueError("start_date cannot be greater than end_date")

        result = await self.db.execute(
            select(
                Product.id.label("product_id"),
                Product.name.label("product_name"),
                func.sum(OrderItem.quantity).label("units_sold"),
                func.sum(OrderItem.unit_price * OrderItem.quantity).label("revenue"),
            )
            .join(OrderItem, OrderItem.product_id == Product.id)
            .join(Order, Order.id == OrderItem.order_id)
            .where(Order.created_at >= start_date)
            .where(Order.created_at <= end_date)
            .where(Order.status == "completed")
            .group_by(Product.id, Product.name)
            .having(func.sum(OrderItem.quantity) > 0)
            .order_by(func.sum(OrderItem.quantity).desc())
            .limit(limit)
        )
        rows = result.all()
        products = [
            ProductStat(
                product_id=row.product_id,
                product_name=row.product_name,
                units_sold=row.units_sold,
                revenue=float(row.revenue),
            )
            for row in rows
        ]
        return TopProductsResponse(products=products)

    async def fetch_sales_report(
        self, start_date: date, end_date: date, limit: int = 5
    ) -> SalesReportResponse:
        if start_date > end_date:
            raise ValueError("start_date cannot be greater than end_date")

        summary = await self.fetch_sales_summary(start_date, end_date)
        top_products_response = await self.fetch_top_products(start_date, end_date, limit)

        return SalesReportResponse(
            summary=summary,
            top_products=top_products_response.products,
        )