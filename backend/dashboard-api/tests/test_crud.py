import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))
from datetime import date

from crud import generate_sales_report, get_sales_summary, get_top_products


def test_generate_sales_report_returns_correct_summary_and_top_products():
    result = generate_sales_report(date(2024, 1, 1), date(2024, 1, 31))

    assert 'summary' in result
    assert 'top_products' in result
    assert hasattr(result['summary'], 'total_sales')
    assert hasattr(result['summary'], 'total_revenue')
    assert hasattr(result['summary'], 'period_start')
    assert hasattr(result['summary'], 'period_end')
    assert isinstance(result['top_products'], list)


def test_generate_sales_report_no_sales_returns_zero_summary_and_empty_top_products():
    result = generate_sales_report(date(1999, 1, 1), date(1999, 1, 31))

    assert result['summary'].total_sales == 0
    assert result['summary'].total_revenue == 0.0
    assert result['top_products'] == []


def test_generate_sales_report_start_date_after_end_date_raises_value_error():
    with pytest.raises(ValueError):
        generate_sales_report(date(2024, 2, 1), date(2024, 1, 31))


def test_generate_sales_report_handles_large_dataset_performance():
    import time

    start = time.time()
    result = generate_sales_report(date(2020, 1, 1), date(2024, 12, 31))
    elapsed = time.time() - start

    assert elapsed < 2
    assert 'summary' in result
    assert 'top_products' in result