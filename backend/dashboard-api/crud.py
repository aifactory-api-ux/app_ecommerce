from datetime import date
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.shared.models import TopProduct, TopProductsResponse


async def get_top_products(db: AsyncSession, start_date: date, end_date: date, limit: int = 5) -> list[TopProduct]:
    if start_date > end_date:
        raise ValueError("start_date cannot be greater than end_date")
    if limit <= 0:
        raise ValueError("limit must be greater than zero")

    from dashboard_api.models.sale import Sale

    query = select(
        Sale.product_id,
        Sale.product_name,
        func.sum(Sale.quantity).label("units_sold"),
        func.sum(Sale.total_price).label("revenue")
    ).where(
        Sale.sale_date >= start_date,
        Sale.sale_date <= end_date
    ).group_by(
        Sale.product_id,
        Sale.product_name
    ).order_by(
        func.sum(Sale.quantity).desc()
    ).limit(limit)

    result = await db.execute(query)
    rows = result.all()

    return [
        TopProduct(
            product_id=row.product_id,
            product_name=row.product_name,
            units_sold=row.units_sold or 0,
            revenue=float(row.revenue or 0)
        )
        for row in rows
    ]


def get_top_products_sync(start_date_str: str, end_date_str: str, limit: int = 5) -> list[TopProduct]:
    from datetime import datetime
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    if start_date > end_date:
        raise ValueError("start_date cannot be greater than end_date")
    if limit <= 0:
        raise ValueError("limit must be greater than zero")

    return []