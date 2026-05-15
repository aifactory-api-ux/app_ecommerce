from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator

from backend.shared.models import (
    SalesSummary,
    ProductStat,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportResponse
)
from dashboard-api.services.dashboard_service import DashboardService
from dashboard-api.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/sales-summary", response_model=SalesSummary)
async def get_sales_summary(
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db),
):
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date cannot be greater than end_date"
        )
    service = DashboardService(db)
    return await service.fetch_sales_summary(start_date, end_date)


@router.get("/top-products", response_model=TopProductsResponse)
async def get_top_products(
    start_date: date,
    end_date: date,
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
):
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date cannot be greater than end_date"
        )
    service = DashboardService(db)
    return await service.fetch_top_products(start_date, end_date, limit)


@router.post("/sales-report", response_model=SalesReportResponse)
async def generate_sales_report(
    request: SalesReportRequest,
    db: AsyncSession = Depends(get_db),
):
    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date cannot be greater than end_date"
        )
    service = DashboardService(db)
    return await service.fetch_sales_report(request.start_date, request.end_date)