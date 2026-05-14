from sqlalchemy import select, func, and_, desc, Table, Column, Integer, String, Date, MetaData
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from backend.shared.models import TopProduct


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


async def get_top_products(
    db: AsyncSession,
    start_date: str,
    end_date: str,
    limit: int = 5,
) -> list[TopProduct]:
    if limit <= 0:
        return []

    start = date.fromisoformat(start_date)
    end = date.fromisoformat(end_date)

    if start > end:
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
                top_products_table.c.sale_date >= start,
                top_products_table.c.sale_date <= end,
            )
        )
        .order_by(desc(top_products_table.c.units_sold))
        .limit(limit)
    )

    result = await db.execute(query)
    rows = result.fetchall()

    return [
        TopProduct(
            product_id=row.product_id,
            product_name=row.product_name,
            units_sold=row.units_sold,
            revenue=float(row.revenue),
        )
        for row in rows
    ]


async def create_top_product(
    db: AsyncSession,
    start_date: str,
    end_date: str,
    product_name: str,
    units_sold: int,
    revenue: float,
) -> None:
    sale_date = date.fromisoformat(start_date)
    result = await db.execute(select(func.count()).select_from(top_products_table))
    count = result.scalar() or 0

    await db.execute(
        top_products_table.insert().values(
            product_id=count + 1,
            product_name=product_name,
            units_sold=units_sold,
            revenue=int(revenue),
            sale_date=sale_date,
        )
    )
    await db.commit()