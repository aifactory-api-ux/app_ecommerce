from sqlalchemy import select, func, and_, desc, Table, Column, Integer, String, Date, MetaData
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date as date_type
from typing import Optional

from backend.dashboard-api.schemas.dashboard import SalesReportRequest, SalesReportResponse, ProductStat


metadata = MetaData()
top_products_table = Table(
    "top_products",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("product_id", Integer),
    Column("product_name", String(255)),
    Column("units_sold", Integer),
    Column("revenue", Integer),
    Column("sale_date", Date),
)


async def get_sales_summary(
    db: AsyncSession,
    start_date: date_type,
    end_date: date_type,
) -> dict:
    if start_date > end_date:
        return {
            "total_sales": 0,
            "total_revenue": 0.0,
            "period_start": start_date,
            "period_end": end_date,
        }

    query = (
        select(
            func.sum(top_products_table.c.units_sold).label("total_sales"),
            func.sum(top_products_table.c.revenue).label("total_revenue"),
        )
        .where(
            and_(
                top_products_table.c.sale_date >= start_date,
                top_products_table.c.sale_date <= end_date,
            )
        )
    )

    result = await db.execute(query)
    row = result.fetchone()

    total_sales = row.total_sales if row and row.total_sales is not None else 0
    total_revenue = float(row.total_revenue) if row and row.total_revenue is not None else 0.0

    return {
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "period_start": start_date,
        "period_end": end_date,
    }


async def get_top_products(
    db: AsyncSession,
    start_date: date_type,
    end_date: date_type,
    limit: int = 5,
) -> list[ProductStat]:
    if limit <= 0:
        return []

    if start_date > end_date:
        return []

    query = (
        select(
            top_products_table.c.product_id,
            top_products_table.c.product_name,
            top_products_table.c.units_sold,
            top_products_table.c.revenue,
        )
        .where(
            and_(
                top_products_table.c.sale_date >= start_date,
                top_products_table.c.sale_date <= end_date,
            )
        )
        .order_by(desc(top_products_table.c.units_sold))
        .limit(limit)
    )

    result = await db.execute(query)
    rows = result.fetchall()

    return [
        ProductStat(
            product_id=row.product_id,
            product_name=row.product_name,
            units_sold=row.units_sold,
            revenue=float(row.revenue),
        )
        for row in rows
    ]


async def generate_sales_report(
    db: AsyncSession,
    request: SalesReportRequest,
) -> SalesReportResponse:
    start_date = request.start_date
    end_date = request.end_date

    summary = await get_sales_summary(db, start_date, end_date)
    top_products = await get_top_products(db, start_date, end_date, limit=10)

    return SalesReportResponse(
        total_sales=summary["total_sales"],
        total_revenue=summary["total_revenue"],
        top_products=top_products,
    )