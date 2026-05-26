from datetime import datetime, date
from decimal import Decimal
from typing import Any
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_sales_summary(
        self, start_date: date, end_date: date
    ) -> dict[str, Any]:
        start_dt = datetime.combine(start_date, datetime.min.time())
        end_dt = datetime.combine(end_date, datetime.max.time())

        result = await self.db.execute(
            select(
                func.count(Order.id).label("total_orders"),
                func.coalesce(func.sum(Order.total_amount), 0).label("total_revenue"),
                func.count(OrderItem.id).label("total_products_sold"),
            )
            .outerjoin(Order.items)
            .where(
                and_(
                    Order.created_at >= start_dt,
                    Order.created_at <= end_dt,
                    Order.status == OrderStatus.COMPLETED,
                )
            )
        )
        row = result.one()
        return {
            "total_orders": row.total_orders or 0,
            "total_revenue": float(row.total_revenue or 0),
            "total_products_sold": row.total_products_sold or 0,
        }

    async def get_top_selling_products(
        self, start_date: date, end_date: date, limit: int = 5
    ) -> list[dict[str, Any]]:
        start_dt = datetime.combine(start_date, datetime.min.time())
        end_dt = datetime.combine(end_date, datetime.max.time())

        result = await self.db.execute(
            select(
                Product.name,
                func.sum(OrderItem.quantity).label("quantity_sold"),
                func.sum(OrderItem.unit_price * OrderItem.quantity).label("revenue"),
            )
            .join(OrderItem, OrderItem.product_id == Product.id)
            .join(Order, Order.id == OrderItem.order_id)
            .where(
                and_(
                    Order.created_at >= start_dt,
                    Order.created_at <= end_dt,
                    Order.status == OrderStatus.COMPLETED,
                )
            )
            .group_by(Product.id, Product.name)
            .order_by(func.sum(OrderItem.quantity).desc())
            .limit(limit)
        )

        return [
            {
                "product_name": row.name,
                "quantity_sold": row.quantity_sold or 0,
                "revenue": float(row.revenue or 0),
            }
            for row in result.all()
        ]

    async def get_sales_history(
        self, start_date: date, end_date: date
    ) -> list[dict[str, Any]]:
        start_dt = datetime.combine(start_date, datetime.min.time())
        end_dt = datetime.combine(end_date, datetime.max.time())

        result = await self.db.execute(
            select(
                func.date(Order.created_at).label("date"),
                func.count(Order.id).label("orders_count"),
                func.sum(Order.total_amount).label("revenue"),
            )
            .where(
                and_(
                    Order.created_at >= start_dt,
                    Order.created_at <= end_dt,
                    Order.status == OrderStatus.COMPLETED,
                )
            )
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
        )

        return [
            {
                "date": str(row.date),
                "orders_count": row.orders_count or 0,
                "revenue": float(row.revenue or 0),
            }
            for row in result.all()
        ]

    async def get_orders_for_export(
        self, start_date: date, end_date: date
    ) -> list[dict[str, Any]]:
        start_dt = datetime.combine(start_date, datetime.min.time())
        end_dt = datetime.combine(end_date, datetime.max.time())

        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items).selectinload(OrderItem.product))
            .where(
                and_(
                    Order.created_at >= start_dt,
                    Order.created_at <= end_dt,
                )
            )
            .order_by(Order.created_at.desc())
        )
        orders = result.scalars().all()

        export_data = []
        for order in orders:
            for item in order.items:
                export_data.append(
                    {
                        "order_id": str(order.id),
                        "order_date": order.created_at.isoformat(),
                        "order_status": order.status.value,
                        "customer_email": order.user.email if order.user else "N/A",
                        "product_name": item.product.name if item.product else "N/A",
                        "product_type": item.product.product_type.value if item.product else "N/A",
                        "quantity": item.quantity,
                        "unit_price": float(item.unit_price),
                        "line_total": float(item.unit_price * item.quantity),
                        "order_total": float(order.total_amount),
                    }
                )
        return export_data