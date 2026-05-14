from fastapi import APIRouter, Query, HTTPException, status
from datetime import date
from backend.shared.models import SalesSummary, TopProductsResponse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/sales-summary", response_model=SalesSummary)
async def get_sales_summary(
    start_date: str = Query(..., description="Start date in ISO format (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date in ISO format (YYYY-MM-DD)")
):
    try:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    if start > end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date cannot be greater than end_date"
        )

    from dashboard_api.db.session import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        try:
            from sqlalchemy import select, func
            from dashboard_api.models.sale import Sale

            query = select(
                func.count(Sale.id).label("total_sales"),
                func.coalesce(func.sum(Sale.total_price), 0).label("total_revenue")
            ).where(
                Sale.sale_date >= start,
                Sale.sale_date <= end
            )

            result = await db.execute(query)
            row = result.one()

            return SalesSummary(
                total_sales=row.total_sales or 0,
                total_revenue=float(row.total_revenue or 0),
                period_start=start,
                period_end=end
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )


@router.get("/top-products", response_model=TopProductsResponse)
async def get_top_products(
    start_date: str = Query(..., description="Start date in ISO format (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date in ISO format (YYYY-MM-DD)"),
    limit: int = Query(5, ge=1, description="Maximum number of products to return")
):
    try:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    if start > end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date cannot be greater than end_date"
        )

    from dashboard_api.db.session import AsyncSessionLocal
    from dashboard_api.crud import get_top_products as crud_get_top_products

    async with AsyncSessionLocal() as db:
        try:
            products = await crud_get_top_products(db, start, end, limit)
            return TopProductsResponse(products=products)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )