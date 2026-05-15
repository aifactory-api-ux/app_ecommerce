from datetime import date
from typing import List

from shared.models import (
    SalesSummary,
    TopProduct,
    SalesReportResponse,
)


def get_sales_summary(start_date: date, end_date: date) -> SalesSummary:
    if start_date > end_date:
        raise ValueError("start_date must be before or equal to end_date")

    return SalesSummary(
        total_sales=0,
        total_revenue=0.0,
        period_start=start_date,
        period_end=end_date,
    )


def get_top_products(start_date: date, end_date: date, limit: int = 5) -> List[TopProduct]:
    if start_date > end_date:
        raise ValueError("start_date must be before or equal to end_date")

    return []


def generate_sales_report(start_date: date, end_date: date) -> SalesReportResponse:
    if start_date > end_date:
        raise ValueError("start_date must be before or equal to end_date")

    summary = SalesSummary(
        total_sales=0,
        total_revenue=0.0,
        period_start=start_date,
        period_end=end_date,
    )

    return SalesReportResponse(
        summary=summary,
        top_products=[],
    )