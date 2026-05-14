from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date
from typing import Optional

from backend.dashboard-api.db import get_db
from backend.dashboard-api.crud import get_top_products
from backend.shared.models import TopProductsResponse, TopProduct

router = APIRouter()


@router.get("/top-products", response_model=TopProductsResponse)
async def get_top_products_endpoint(
    start_date: str = Query(..., description="Start date in ISO format (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date in ISO format (YYYY-MM-DD)"),
    limit: int = Query(default=5, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    start = date.fromisoformat(start_date)
    end = date.fromisoformat(end_date)

    if start > end:
        return TopProductsResponse(products=[])

    products = await get_top_products(db, start_date, end_date, limit)

    return TopProductsResponse(products=products)