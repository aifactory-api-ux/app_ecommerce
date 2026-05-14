from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from shared.models import SalesSummary, ProductSales, TopProductsResponse, SalesReportRequest, SalesReportResponse


async def get_sales_summary(db: AsyncSession, start_date: date, end_date: date) -> dict:
    result = await db.execute(
        select(
            func.count(Order.id).label('total_sales'),
            func.sum(Order.total_amount).label('total_revenue')
        )
        .where(Order.status == OrderStatus.COMPLETED)
        .where(Order.created_at >= start_date)
        .where(Order.created_at <= end_date)
    )
    row = result.one()
    return {
        'total_sales': row.total_sales or 0,
        'total_revenue': float(row.total_revenue or 0.0),
        'period_start': start_date,
        'period_end': end_date
    }


async def get_top_products(db: AsyncSession, start_date: date, end_date: date, limit: int = 5) -> list[dict]:
    result = await db.execute(
        select(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label('units_sold'),
            func.sum(OrderItem.unit_price * OrderItem.quantity).label('revenue')
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.status == OrderStatus.COMPLETED)
        .where(Order.created_at >= start_date)
        .where(Order.created_at <= end_date)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
    )
    rows = result.all()
    return [
        {
            'product_id': row.id,
            'product_name': row.name,
            'units_sold': row.units_sold or 0,
            'revenue': float(row.revenue or 0.0)
        }
        for row in rows
    ]


async def generate_sales_report(db: AsyncSession, start_date: date, end_date: date) -> dict:
    if start_date > end_date:
        raise ValueError("start_date cannot be greater than end_date")

    summary = await get_sales_summary(db, start_date, end_date)
    top_products = await get_top_products(db, start_date, end_date, limit=5)

    return {
        'summary': summary,
        'top_products': top_products
    }