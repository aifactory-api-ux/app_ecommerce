from pydantic import BaseModel, Field
from datetime import date
from typing import List


class ProductStat(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float


class SalesReportRequest(BaseModel):
    start_date: date = Field(..., description="Start date in ISO format (YYYY-MM-DD)")
    end_date: date = Field(..., description="End date in ISO format (YYYY-MM-DD)")


class SalesReportResponse(BaseModel):
    total_sales: int
    total_revenue: float
    top_products: List[ProductStat]