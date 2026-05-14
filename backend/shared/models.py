from pydantic import BaseModel
from datetime import date
from typing import List


class SalesSummary(BaseModel):
    total_sales: int
    total_revenue: float
    period_start: date
    period_end: date


class TopProduct(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float


class TopProductsResponse(BaseModel):
    products: List[TopProduct]


class SalesReportRequest(BaseModel):
    start_date: date
    end_date: date


class SalesReportEntry(BaseModel):
    date: date
    sales: int
    revenue: float


class SalesReportResponse(BaseModel):
    entries: List[SalesReportEntry]