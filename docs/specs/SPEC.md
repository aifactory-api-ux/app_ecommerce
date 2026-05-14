# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.110.0
  - Pydantic 2.6.4
  - SQLAlchemy 2.0.29
  - PostgreSQL 15
  - Uvicorn 0.29.0
- **Frontend**
  - React 18.2.0
  - TypeScript 5.4.2
  - Vite 5.2.0
  - React Query 4.39.3
  - Axios 1.6.7
  - Chart.js 4.4.1
  - Tailwind CSS 3.4.1
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

class SalesReportEntry(BaseModel):
    date: date
    sales: int
    revenue: float

class SalesReportResponse(BaseModel):
    report: List[SalesReportEntry]
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
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
}

export interface SalesReportEntry {
  date: string; // ISO date string
  sales: number;
  revenue: number;
}

export interface SalesReportResponse {
  report: SalesReportEntry[];
}
```

---

## 3. API ENDPOINTS

### 1. Get Sales Summary

- **Method:** GET
- **Path:** `/api/dashboard/sales-summary`
- **Request Body:** None
- **Query Parameters:**
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
- **Response:**
  - **Status:** 200 OK
  - **Body:** `SalesSummary`

### 2. Get Top Products

- **Method:** GET
- **Path:** `/api/dashboard/top-products`
- **Request Body:** None
- **Query Parameters:**
  - `limit` (integer, optional, default: 5)
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
- **Response:**
  - **Status:** 200 OK
  - **Body:** `TopProductsResponse`

### 3. Generate Sales Report

- **Method:** POST
- **Path:** `/api/dashboard/sales-report`
- **Request Body:** `SalesReportRequest`
- **Response:**
  - **Status:** 200 OK
  - **Body:** `SalesReportResponse`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                     |
|-----------------|---------------|--------------------------|
| dashboard-api   | 23010         | backend/dashboard-api/   |

### FILE TREE

```
.
├── backend/
│   ├── dashboard-api/
│   │   ├── main.py                # FastAPI app entry point
│   │   ├── api.py                 # API route definitions
│   │   ├── crud.py                # Database access and business logic
│   │   ├── models.py              # SQLAlchemy ORM models
│   │   ├── schemas.py             # Pydantic schemas (import from shared)
│   │   ├── database.py            # DB session and engine setup
│   │   ├── config.py              # Settings and env var loading
│   │   ├── Dockerfile             # Docker build for dashboard-api
│   │   └── __init__.py            # Package marker
│   ├── shared/
│   │   ├── models.py              # Shared Pydantic models
│   │   └── __init__.py            # Package marker
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main React component
│   │   ├── main.tsx               # Entry point for Vite
│   │   ├── api/
│   │   │   └── dashboard.ts       # API client functions
│   │   ├── hooks/
│   │   │   └── useDashboard.ts    # React Query hooks for dashboard data
│   │   ├── components/
│   │   │   ├── SalesSummaryCard.tsx      # Card for sales summary
│   │   │   ├── TopProductsTable.tsx      # Table for top products
│   │   │   ├── SalesReportChart.tsx      # Chart for sales report
│   │   │   └── DateRangePicker.tsx       # Date range selection component
│   │   ├── types/
│   │   │   └── models.ts           # TypeScript interfaces (mirrors backend)
│   │   └── index.css               # Tailwind CSS imports
│   ├── public/
│   │   └── index.html              # HTML entry point
│   ├── Dockerfile                  # Docker build for frontend
│   └── vite.config.ts              # Vite configuration
├── docker-compose.yml              # Multi-service orchestration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── run.sh                          # Startup script for local dev
```

---

## 5. ENVIRONMENT VARIABLES

| Name                       | Type    | Description                                         | Example Value           |
|----------------------------|---------|-----------------------------------------------------|------------------------|
| POSTGRES_HOST              | string  | Hostname for PostgreSQL database                    | db                     |
| POSTGRES_PORT              | int     | PostgreSQL port (container-internal)                | 5432                   |
| POSTGRES_USER              | string  | PostgreSQL username                                 | dashboard_user         |
| POSTGRES_PASSWORD          | string  | PostgreSQL password                                 | dashboard_pass         |
| POSTGRES_DB                | string  | PostgreSQL database name                            | dashboard_db           |
| DASHBOARD_API_PORT         | int     | Port dashboard-api listens on (container-internal)  | 23010                  |
| FRONTEND_PORT              | int     | Port frontend listens on (container-internal)       | 3000                   |
| BACKEND_CORS_ORIGINS       | string  | Comma-separated list of allowed CORS origins        | http://localhost:5173  |
| SECRET_KEY                 | string  | Secret key for session or JWT signing               | supersecretkey         |

---

## 6. IMPORT CONTRACTS

### Backend

```python
# backend/dashboard-api/main.py
from api import router as api_router
from config import settings

# backend/dashboard-api/api.py
from schemas import SalesSummary, TopProductsResponse, SalesReportRequest, SalesReportResponse
from crud import (
    get_sales_summary,
    get_top_products,
    generate_sales_report
)

# backend/dashboard-api/crud.py
from models import Sale, Product
from shared.models import (
    SalesSummary,
    TopProduct,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportEntry,
    SalesReportResponse
)

# backend/dashboard-api/schemas.py
from shared.models import (
    SalesSummary,
    TopProduct,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportEntry,
    SalesReportResponse
)

# backend/shared/models.py
# (exports all Pydantic models listed in §2)
```

### Frontend

```typescript
// src/api/dashboard.ts
import {
  SalesSummary,
  TopProductsResponse,
  SalesReportRequest,
  SalesReportResponse
} from '../types/models';

// src/hooks/useDashboard.ts
import {
  useSalesSummary,
  useTopProducts,
  useSalesReport
} from './useDashboard';

// src/components/SalesSummaryCard.tsx
import { SalesSummary } from '../types/models';

// src/components/TopProductsTable.tsx
import { TopProduct } from '../types/models';

// src/components/SalesReportChart.tsx
import { SalesReportEntry } from '../types/models';

// src/types/models.ts
// (exports all interfaces listed in §2)
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```typescript
// src/hooks/useDashboard.ts

useSalesSummary(startDate: string, endDate: string) → {
  salesSummary: SalesSummary | undefined,
  loading: boolean,
  error: Error | null,
  refetch: () => void
}

useTopProducts(startDate: string, endDate: string, limit?: number) → {
  topProducts: TopProduct[] | undefined,
  loading: boolean,
  error: Error | null,
  refetch: () => void
}

useSalesReport(startDate: string, endDate: string) → {
  salesReport: SalesReportEntry[] | undefined,
  loading: boolean,
  error: Error | null,
  refetch: () => void
}
```

### Reusable Component Props/Inputs

```typescript
// src/components/SalesSummaryCard.tsx
SalesSummaryCard props: {
  summary: SalesSummary,
  loading: boolean
}

// src/components/TopProductsTable.tsx
TopProductsTable props: {
  products: TopProduct[],
  loading: boolean
}

// src/components/SalesReportChart.tsx
SalesReportChart props: {
  report: SalesReportEntry[],
  loading: boolean
}

// src/components/DateRangePicker.tsx
DateRangePicker props: {
  startDate: string,
  endDate: string,
  onChange: (start: string, end: string) => void
}
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---

**All field names, types, and API contracts above are canonical and must be used verbatim in all generated code and documentation.**