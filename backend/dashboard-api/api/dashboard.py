from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.dashboard-api.db import get_db
from backend.dashboard-api.schemas.dashboard import SalesReportRequest, SalesReportResponse
from backend.dashboard-api.services.dashboard import generate_sales_report

router = APIRouter()


@router.post("/sales-report", response_model=SalesReportResponse)
async def create_sales_report(
    request: SalesReportRequest,
    db: AsyncSession = Depends(get_db),
):
    return await generate_sales_report(db, request)