# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.110.0
  - Uvicorn 0.29.0
  - SQLAlchemy 2.0.29
  - PostgreSQL 15
  - Pydantic 2.6.4
  - Alembic 1.13.1

- **Frontend**
  - React 18.2.0
  - TypeScript 5.4.2
  - Vite 5.2.0
  - React Query 4.39.3
  - Axios 1.6.7
  - Material UI (MUI) 5.15.0
  - Chart.js 4.4.1

- **Infrastructure**
  - Docker 26.0.0
  - Docker Compose 2.27.0

---

## 2. DATA CONTRACTS

### Python (Pydantic Models)

```python
from pydantic import BaseModel
from datetime import date
from typing import List

class SalesSummary(BaseModel):
    total_sales: int
    total_revenue: float
    period_start: date
    period_end: date

class ProductStat(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float

class TopProductsResponse(BaseModel):
    products: List[ProductStat]

class SalesReportRequest(BaseModel):
    start_date: date
    end_date: date

class SalesReportResponse(BaseModel):
    total_sales: int
    total_revenue: float
    top_products: List[ProductStat]
```

### TypeScript (Frontend Interfaces)

```typescript
export interface SalesSummary {
  total_sales: number;
  total_revenue: number;
  period_start: string; // ISO date string
  period_end: string;   // ISO date string
}

export interface ProductStat {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
}

export interface TopProductsResponse {
  products: ProductStat[];
}

export interface SalesReportRequest {
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
}

export interface SalesReportResponse {
  total_sales: number;
  total_revenue: number;
  top_products: ProductStat[];
}
```

---

## 3. API ENDPOINTS

### 1. Get Sales Summary

- **Method:** GET
- **Path:** `/api/dashboard/sales-summary`
- **Query Parameters:**
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
- **Request Body:** None
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `SalesSummary`

### 2. Get Top Selling Products

- **Method:** GET
- **Path:** `/api/dashboard/top-products`
- **Query Parameters:**
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
  - `limit` (integer, optional, default: 5)
- **Request Body:** None
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `TopProductsResponse`

### 3. Generate Sales Report

- **Method:** POST
- **Path:** `/api/dashboard/sales-report`
- **Request Body:** `SalesReportRequest`
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `SalesReportResponse`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                   |
|-----------------|---------------|------------------------|
| dashboard-api   | 23010         | backend/dashboard-api/ |

### FILE TREE

```
.
├── backend/
│   ├── dashboard-api/
│   │   ├── main.py                # FastAPI app entry point
│   │   ├── api/
│   │   │   ├── __init__.py        # API router init
│   │   │   └── dashboard.py       # Dashboard endpoints
│   │   ├── models/
│   │   │   ├── __init__.py        # Models package init
│   │   │   └── sales.py           # SQLAlchemy models for sales, products
│   │   ├── schemas/
│   │   │   ├── __init__.py        # Schemas package init
│   │   │   └── dashboard.py       # Pydantic models
│   │   ├── services/
│   │   │   ├── __init__.py        # Services package init
│   │   │   └── dashboard.py       # Business logic for dashboard
│   │   ├── db/
│   │   │   ├── __init__.py        # DB package init
│   │   │   └── session.py         # SQLAlchemy session setup
│   │   ├── Dockerfile             # Dockerfile for dashboard-api
│   │   ├── alembic.ini            # Alembic config
│   │   └── migrations/            # Alembic migrations
│   │       └── ...                # Migration scripts
│   ├── shared/
│   │   ├── __init__.py            # Shared utilities
│   │   └── utils.py               # Date/time, formatting helpers
│   └── .env.example               # Backend environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main React app
│   │   ├── main.tsx               # Vite entry point
│   │   ├── api/
│   │   │   └── dashboard.ts       # API client functions
│   │   ├── hooks/
│   │   │   └── useDashboard.ts    # React Query hooks for dashboard
│   │   ├── components/
│   │   │   ├── SalesSummaryCard.tsx      # Sales summary widget
│   │   │   ├── TopProductsTable.tsx      # Top products table
│   │   │   ├── RevenueChart.tsx          # Revenue chart component
│   │   │   └── ReportGenerator.tsx       # Report generation form
│   │   ├── types/
│   │   │   └── dashboard.ts        # TypeScript interfaces
│   │   └── theme.ts                # MUI theme config
│   ├── public/
│   │   └── index.html              # HTML entry point
│   ├── Dockerfile                  # Dockerfile for frontend
│   └── .env.example                # Frontend environment variables template
├── docker-compose.yml              # Multi-service orchestration
├── run.sh                          # Startup script for local dev
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
```

