from datetime import date
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.shared.models import SalesSummary


async def get_sales_summary(db: AsyncSession, start_date: date, end_date: date) -> SalesSummary:
    if start_date > end_date:
        raise ValueError("start_date cannot be greater than end_date")

    query = select(
        func.count(Sale.id).label("total_sales"),
        func.coalesce(func.sum(Sale.total_price), 0).label("total_revenue")
    ).where(
        Sale.sale_date >= start_date,
        Sale.sale_date <= end_date
    )

    result = await db.execute(query)
    row = result.one()

    return SalesSummary(
        total_sales=row.total_sales or 0,
        total_revenue=float(row.total_revenue or 0),
        period_start=start_date,
        period_end=end_date
    )


def get_sales_summary_sync(start_date_str: str, end_date_str: str) -> SalesSummary:
    from datetime import datetime
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    if start_date > end_date:
        raise ValueError("start_date cannot be greater than end_date")

    return SalesSummary(
        total_sales=0,
        total_revenue=0.0,
        period_start=start_date,
        period_end=end_date
    )