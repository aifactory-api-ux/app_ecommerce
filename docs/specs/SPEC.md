# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.110.0
  - Uvicorn 0.29.0
  - SQLAlchemy 2.0.29
  - Pydantic 2.7.1
  - PostgreSQL 15
  - Alembic 1.13.1

- **Frontend**
  - React 18.2.0
  - TypeScript 5.4.2
  - Vite 5.2.0
  - React Query 4.39.3
  - Axios 1.6.8
  - Material UI 5.15.14
  - Chart.js 4.4.2

- **Infrastructure**
  - Docker 26.0.0
  - Docker Compose 2.27.0

---

## 2. DATA CONTRACTS

### Python (Pydantic Models)

```python
# backend/shared/models.py

from pydantic import BaseModel
from datetime import date
from typing import List

class SalesSummary(BaseModel):
    total_sales: int
    total_revenue: float
    period_start: date
    period_end: date

class TopProduct(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float

class TopProductsResponse(BaseModel):
    products: List[TopProduct]

class SalesReportRequest(BaseModel):
    start_date: date
    end_date: date

class SalesReportResponse(BaseModel):
    summary: SalesSummary
    top_products: List[TopProduct]
```

### TypeScript (Frontend Interfaces)

```typescript
// frontend/src/types/sales.ts

export interface SalesSummary {
  total_sales: number;
  total_revenue: number;
  period_start: string; // ISO date
  period_end: string;   // ISO date
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

export interface SalesReportRequest {
  start_date: string; // ISO date
  end_date: string;   // ISO date
}

export interface SalesReportResponse {
  summary: SalesSummary;
  top_products: TopProduct[];
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
- **Request Body:** _None_
- **Response:**
  - **Status:** 200 OK
  - **Schema:** `SalesSummary`

### 2. Get Top Products

- **Method:** GET
- **Path:** `/api/dashboard/top-products`
- **Query Parameters:**
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
  - `limit` (integer, optional, default: 5)
- **Request Body:** _None_
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

| Service         | Listening Port | Path                      |
|-----------------|---------------|---------------------------|
| dashboard-api   | 23010         | backend/dashboard-api/    |

### FILE TREE

```
.
├── backend/
│   ├── dashboard-api/
│   │   ├── main.py                # FastAPI app entry point
│   │   ├── api.py                 # API route definitions
│   │   ├── models.py              # SQLAlchemy ORM models
│   │   ├── schemas.py             # Pydantic schemas for API
│   │   ├── crud.py                # Database access functions
│   │   ├── dependencies.py        # Dependency overrides (DB, etc.)
│   │   ├── config.py              # Settings and env var loading
│   │   ├── __init__.py            # Package marker
│   │   └── Dockerfile             # Docker build for dashboard-api
│   ├── shared/
│   │   ├── models.py              # Shared Pydantic models
│   │   └── __init__.py            # Package marker
│   └── alembic/
│       ├── env.py                 # Alembic environment
│       ├── script.py.mako         # Alembic migration template
│       ├── versions/              # Migration scripts
│       └── README                 # Alembic usage notes
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx      # Main dashboard component
│   │   │   ├── SalesSummaryCard.tsx # Card for sales summary
│   │   │   ├── TopProductsTable.tsx # Table for top products
│   │   │   ├── SalesChart.tsx     # Chart.js sales chart
│   │   │   └── ReportDialog.tsx   # Dialog for report generation
│   │   ├── hooks/
│   │   │   ├── useSalesSummary.ts # React Query hook for summary
│   │   │   ├── useTopProducts.ts  # React Query hook for top products
│   │   │   └── useSalesReport.ts  # React Query hook for reports
│   │   ├── types/
│   │   │   └── sales.ts           # TypeScript interfaces (see above)
│   │   ├── App.tsx                # App root
│   │   ├── main.tsx               # Vite entry point
│   │   └── index.css              # Global styles
│   ├── public/
│   │   └── index.html             # HTML entry point
│   ├── Dockerfile                 # Docker build for frontend
│   └── vite.config.ts             # Vite configuration
├── docker-compose.yml             # Multi-service orchestration
├── .env.example                   # Environment variable template
├── run.sh                         # Startup script for local dev
├── .gitignore                     # Git ignore rules
├── README.md                      # Project documentation
```

---

## 5. ENVIRONMENT VARIABLES

| Name                        | Type    | Description                                      | Example Value           |
|-----------------------------|---------|--------------------------------------------------|------------------------|
| POSTGRES_HOST               | string  | PostgreSQL host                                  | db                     |
| POSTGRES_PORT               | int     | PostgreSQL port (container-internal)             | 5432                   |
| POSTGRES_USER               | string  | PostgreSQL username                              | dashboard_user         |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                              | dashboard_pass         |
| POSTGRES_DB                 | string  | PostgreSQL database name                         | dashboard_db           |
| DASHBOARD_API_PORT          | int     | Port dashboard-api listens on (container)        | 23010                  |
| DASHBOARD_API_HOST          | string  | Host for dashboard-api (container)               | 0.0.0.0                |
| FRONTEND_PORT               | int     | Port frontend listens on (container)             | 3000                   |
| FRONTEND_HOST               | string  | Host for frontend (container)                    | 0.0.0.0                |
| REACT_APP_API_URL           | string  | Base URL for API requests (frontend)             | http://localhost:23010 |
| TZ                          | string  | Timezone for containers                          | UTC                    |

---

## 6. IMPORT CONTRACTS

### Backend

```python
# backend/dashboard-api/main.py
from api import router