---

## 5. ENVIRONMENT VARIABLES

### Backend (.env.example)

| Name                | Type    | Description                                 | Example Value         |
|---------------------|---------|---------------------------------------------|----------------------|
| POSTGRES_HOST       | string  | PostgreSQL host                             | db                   |
| POSTGRES_PORT       | int     | PostgreSQL port (container-internal)        | 5432                 |
| POSTGRES_USER       | string  | PostgreSQL username                         | dashboard_user       |
| POSTGRES_PASSWORD   | string  | PostgreSQL password                         | dashboard_pass       |
| POSTGRES_DB         | string  | PostgreSQL database name                    | dashboard_db         |
| DASHBOARD_API_PORT  | int     | Dashboard API listening port                | 23010                |
| ALLOWED_ORIGINS     | string  | CORS allowed origins (comma-separated)      | http://localhost:5173|

### Frontend (.env.example)

| Name                | Type    | Description                                 | Example Value         |
|---------------------|---------|---------------------------------------------|----------------------|
| VITE_API_URL        | string  | Base URL for dashboard API                  | http://localhost:23010|

---

## 6. IMPORT CONTRACTS

### Backend

- `from schemas.dashboard import SalesSummary, ProductStat, TopProductsResponse, SalesReportRequest, SalesReportResponse`
- `from services.dashboard import get_sales_summary, get_top_products, generate_sales_report`
- `from db.session import get_db`
- `from shared.utils import parse_date_range, format_currency`

### Frontend

- `import { SalesSummary, ProductStat, TopProductsResponse, SalesReportRequest, SalesReportResponse } from '../types/dashboard'`
- `import { useDashboard } from '../hooks/useDashboard'`
- `import { getSalesSummary, getTopProducts, generateSalesReport } from '../api/dashboard'`
- `import SalesSummaryCard from '../components/SalesSummaryCard'`
- `import TopProductsTable from '../components/TopProductsTable'`
- `import RevenueChart from '../components/RevenueChart'`
- `import ReportGenerator from '../components/ReportGenerator'`

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

#### React Hook

```typescript
useDashboard() → {
  salesSummary: SalesSummary | undefined,
  topProducts: ProductStat[] | undefined,
  salesReport: SalesReportResponse | undefined,
  loadingSummary: boolean,
  loadingTopProducts: boolean,
  loadingReport: boolean,
  errorSummary: string | null,
  errorTopProducts: string | null,
  errorReport: string | null,
  fetchSalesSummary: (start_date: string, end_date: string) => void,
  fetchTopProducts: (start_date: string, end_date: string, limit?: number) => void,
  generateSalesReport: (data: SalesReportRequest) => Promise<void>
}
```

### Reusable Components

#### SalesSummaryCard

```typescript
SalesSummaryCard props: {
  summary: SalesSummary,
  loading: boolean,
  error: string | null
}
```

#### TopProductsTable

```typescript
TopProductsTable props: {
  products: ProductStat[],
  loading: boolean,
  error: string | null
}
```

#### RevenueChart

```typescript
RevenueChart props: {
  summary: SalesSummary,
  loading: boolean
}
```

#### ReportGenerator

```typescript
ReportGenerator props: {
  onGenerate: (data: SalesReportRequest) => void,
  loading: boolean,
  error: string | null,
  report: SalesReportResponse | undefined
}
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---