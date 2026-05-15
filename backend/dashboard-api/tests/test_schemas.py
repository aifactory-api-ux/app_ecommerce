import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))
from datetime import date

from pydantic import ValidationError
from schemas import SalesReportRequest, SalesReportResponse, SalesSummary, TopProduct


def test_sales_report_request_validates_required_fields():
    with pytest.raises(ValidationError):
        SalesReportRequest(start_date=date(2024, 1, 1))

    with pytest.raises(ValidationError):
        SalesReportRequest(end_date=date(2024, 1, 31))


def test_sales_report_request_invalid_date_type_raises_validation_error():
    with pytest.raises(ValidationError):
        SalesReportRequest(start_date="not-a-date", end_date="2024-01-31")


def test_sales_report_response_serialization_and_fields():
    data = {
        'summary': {
            'total_sales': 10,
            'total_revenue': 1000.0,
            'period_start': date(2024, 1, 1),
            'period_end': date(2024, 1, 31)
        },
        'top_products': [
            {
                'product_id': 1,
                'product_name': 'Widget',
                'units_sold': 5,
                'revenue': 500.0
            }
        ]
    }
    response = SalesReportResponse(**data)

    assert hasattr(response, 'summary')
    assert hasattr(response, 'top_products')
    assert response.summary.total_sales == 10
    assert response.summary.total_revenue == 1000.0
    assert len(response.top_products) == 1
    assert response.top_products[0].product_name == 'Widget'


def test_sales_report_response_empty_top_products_allowed():
    data = {
        'summary': {
            'total_sales': 0,
            'total_revenue': 0.0,
            'period_start': date(2024, 1, 1),
            'period_end': date(2024, 1, 31)
        },
        'top_products': []
    }
    response = SalesReportResponse(**data)

    assert response.summary.total_sales == 0
    assert response.top_products == []