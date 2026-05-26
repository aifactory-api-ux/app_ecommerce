import csv
import io
from datetime import datetime, date
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user_id
from app.services.admin_service import AdminService

router = APIRouter()


@router.get("/stats")
async def get_stats(
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if start_date is None:
        start_date = date.today()
    if end_date is None:
        end_date = date.today()

    service = AdminService(db)
    return await service.get_sales_summary(start_date, end_date)


@router.get("/top-products")
async def get_top_products(
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    limit: int = Query(default=5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if start_date is None:
        start_date = date.today()
    if end_date is None:
        end_date = date.today()

    service = AdminService(db)
    return await service.get_top_selling_products(start_date, end_date, limit)


@router.get("/sales-history")
async def get_sales_history(
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if start_date is None:
        start_date = date.today()
    if end_date is None:
        end_date = date.today()

    service = AdminService(db)
    return await service.get_sales_history(start_date, end_date)


@router.get("/export/csv")
async def export_csv(
    start_date: date = Query(default=None),
    end_date: date = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if start_date is None:
        start_date = date.today()
    if end_date is None:
        end_date = date.today()

    service = AdminService(db)
    data = await service.get_orders_for_export(start_date, end_date)

    output = io.StringIO()
    if not data:
        output.write("No data available for the selected period\n")
    else:
        fieldnames = [
            "order_id",
            "order_date",
            "order_status",
            "customer_email",
            "product_name",
            "product_type",
            "quantity",
            "unit_price",
            "line_total",
            "order_total",
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

    output.seek(0)
    filename = f"report_{start_date}_{end_date}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )