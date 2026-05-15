import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import date

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from schemas import SalesReportRequest, SalesReportResponse, SalesSummary, TopProduct, TopProductsResponse
from crud import get_sales_summary, get_top_products, generate_sales_report


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac