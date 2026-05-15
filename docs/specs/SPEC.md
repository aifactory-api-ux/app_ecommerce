# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.110.0
  - Uvicorn 0.29.0
  - SQLAlchemy 2.0.29
  - PostgreSQL 15
  - Pydantic 2.7.1
  - python-dotenv 1.0.1

- **Frontend**
  - React 18.2.0
  - TypeScript 5.4.2
  - Vite 5.2.0
  - React Query 3.39.3
  - Axios 1.6.7
  - Material UI 5.15.0
  - Chart.js 4.4.1

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
    summary: SalesSummary
    top_products: List[ProductStat]
```

### TypeScript (Frontend Interfaces)

```typescript
// src/types/models.ts

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
  summary: SalesSummary;
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
  ```json
  {
    "total_sales": 123,
    "total_revenue": 4567.89,
    "period_start": "2024-06-01",
    "period_end": "2024-06-30"
  }
  ```
  **Schema:** `SalesSummary`

---

### 2. Get Top Selling Products

- **Method:** GET
- **Path:** `/api/dashboard/top-products`
- **Query Parameters:**
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
  - `limit` (integer, optional, default 5)
- **Request Body:** None
- **Response:**
  ```json
  {
    "products": [
      {
        "product_id": 1,
        "product_name": "Producto A",
        "units_sold": 100,
        "revenue": 2000.00
      }
    ]
  }
  ```
  **Schema:** `TopProductsResponse`

---

### 3. Generate Sales Report

- **Method:** POST
- **Path:** `/api/dashboard/sales-report`
- **Request Body:**
  ```json
  {
    "start_date": "2024-06-01",
    "end_date": "2024-06-30"
  }
  ```
  **Schema:** `SalesReportRequest`
- **Response:**
  ```json
  {
    "summary": {
      "total_sales": 123,
      "total_revenue": 4567.89,
      "period_start": "2024-06-01",
      "period_end": "2024-06-30"
    },
    "top_products": [
      {
        "product_id": 1,
        "product_name": "Producto A",
        "units_sold": 100,
        "revenue": 2000.00
      }
    ]
  }
  ```
  **Schema:** `SalesReportResponse`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                      |
|-----------------|---------------|---------------------------|
| dashboard-api   | 23010         | backend/dashboard-api/    |

---

### FILE TREE

```
.
├── docker-compose.yml                # Orchestrates backend, frontend, and database containers
├── .env.example                      # Template for environment variables
├── .gitignore                        # Git ignore rules
├── README.md                         # Project documentation
├── run.sh                            # Root startup script
├── backend/
│   ├── shared/
│   │   ├── __init__.py               # Shared module init
│   │   └── models.py                 # Shared Pydantic models
│   └── dashboard-api/
│       ├── Dockerfile                # Dockerfile for dashboard API
│       ├── main.py                   # FastAPI entrypoint
│       ├── api/
│       │   ├── __init__.py           # API module init
│       │   └── dashboard.py          # API endpoints for dashboard
│       ├── db/
│       │   ├── __init__.py           # DB module init
│       │   └── session.py            # SQLAlchemy session and engine
│       ├── models/
│       │   ├── __init__.py           # ORM models init
│       │   └── sale.py               # SQLAlchemy Sale/Product models
│       ├── services/
│       │   ├── __init__.py           # Services module init
│       │   └── dashboard_service.py  # Business logic for dashboard
│       ├── dependencies.py           # FastAPI dependencies
│       ├── config.py                 # Settings loader
│       └── start.sh                  # Service startup script
├── frontend/
│   ├── Dockerfile                    # Dockerfile for frontend
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── package.json                  # NPM dependencies
│   ├── public/
│   │   └── index.html                # HTML entrypoint
│   └── src/
│       ├── main.tsx                  # React entrypoint
│       ├── App.tsx                   # Root component
│       ├── api/
│       │   └── dashboard.ts          # API client for dashboard endpoints
│       ├── hooks/
│       │   └── useDashboard.ts       # React Query hooks for dashboard data
│       ├── components/
│       │   ├── DashboardSummary.tsx  # Summary metrics component
│       │   ├── TopProductsChart.tsx  # Chart for top products
│       │   ├── SalesReportForm.tsx   # Form to generate reports
│       │   └── ReportTable.tsx       # Table for report results
│       └── types/
│           └── models.ts             # TypeScript interfaces (data contracts)
```

---

## 5. ENVIRONMENT VARIABLES

| Name                    | Type   | Description                                         | Example Value                |
|-------------------------|--------|-----------------------------------------------------|-----------------------------|
| POSTGRES_HOST           | string | Hostname for PostgreSQL database                    | db                          |
| POSTGRES_PORT           | int    | PostgreSQL port (container-internal)                | 5432                        |
| POSTGRES_USER           | string | PostgreSQL username                                 | dashboard                   |
| POSTGRES_PASSWORD       | string | PostgreSQL password                                 | secretpassword              |
| POSTGRES_DB             | string | PostgreSQL database name                            | dashboard_db                |
| DASHBOARD_API_PORT      | int    | Port dashboard-api listens on (container-internal)  | 23010                       |
| FRONTEND_PORT           | int    | Port frontend listens on (container-internal)       | 3000                        |
| BACKEND_CORS_ORIGINS    | string | Comma-separated list of allowed CORS origins        | http://localhost:3000       |
| ENVIRONMENT             | string | Deployment environment (development/production)     | development                 |

---

## 6. IMPORT CONTRACTS

### Backend

```python
# backend/shared/models.py
from backend.shared.models import SalesSummary, ProductStat, TopProductsResponse, SalesReportRequest, SalesReportResponse

# backend/dashboard-api/api/dashboard.py
from backend.dashboard-api.api.dashboard import (
    get_sales_summary,
    get_top_products,
    generate_sales_report
)

# backend/dashboard-api/services/dashboard_service.py
from backend.dashboard-api.services.dashboard_service import (
    fetch_sales_summary,
    fetch_top_products,
    fetch_sales_report
)

# backend/dashboard-api/db/session.py
from backend.dashboard-api.db.session import get_db

# backend/dashboard-api/config.py
from backend.dashboard-api.config import settings
```

### Frontend

```typescript
// src/types/models.ts
import {
  SalesSummary,
  ProductStat,
  TopProductsResponse,
  SalesReportRequest,
  SalesReportResponse
} from '../types/models';

// src/api/dashboard.ts
import {
  getSalesSummary,
  getTopProducts,
  generateSalesReport
} from '../api/dashboard';

// src/hooks/useDashboard.ts
import { useDashboardSummary, useTopProducts, useSalesReport } from '../hooks/useDashboard';
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```typescript
// src/hooks/useDashboard.ts

useDashboardSummary(startDate: string, endDate: string) → {
  summary: SalesSummary | undefined,
  loading: boolean,
  error: Error | null,
  refetch: () => void
}

useTopProducts(startDate: string, endDate: string, limit?: number) → {
  products: ProductStat[] | undefined,
  loading: boolean,
  error: Error | null,
  refetch: () => void
}

useSalesReport() → {
  generateReport: (params: SalesReportRequest) => Promise<SalesReportResponse>,
  data: SalesReportResponse | undefined,
  loading: boolean,
  error: Error | null
}
```

### Reusable Component Props

```typescript
// src/components/DashboardSummary.tsx
DashboardSummary props: {
  summary: SalesSummary | undefined,
  loading: boolean
}

// src/components/TopProductsChart.tsx
TopProductsChart props: {
  products: ProductStat[] | undefined,
  loading: boolean
}

// src/components/SalesReportForm.tsx
SalesReportForm props: {
  onSubmit: (params: SalesReportRequest) => void,
  loading: boolean
}

// src/components/ReportTable.tsx
ReportTable props: {
  report: SalesReportResponse | undefined,
  loading: boolean
}
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---