# backend/dashboard-api/api.py
from schemas import SalesSummary, TopProductsResponse, SalesReportRequest, SalesReportResponse
from crud import get_sales_summary, get_top_products, generate_sales_report

# backend/dashboard-api/schemas.py
from pydantic import BaseModel
from shared.models import SalesSummary, TopProduct, TopProductsResponse, SalesReportRequest, SalesReportResponse

# backend/dashboard-api/crud.py
def get_sales_summary(start_date: date, end_date: date) -> SalesSummary
def get_top_products(start_date: date, end_date: date, limit: int) -> List[TopProduct]
def generate_sales_report(start_date: date, end_date: date) -> SalesReportResponse

# backend/shared/models.py
from pydantic import BaseModel
class SalesSummary(BaseModel)
class TopProduct(BaseModel)
class TopProductsResponse(BaseModel)
class SalesReportRequest(BaseModel)
class SalesReportResponse(BaseModel)
```

### Frontend

```typescript
// frontend/src/hooks/useSalesSummary.ts
import { SalesSummary } from '../types/sales';
export function useSalesSummary(params: { start_date: string; end_date: string }): {
  data: SalesSummary | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

// frontend/src/hooks/useTopProducts.ts
import { TopProduct } from '../types/sales';
export function useTopProducts(params: { start_date: string; end_date: string; limit?: number }): {
  data: TopProduct[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

// frontend/src/hooks/useSalesReport.ts
import { SalesReportRequest, SalesReportResponse } from '../types/sales';
export function useSalesReport(): {
  generateReport: (params: SalesReportRequest) => Promise<SalesReportResponse>;
  isLoading: boolean;
  error: unknown;
}

// frontend/src/types/sales.ts
export interface SalesSummary
export interface TopProduct
export interface TopProductsResponse
export interface SalesReportRequest
export interface SalesReportResponse
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```
useSalesSummary(params) → { data, isLoading, error, refetch }
useTopProducts(params)  → { data, isLoading, error, refetch }
useSalesReport()        → { generateReport, isLoading, error }
```

- `useSalesSummary(params: { start_date: string; end_date: string })`
  - `data: SalesSummary | undefined`
  - `isLoading: boolean`
  - `error: unknown`
  - `refetch: () => void`

- `useTopProducts(params: { start_date: string; end_date: string; limit?: number })`
  - `data: TopProduct[] | undefined`
  - `isLoading: boolean`
  - `error: unknown`
  - `refetch: () => void`

- `useSalesReport()`
  - `generateReport: (params: SalesReportRequest) => Promise<SalesReportResponse>`
  - `isLoading: boolean`
  - `error: unknown`

### Reusable Components

```
Dashboard           props: { }
SalesSummaryCard    props: { summary: SalesSummary | undefined; loading: boolean }
TopProductsTable    props: { products: TopProduct[] | undefined; loading: boolean }
SalesChart          props: { summary: SalesSummary | undefined; products: TopProduct[] | undefined; loading: boolean }
ReportDialog        props: { open: boolean; onClose: () => void; onGenerate: (params: SalesReportRequest) => void; loading: boolean }
```

- `Dashboard`
  - No props (root dashboard page)

- `SalesSummaryCard`
  - `summary: SalesSummary | undefined`
  - `loading: boolean`

- `TopProductsTable`
  - `products: TopProduct[] | undefined`
  - `loading: boolean`

- `SalesChart`
  - `summary: SalesSummary | undefined`
  - `products: TopProduct[] | undefined`
  - `loading: boolean`

- `ReportDialog`
  - `open: boolean`
  - `onClose: () => void`
  - `onGenerate: (params: SalesReportRequest) => void`
  - `loading: boolean`

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---