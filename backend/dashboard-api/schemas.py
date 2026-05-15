from pydantic import BaseModel, field_validator
from datetime import date

from shared.models import (
    SalesSummary,
    TopProduct,
    TopProductsResponse,
    SalesReportResponse,
)

from shared.models import SalesReportRequest as BaseSalesReportRequest


class SalesReportRequest(BaseSalesReportRequest):
    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def parse_date(cls, v):
        if isinstance(v, str):
            return date.fromisoformat(v)
        return v