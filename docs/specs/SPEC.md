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
  - React Query 5.0.0
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
// frontend/src/types/models.ts

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
- **Query Parameters:**
  - `start_date` (string, required, ISO date)
  - `end_date` (string, required, ISO date)
- **Request Body:** None
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

| Service              | Listening Port | Path                        |
|----------------------|---------------|-----------------------------|
| dashboard-backend    | 23010         | backend/                    |

### FILE TREE

```
.
├── backend/
│   ├── Dockerfile                # Docker build for backend API
│   ├── main.py                   # FastAPI entrypoint
│   ├── api/
│   │   ├── __init__.py           # API package init
│   │   └── dashboard.py          # Dashboard endpoints
│   ├── db/
│   │   ├── __init__.py           # DB package init
│   │   ├── models.py             # SQLAlchemy models
│   │   └── session.py            # DB session management
│   ├── shared/
│   │   ├── __init__.py           # Shared package init
│   │   └── models.py             # Pydantic data contracts
│   ├── services/
│   │   ├── __init__.py           # Services package init
│   │   └── dashboard_service.py  # Business logic for dashboard
│   ├── alembic/
│   │   ├── env.py                # Alembic environment
│   │   ├── script.py.mako        # Alembic script template
│   │   └── versions/             # Migration scripts
│   ├── alembic.ini               # Alembic config
│   ├── requirements.txt          # Python dependencies
│   └── start.sh                  # Backend startup script
├── frontend/
│   ├── Dockerfile                # Docker build for frontend
│   ├── vite.config.ts            # Vite config
│   ├── index.html                # HTML entrypoint
│   ├── src/
│   │   ├── main.tsx              # React entrypoint
│   │   ├── App.tsx               # Root component
│   │   ├── api/
│   │   │   └── dashboard.ts      # API client functions
│   │   ├── components/
│   │   │   ├── SalesSummaryCard.tsx      # Sales summary widget
│   │   │   ├── TopProductsTable.tsx      # Top products table
│   │   │   ├── SalesReportChart.tsx      # Sales report chart
│   │   │   └── DateRangePicker.tsx       # Date range picker
│   │   ├── hooks/
│   │   │   └── useDashboard.ts           # Dashboard state hook
│   │   ├── types/
│   │   │   └── models.ts                 # TypeScript interfaces
│   │   └── pages/
│   │       └── DashboardPage.tsx         # Dashboard page
│   ├── public/
│   │   └── favicon.ico                   # Favicon
│   ├── .env.example                      # Frontend env vars template
│   └── start.sh                          # Frontend startup script
├── docker-compose.yml                    # Multi-service orchestration
├── .env.example                          # Root env vars template
├── .gitignore                            # Git ignore rules
├── README.md                             # Project documentation
```

---

## 5. ENVIRONMENT VARIABLES

### Root `.env.example`

| Name                | Type   | Description                                 | Example Value         |
|---------------------|--------|---------------------------------------------|----------------------|
| POSTGRES_HOST       | string | Hostname for PostgreSQL                     | db                   |
| POSTGRES_PORT       | int    | PostgreSQL port (container-internal)        | 5432                 |
| POSTGRES_DB         | string | Database name                               | dashboard_db         |
| POSTGRES_USER       | string | Database user                               | dashboard_user       |
| POSTGRES_PASSWORD   | string | Database password                           | dashboard_pass       |

### Backend `backend/.env.example`

| Name                | Type   | Description                                 | Example Value         |
|---------------------|--------|---------------------------------------------|----------------------|
| DB_HOST             | string | Hostname for PostgreSQL                     | db                   |
| DB_PORT             | int    | PostgreSQL port (container-internal)        | 5432                 |
| DB_NAME             | string | Database name                               | dashboard_db         |
| DB_USER             | string | Database user                               | dashboard_user       |
| DB_PASSWORD         | string | Database password                           | dashboard_pass       |
| API_PORT            | int    | Backend API listening port                  | 23010                |

### Frontend `frontend/.env.example`

| Name                | Type   | Description                                 | Example Value         |
|---------------------|--------|---------------------------------------------|----------------------|
| VITE_API_URL        | string | Base URL for backend API                    | http://localhost:23010/api |

---

## 6. IMPORT CONTRACTS

### Backend

```python
# backend/shared/models.py
from shared.models import (
    SalesSummary,
    TopProduct,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportEntry,
    SalesReportResponse
)

# backend/services/dashboard_service.py
from shared.models import SalesSummary, TopProductsResponse, SalesReportResponse
from db.session import get_db
from db.models import Sale, Product

# backend/api/dashboard.py
from fastapi import APIRouter, Depends, Query
from shared.models import (
    SalesSummary,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportResponse
)
from services.dashboard_service import (
    get_sales_summary,
    get_top_products,
    generate_sales_report
)
```

### Frontend

```typescript
// frontend/src/types/models.ts
export type {
  SalesSummary,
  TopProduct,
  TopProductsResponse,
  SalesReportRequest,
  SalesReportEntry,
  SalesReportResponse
};

// frontend/src/api/dashboard.ts
import {
  SalesSummary,
  TopProductsResponse,
  SalesReportRequest,
  SalesReportResponse
} from '../types/models';

// frontend/src/hooks/useDashboard.ts
import {
  SalesSummary,
  TopProductsResponse,
  SalesReportRequest,
  SalesReportResponse
} from '../types/models';
import {
  fetchSalesSummary,
  fetchTopProducts,
  fetchSalesReport
} from '../api/dashboard';

// frontend/src/components/SalesSummaryCard.tsx
import { SalesSummary } from '../types/models';

// frontend/src/components/TopProductsTable.tsx
import { TopProduct } from '../types/models';

// frontend/src/components/SalesReportChart.tsx
import { SalesReportEntry } from '../types/models';
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State (React Hook)

```typescript
// useDashboard() → {
  salesSummary: SalesSummary | null,
  topProducts: TopProduct[],
  salesReport: SalesReportEntry[],
  loadingSummary: boolean,
  loadingTopProducts: boolean,
  loadingReport: boolean,
  errorSummary: string | null,
  errorTopProducts: string | null,
  errorReport: string | null,
  fetchSalesSummary: (startDate: string, endDate: string) => Promise<void>,
  fetchTopProducts: (startDate: string, endDate: string, limit?: number) => Promise<void>,
  fetchSalesReport: (startDate: string, endDate: string) => Promise<void>
}
```

### Reusable Components

```
SalesSummaryCard props/inputs: {
  summary: SalesSummary | null,
  loading: boolean,
  error: string | null
}

TopProductsTable props/inputs: {
  products: TopProduct[],
  loading: boolean,
  error: string | null
}

SalesReportChart props/inputs: {
  report: SalesReportEntry[],
  loading: boolean,
  error: string | null
}

DateRangePicker props/inputs: {
  startDate: string,
  endDate: string,
  onChange: (startDate: string, endDate: string) => void
}
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `index.html`)

---