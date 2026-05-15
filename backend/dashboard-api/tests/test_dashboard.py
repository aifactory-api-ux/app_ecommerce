import pytest
from pydantic import ValidationError
from backend.dashboard-api.schemas.dashboard import SalesReportRequest, SalesReportResponse, ProductStat


class TestSalesReportRequest:
    def test_sales_report_request_model_accepts_valid_dates(self):
        request = SalesReportRequest(start_date='2024-01-01', end_date='2024-01-31')
        assert request.start_date is not None
        assert request.end_date is not None

    def test_sales_report_request_model_missing_start_date_raises_validation_error(self):
        with pytest.raises(ValidationError) as exc_info:
            SalesReportRequest(end_date='2024-01-31')
        assert 'start_date' in str(exc_info.value)

    def test_sales_report_request_model_invalid_date_format_raises_validation_error(self):
        with pytest.raises(ValidationError):
            SalesReportRequest(start_date='2024/01/01', end_date='2024-01-31')


class TestSalesReportResponse:
    def test_sales_report_response_model_accepts_valid_data(self):
        product = ProductStat(
            product_id=1,
            product_name='Product A',
            units_sold=5,
            revenue=500.0
        )
        response = SalesReportResponse(
            total_sales=10,
            total_revenue=1234.56,
            top_products=[product]
        )
        assert response.total_sales == 10
        assert response.total_revenue == 1234.56
        assert len(response.top_products) == 1

    def test_sales_report_response_model_empty_top_products_list_valid(self):
        response = SalesReportResponse(
            total_sales=0,
            total_revenue=0.0,
            top_products=[]
        )
        assert response.total_sales == 0
        assert response.total_revenue == 0.0
        assert response.top_products == []