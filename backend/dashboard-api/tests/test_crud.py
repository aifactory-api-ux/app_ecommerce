import pytest
from datetime import date

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.shared.models import TopProduct


class TestGetTopProducts:
    def test_get_top_products_returns_correct_products_and_order(self):
        from dashboard_api.crud import get_top_products

        result = get_top_products("2024-01-01", "2024-01-31", 5)
        assert isinstance(result, list)
        for product in result:
            assert isinstance(product, TopProduct)
            assert hasattr(product, "product_id")
            assert hasattr(product, "product_name")
            assert hasattr(product, "units_sold")
            assert hasattr(product, "revenue")

    def test_get_top_products_with_no_sales_returns_empty_list(self):
        from dashboard_api.crud import get_top_products

        result = get_top_products("1999-01-01", "1999-01-31", 5)
        assert result == []

    def test_get_top_products_with_limit_greater_than_products_returns_all(self):
        from dashboard_api.crud import get_top_products

        result = get_top_products("2024-01-01", "2024-01-31", 100)
        assert isinstance(result, list)

    def test_get_top_products_with_limit_one_returns_top_product(self):
        from dashboard_api.crud import get_top_products

        result = get_top_products("2024-01-01", "2024-01-31", 1)
        assert isinstance(result, list)
        assert len(result) <= 1

    def test_get_top_products_invalid_date_range_raises_value_error(self):
        from dashboard_api.crud import get_top_products

        with pytest.raises(ValueError):
            get_top_products("2024-02-01", "2024-01-01", 5)

    def test_get_top_products_limit_zero_raises_value_error(self):
        from dashboard_api.crud import get_top_products

        with pytest.raises(ValueError):
            get_top_products("2024-01-01", "2024-01-31", 0)

    def test_get_top_products_limit_negative_raises_value_error(self):
        from dashboard_api.crud import get_top_products

        with pytest.raises(ValueError):
            get_top_products("2024-01-01", "2024-01-31", -10)