from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from app.database import get_db
from shared.models import SalesReportRequest, SalesReportResponse
from app.dashboard-api.crud import generate_sales_report, get_sales_summary, get_top_products

router = APIRouter()


@router.get("/sales-summary", response_model=dict)
async def sales_summary(
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db)
):
    if start_date > end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date cannot be greater than end_date")
    return await get_sales_summary(db, start_date, end_date)


@router.get("/top-products", response_model=dict)
async def top_products(
    start_date: date,
    end_date: date,
    limit: int = 5,
    db: AsyncSession = Depends(get_db)
):
    if start_date > end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date cannot be greater than end_date")
    products = await get_top_products(db, start_date, end_date, limit)
    return {"products": products}


@router.post("/sales-report", response_model=SalesReportResponse)
async def sales_report(
    request: SalesReportRequest,
    db: AsyncSession = Depends(get_db)
):
    if request.start_date > request.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date cannot be greater than end_date")

    result = await generate_sales_report(db, request.start_date, request.end_date)
    return result