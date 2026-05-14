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

class ProductSales(BaseModel):
    product_id: int
    product_name: str
    units_sold: int
    revenue: float

class TopProductsResponse(BaseModel):
    products: List[ProductSales]

class SalesReportRequest(BaseModel):
    start_date: date
    end_date: date

class SalesReportResponse(BaseModel):
    summary: SalesSummary
    top_products: List[ProductSales]
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

export interface ProductSales {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
}

export interface TopProductsResponse {
  products: ProductSales[];
}

export interface SalesReportRequest {
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
}

export interface SalesReportResponse {
  summary: SalesSummary;
  top_products: ProductSales[];
}
```

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

## 4. FILE STRUCTURE

### PORT TABLE

| Service         | Listening Port | Path                     |
|-----------------|---------------|--------------------------|
| dashboard-api   | 23010         | backend/dashboard-api/   |

### FILE TREE

```
.
├── backend/
│   ├── shared/
│   │   ├── __init__.py                # Shared Python modules (models, utils)
│   │   └── models.py                  # Pydantic data models for API contracts
│   └── dashboard-api/
│       ├── main.py                    # FastAPI app entry point
│       ├── api.py                     # API route definitions
│       ├── crud.py                    # Database access and business logic
│       ├── database.py                # SQLAlchemy engine/session setup
│       ├── models.py                  # SQLAlchemy ORM models
│       ├── Dockerfile                 # Docker build for dashboard-api service
│       ├── requirements.txt           # Python dependencies
│       └── __init__.py                # Package marker
├── frontend/
│   ├── public/
│   │   └── index.html                 # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx          # Main dashboard component
│   │   │   ├── SalesSummaryCard.tsx   # Card for sales summary
│   │   │   ├── TopProductsTable.tsx   # Table for top products
│   │   │   └── SalesReportDialog.tsx  # Dialog for generating reports
│   │   ├── hooks/
│   │   │   └── useDashboard.ts        # React hook for dashboard state
│   │   ├── types/
│   │   │   └── models.ts              # TypeScript interfaces (data contracts)
│   │   ├── api/
│   │   │   └── dashboard.ts           # API client functions
│   │   ├── App.tsx                    # App root component
│   │   ├── main.tsx                   # React entry point
│   │   └── theme.ts                   # MUI theme configuration
│   ├── Dockerfile                     # Docker build for frontend
│   ├── package.json                   # NPM dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   └── vite.config.ts                 # Vite configuration
├── docker-compose.yml                 # Multi-service orchestration
├── .env.example                       # Environment variables template
├── run.sh                             # Startup script for local development
├── .gitignore                         # Git ignore rules
└── README.md                          # Project documentation
```

## 5. ENVIRONMENT VARIABLES

| Name                        | Type    | Description                                         | Example Value                |
|-----------------------------|---------|-----------------------------------------------------|------------------------------|
| POSTGRES_HOST               | string  | Hostname for PostgreSQL database                    | db                           |
| POSTGRES_PORT               | int     | PostgreSQL port (container-internal)                | 5432                         |
| POSTGRES_USER               | string  | PostgreSQL username                                 | dashboard_user               |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                                 | dashboard_pass               |
| POSTGRES_DB                 | string  | PostgreSQL database name                            | dashboard_db                 |
| DASHBOARD_API_PORT          | int     | Port dashboard-api listens on (container/host)      | 23010                        |
| FRONTEND_PORT               | int     | Port frontend listens on (container/host)           | 3000                         |
| BACKEND_CORS_ORIGINS        | string  | Comma-separated list of allowed CORS origins        | http://localhost:3000        |
| SECRET_KEY                  | string  | Secret key for session or JWT signing               | supersecretkey               |
| REPORTS_EXPORT_PATH         | string  | Directory for generated report files                | /tmp/reports                 |

## 6. IMPORT CONTRACTS

### Backend

- `from shared.models import SalesSummary, ProductSales, TopProductsResponse, SalesReportRequest, SalesReportResponse`
- `from .database import get_db, SessionLocal, Base`
- `from .crud import get_sales_summary, get_top_products, generate_sales_report`
- `from fastapi import APIRouter, Depends, FastAPI`
- `from sqlalchemy.orm import Session`

### Frontend

- `import { SalesSummary, ProductSales, TopProductsResponse, SalesReportRequest, SalesReportResponse } from '../types/models'`
- `import { useDashboard } from '../hooks/useDashboard'`
- `import { getSalesSummary, getTopProducts, generateSalesReport } from '../api/dashboard'`
- `import Dashboard from '../components/Dashboard'`
- `import SalesSummaryCard from '../components/SalesSummaryCard'`
- `import TopProductsTable from '../components/TopProductsTable'`
- `import SalesReportDialog from '../components/SalesReportDialog'`

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```
React hook: useDashboard() → {
  salesSummary: SalesSummary | null,
  topProducts: ProductSales[],
  loadingSummary: boolean,
  loadingTopProducts: boolean,
  errorSummary: string | null,
  errorTopProducts: string | null,
  fetchSalesSummary: (start_date: string, end_date: string) => Promise<void>,
  fetchTopProducts: (start_date: string, end_date: string, limit?: number) => Promise<void>,
  generateSalesReport: (req: SalesReportRequest) => Promise<SalesReportResponse>,
  reportLoading: boolean,
  reportError: string | null,
  lastReport: SalesReportResponse | null
}
```

### Reusable Components

```
Dashboard props: {}
SalesSummaryCard props: { summary: SalesSummary | null, loading: boolean, error: string | null }
TopProductsTable props: { products: ProductSales[], loading: boolean, error: string | null }
SalesReportDialog props: {
  open: boolean,
  onClose: () => void,
  onGenerate: (req: SalesReportRequest) => void,
  loading: boolean,
  error: string | null,
  lastReport: SalesReportResponse | null
}
```

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html`)

---

**All field names, types, and import paths above are canonical and must be used verbatim in all generated code and documentation.**