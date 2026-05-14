import pytest
from datetime import date

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.services.dashboard_service import get_sales_summary_sync as get_sales_summary


class TestGetSalesSummary:
    def test_get_sales_summary_returns_correct_summary_for_valid_dates(self):
        result = get_sales_summary("2024-06-01", "2024-06-30")
        assert hasattr(result, "total_sales")
        assert hasattr(result, "total_revenue")
        assert hasattr(result, "period_start")
        assert hasattr(result, "period_end")

    def test_get_sales_summary_no_sales_returns_zero_summary(self):
        result = get_sales_summary("2023-01-01", "2023-01-31")
        assert result.total_sales == 0
        assert result.total_revenue == 0.0
        assert str(result.period_start) == "2023-01-01"
        assert str(result.period_end) == "2023-01-31"

    def test_get_sales_summary_start_date_after_end_date_raises_value_error(self):
        with pytest.raises(ValueError):
            get_sales_summary("2024-07-01", "2024-06-30")

    def test_get_sales_summary_handles_database_exception(self):
        with pytest.raises(Exception):
            get_sales_summary("2024-06-01", "2024-06-30")

    def test_get_sales_summary_edge_case_single_day_range(self):
        result = get_sales_summary("2024-06-15", "2024-06-15")
        assert str(result.period_start) == "2024-06-15"
        assert str(result.period_end) == "2024-06-15"