import pytest
from pydantic import ValidationError
from datetime import date

from backend.shared.models import (
    SalesReportRequest,
    SalesReportResponse,
    SalesSummary,
    ProductStat
)


def test_sales_report_request_validates_iso_date_strings():
    request = SalesReportRequest(start_date=date(2024, 6, 1), end_date=date(2024, 6, 30))
    assert request.start_date == date(2024, 6, 1)
    assert request.end_date == date(2024, 6, 30)


def test_sales_report_request_missing_start_date_raises_validation_error():
    with pytest.raises(ValidationError):
        SalesReportRequest(end_date=date(2024, 6, 30))


def test_sales_report_request_invalid_date_format_raises_validation_error():
    with pytest.raises(ValidationError):
        SalesReportRequest(start_date="06-01-2024", end_date=date(2024, 6, 30))


def test_sales_report_response_serializes_summary_and_top_products():
    summary = SalesSummary(
        total_sales=10,
        total_revenue=1000.0,
        period_start=date(2024, 6, 1),
        period_end=date(2024, 6, 30)
    )
    top_products = [
        ProductStat(
            product_id=1,
            product_name="Producto A",
            units_sold=5,
            revenue=500.0
        )
    ]
    response = SalesReportResponse(summary=summary, top_products=top_products)
    assert response.summary.total_sales == 10
    assert response.summary.total_revenue == 1000.0
    assert response.summary.period_start == date(2024, 6, 1)
    assert response.summary.period_end == date(2024, 6, 30)
    assert len(response.top_products) == 1
    assert response.top_products[0].product_name == "Producto A"