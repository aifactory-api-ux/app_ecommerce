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
    entries: List[SalesReportEntry]
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
  entries: SalesReportEntry[];
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

| Service         | Listening Port | Path                      |
|-----------------|---------------|---------------------------|
| dashboard-api   | 23010         | backend/dashboard-api/    |

### FILE TREE

```
.
├── backend/
│   ├── shared/
│   │   ├── __init__.py                  # Shared Python modules (data models, utils)
│   │   └── models.py                    # Pydantic models for data contracts
│   └── dashboard-api/
│       ├── main.py                      # FastAPI app entry point
│       ├── api.py                       # API route definitions
│       ├── crud.py                      # Database access logic
│       ├── db.py                        # Database session and engine setup
│       ├── Dockerfile                   # Docker build for dashboard-api service
│       ├── requirements.txt             # Python dependencies
│       └── __init__.py                  # Package marker
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SalesSummaryCard.tsx     # Card for sales summary metrics
│   │   │   ├── TopProductsTable.tsx     # Table for top products
│   │   │   ├── SalesReportChart.tsx     # Chart for sales report
│   │   │   └── DateRangePicker.tsx      # Date range selection component
│   │   ├── hooks/
│   │   │   └── useDashboard.ts          # React Query hooks for dashboard data
│   │   ├── types/
│   │   │   └── models.ts                # TypeScript interfaces for data contracts
│   │   ├── App.tsx                      # Main app component
│   │   ├── main.tsx                     # React entry point
│   │   └── index.css                    # Tailwind CSS imports
│   ├── public/
│   │   └── index.html                   # HTML entry point
│   ├── Dockerfile                       # Docker build for frontend
│   ├── package.json                     # NPM dependencies and scripts
│   ├── tsconfig.json                    # TypeScript configuration
│   └── vite.config.ts                   # Vite configuration
├── docker-compose.yml                   # Multi-service orchestration
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore rules
├── README.md                            # Project documentation
├── run.sh                               # Startup script for local development
```

---

## 5. ENVIRONMENT VARIABLES

| Name                       | Type    | Description                                         | Example Value                |
|----------------------------|---------|-----------------------------------------------------|------------------------------|
| POSTGRES_HOST              | string  | Hostname for PostgreSQL database                    | db                           |
| POSTGRES_PORT              | int     | PostgreSQL port (container-internal)                | 5432                         |
| POSTGRES_USER              | string  | PostgreSQL username                                 | dashboard_user               |
| POSTGRES_PASSWORD          | string  | PostgreSQL password                                 | dashboard_pass               |
| POSTGRES_DB                | string  | PostgreSQL database name                            | dashboard_db                 |
| DASHBOARD_API_PORT         | int     | Port dashboard-api listens on (container/host)      | 23010                        |
| FRONTEND_PORT              | int     | Port frontend listens on (container/host)           | 23080                        |
| BACKEND_CORS_ORIGINS       | string  | Comma-separated list of allowed CORS origins        | http://localhost:23080       |
| SECRET_KEY                 | string  | Secret key for FastAPI session/security             | supersecretkey               |
| TZ                         | string  | Timezone for backend containers                     | UTC                          |

---

## 6. IMPORT CONTRACTS

### Backend

```python
# backend/shared/models.py
from backend.shared.models import (
    SalesSummary,
    TopProduct,
    TopProductsResponse,
    SalesReportRequest,
    SalesReportEntry,
    SalesReportResponse,
)

# backend/dashboard-api/api.py
from backend.dashboard-api.api import (
    get_sales_summary,
    get_top_products,
    generate_sales_report,
)
```

### Frontend

```typescript
// src/types/models.ts
import {
  SalesSummary,
  TopProduct,
  TopProductsResponse,
  SalesReportRequest,
  SalesReportEntry,
  SalesReportResponse,
} from './models';

// src/hooks/useDashboard.ts
import { useDashboard } from '../hooks/useDashboard';

// src/components/SalesSummaryCard.tsx
import { SalesSummaryCard } from './SalesSummaryCard';

// src/components/TopProductsTable.tsx
import { TopProductsTable } from './TopProductsTable';

// src/components/SalesReportChart.tsx
import { SalesReportChart } from './SalesReportChart';

// src/components/DateRangePicker.tsx
import { DateRangePicker } from './DateRangePicker';
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

```typescript
// src/hooks/useDashboard.ts

useDashboard() → {
  salesSummary: SalesSummary | null,
  topProducts: TopProduct[] | null,
  salesReport: SalesReportResponse | null,
  loadingSummary: boolean,
  loadingTopProducts: boolean,
  loadingReport: boolean,
  errorSummary: string | null,
  errorTopProducts: string | null,
  errorReport: string | null,
  fetchSalesSummary: (startDate: string, endDate: string) => Promise<void>,
  fetchTopProducts: (startDate: string, endDate: string, limit?: number) => Promise<void>,
  generateSalesReport: (startDate: string, endDate: string) => Promise<void>,
}
```

### Reusable Components

```
SalesSummaryCard  props/inputs: { summary: SalesSummary | null, loading: boolean }
TopProductsTable  props/inputs: { products: TopProduct[] | null, loading: boolean }
SalesReportChart  props/inputs: { report: SalesReportResponse | null, loading: boolean }
DateRangePicker   props/inputs: { startDate: string, endDate: string, onChange: (start: string, end: string) => void }
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` (TypeScript React)
- **Project language:** TypeScript (frontend), Python (backend)
- **Entry point:** `/src/main.tsx` (as referenced in `<script type="module" src="/src/main.tsx"></script>` in `public/index.html`)
- **All React components and hooks use `.tsx` or `.ts` extensions exclusively.**
- **No `.jsx` or plain `.js` files in frontend source.**
- **Backend Python files use `.py` exclusively.**

---