from pydantic import BaseModel
from datetime import date
from typing import List


class SalesSummary(BaseModel):
    total_sales: int
    total_revenue: float
    period_start: date
    period_end: date


class ProductSales(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float


class TopProductsResponse(BaseModel):
    products: List[ProductSales]


class SalesReportRequest(BaseModel):
    start_date: date
    end_date: date


class SalesReportResponse(BaseModel):
    summary: SalesSummary
    top_products: List[ProductSales]