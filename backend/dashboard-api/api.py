from fastapi import APIRouter, HTTPException, status
from datetime import date

from schemas import SalesReportRequest, SalesReportResponse
from crud import generate_sales_report, get_sales_summary, get_top_products

router = APIRouter()


@router.get("/sales-summary")
async def sales_summary(
    start_date: date,
    end_date: date,
):
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before or equal to end_date"
        )
    return get_sales_summary(start_date, end_date)


@router.get("/top-products")
async def top_products(
    start_date: date,
    end_date: date,
    limit: int = 5,
):
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before or equal to end_date"
        )
    return {"products": get_top_products(start_date, end_date, limit)}


@router.post("/sales-report", response_model=SalesReportResponse)
async def sales_report(request: SalesReportRequest):
    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before or equal to end_date"
        )
    return generate_sales_report(request.start_date, request.end_date)