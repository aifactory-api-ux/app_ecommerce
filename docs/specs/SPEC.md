# SPEC.md

## 1. TECHNOLOGY STACK

### Backend
- **Language:** Python 3.11
- **Framework:** FastAPI 0.104.1
- **ORM:** SQLAlchemy 2.0.23
- **Database:** PostgreSQL 15
- **Migration Tool:** Alembic 1.13.0
- **Authentication:** JWT (python-jose 3.3.0)
- **Password Hashing:** bcrypt (passlib 1.7.4)
- **Validation:** Pydantic v2 (pydantic 2.5.0)
- **CORS:** fastapi-cors
- **ASGI Server:** Uvicorn 0.24.0

### Frontend
- **Framework:** React 18.2.0
- **Language:** TypeScript 5.3.2
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router DOM 6.21.0
- **State Management:** Zustand 4.4.7
- **HTTP Client:** Axios 1.6.2
- **UI Components:** Custom components with Tailwind CSS 3.4.0
- **Charts:** Recharts 2.10.3
- **Date Handling:** date-fns 3.0.6
- **Icons:** Lucide React 0.303.0

### Infrastructure
- **Containerization:** Docker 24.0.7, Docker Compose 2.23.0
- **Container Registry:** N/A (local development)

---

## 2. DATA CONTRACTS

### Python Backend (Pydantic Models)

```python
# backend/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="admin")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

```python
# backend/schemas/auth.py
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int | None = None

class LoginRequest(BaseModel):
    email: str
    password: str
```

```python
# backend/schemas/dashboard.py
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional
from decimal import Decimal

class SalesSummary(BaseModel):
    total_sales: Decimal = Field(..., description="Total de ventas en el período")
    total_orders: int = Field(..., description="Número total de órdenes")
    total_products_sold: int = Field(..., description="Cantidad total de productos vendidos")
    average_order_value: Decimal = Field(..., description="Valor promedio por orden")
    sales_change_percent: float = Field(..., description="Cambio porcentual vs período anterior")

class SalesByDate(BaseModel):
    date: date
    total_sales: Decimal
    order_count: int

class ProductSalesItem(BaseModel):
    product_id: int
    product_name: str
    total_quantity: int
    total_revenue: Decimal
    category: str

class TopProduct(BaseModel):
    product_id: int
    product_name: str
    total_quantity: int
    total_revenue: Decimal
    category: str
    sales_count: int

class CategorySales(BaseModel):
    category: str
    total_revenue: Decimal
    total_quantity: int
    percentage: float

class OrderStatusCount(BaseModel):
    status: str
    count: int

class DashboardResponse(BaseModel):
    summary: SalesSummary
    sales_by_date: List[SalesByDate]
    top_products: List[TopProduct]
    sales_by_category: List[CategorySales]
    orders_by_status: List[OrderStatusCount]
    period_start: date
    period_end: date
```

```python
# backend/schemas/report.py
from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional
from enum import Enum

class ReportType(str, Enum):
    SALES_SUMMARY = "sales_summary"
    PRODUCT_PERFORMANCE = "product_performance"
    CATEGORY_ANALYSIS = "category_analysis"
    DAILY_SALES = "daily_sales"

class ReportRequest(BaseModel):
    report_type: ReportType
    start_date: date
    end_date: date
    format: str = Field(default="json", pattern="^(json|csv)$")

class ReportResponse(BaseModel):
    report_id: str
    report_type: ReportType
    generated_at: datetime
    data: dict
```

### TypeScript Frontend (Interfaces)

```typescript
// frontend/src/types/user.ts
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
```

```typescript
// frontend/src/types/dashboard.ts
export interface SalesSummary {
  total_sales: number;
  total_orders: number;
  total_products_sold: number;
  average_order_value: number;
  sales_change_percent: number;
}

export interface SalesByDate {
  date: string;
  total_sales: number;
  order_count: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
  category: string;
  sales_count: number;
}

export interface CategorySales {
  category: string;
  total_revenue: number;
  total_quantity: number;
  percentage: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface DashboardResponse {
  summary: SalesSummary;
  sales_by_date: SalesByDate[];
  top_products: TopProduct[];
  sales_by_category: CategorySales[];
  orders_by_status: OrderStatusCount[];
  period_start: string;
  period_end: string;
}

export interface ReportRequest {
  report_type: 'sales_summary' | 'product_performance' | 'category_analysis' | 'daily_sales';
  start_date: string;
  end_date: string;
  format: 'json' | 'csv';
}

export interface ReportResponse {
  report_id: string;
  report_type: string;
  generated_at: string;
  data: Record<string, unknown>;
}
```

---

## 3. API ENDPOINTS

### Authentication Endpoints

| Method | Path | Request Body | Response | Description |
|--------|------|--------------|----------|-------------|
| POST | `/api/v1/auth/login` | `LoginRequest` | `Token` | User login, returns JWT token |
| POST | `/api/v1/auth/refresh` | `{ refresh_token: string }` | `Token` | Refresh access token |
| GET | `/api/v1/auth/me` | - | `UserResponse` | Get current user info |

### Dashboard Endpoints

| Method | Path | Query Parameters | Response | Description |
|--------|------|-------------------|----------|-------------|
| GET | `/api/v1/dashboard/summary` | `start_date`, `end_date` | `DashboardResponse` | Get complete dashboard data |
| GET | `/api/v1/dashboard/sales-by-date` | `start_date`, `end_date` | `SalesByDate[]` | Get daily sales breakdown |
| GET | `/api/v1/dashboard/top-products` | `start_date`, `end_date`, `limit` | `TopProduct[]` | Get best selling products |
| GET | `/api/v1/dashboard/categories` | `start_date`, `end_date` | `CategorySales[]` | Get sales by category |
| GET | `/api/v1/dashboard/summary-stats` | `start_date`, `end_date` | `SalesSummary` | Get summary statistics only |

### Report Endpoints

| Method | Path | Request Body | Response | Description |
|--------|------|--------------|----------|-------------|
| POST | `/api/v1/reports/generate` | `ReportRequest` | `ReportResponse` | Generate a new report |
| GET | `/api/v1/reports/{report_id}` | - | `ReportResponse` | Get existing report by ID |
| GET | `/api/v1/reports` | `start_date`, `end_date`, `report_type` | `ReportResponse[]` | List reports |

### Health Check

| Method | Path | Response | Description |
|--------|------|----------|-------------|
| GET | `/health` | `{ status: "healthy", timestamp: string }` | Service health check |

---

## 4. FILE STRUCTURE

```
sales-dashboard/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── 001_initial_schema.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   ├── order_item.py
│   │   │   └── report.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   └── report.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   └── reports.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── dashboard_service.py
│   │   │   └── report_service.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── security.py
│   │       └── date_helpers.py
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_dashboard.py
│       └── test_reports.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/
│       │   ├── user.ts
│       │   ├── dashboard.ts
│       │   └── report.ts
│       ├── api/
│       │   ├── client.ts
│       │   ├── authApi.ts
│       │   ├── dashboardApi.ts
│       │   └── reportApi.ts
│       ├── stores/
│       │   ├── authStore.ts
│       │   └── dashboardStore.ts
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useDashboard.ts
│       │   └── useReports.ts
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── Layout.tsx
│       │   ├── Dashboard/
│       │   │   ├── SummaryCards.tsx
│       │   │   ├── SalesChart.tsx
│       │   │   ├── TopProductsTable.tsx
│       │   │   ├── CategoryPieChart.tsx
│       │   │   └── OrdersStatusChart.tsx
│       │   ├── Reports/
│       │   │   ├── ReportGenerator.tsx
│       │   │   └── ReportList.tsx
│       │   ├── Common/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── DatePicker.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   └── Modal.tsx
│       │   └── Auth/
│       │       └── LoginForm.tsx
│       └── pages/
│           ├── LoginPage.tsx
│           ├── DashboardPage.tsx
│           └── ReportsPage.tsx
└── init-scripts/
    └── init-db.sql
```

### PORT TABLE

| Service | Listening Port | Path |
|---|---|---|
| backend | 23001 | backend/ |
| frontend | 23002 | frontend/ |
| PostgreSQL | 25432 (host), 5432 (container) | Infrastructure |

### SHARED MODULES

| Shared path | Imported by services |
|---|---|
| N/A | Single service architecture |

---

## 5. ENVIRONMENT VARIABLES

### Backend (.env.example)

```env
# Application Settings
APP_NAME=Sales Dashboard API
APP_VERSION=1.0.0
APP_DEBUG=false
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=sales_dashboard
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/sales_dashboard

# CORS Configuration
CORS_ORIGINS=["http://localhost:23002","http://localhost:5173"]

# Report Configuration
REPORT_STORAGE_PATH=/app/reports
MAX_REPORT_DAYS=365
```

### Frontend (.env.example)

```env
VITE_API_BASE_URL=http://localhost:23001/api/v1
VITE_APP_NAME=Sales Dashboard
```

---

## 6. IMPORT CONTRACTS

### Backend Exports

```python
# backend/app/__init__.py
# No exports - package marker

# backend/app/config.py
from app.config import get_settings, Settings
# Usage: settings = get_settings()

# backend/app/database.py
from app.database import engine, SessionLocal, Base, get_db
# Usage: db = next(get_db())

# backend/app/dependencies.py
from app.dependencies import get_current_user, get_current_admin
# Usage: current_user: User = get_current_user()

# backend/app/schemas/user.py
from app.schemas.user import UserBase, UserCreate, UserResponse

# backend/app/schemas/auth.py
from app.schemas.auth import Token, TokenData, LoginRequest

# backend/app/schemas/dashboard.py
from app.schemas.dashboard import (
    SalesSummary, SalesByDate, TopProduct, CategorySales,
    OrderStatusCount, DashboardResponse
)

# backend/app/schemas/report.py
from app.schemas.report import ReportType, ReportRequest, ReportResponse

# backend/app/routers/auth.py
from app.routers.auth import router as auth_router
# Register: app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])

# backend/app/routers/dashboard.py
from app.routers.dashboard import router as dashboard_router
# Register: app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["dashboard"])

# backend/app/routers/reports.py
from app.routers.reports import router as reports_router
# Register: app.include_router(reports_router, prefix="/api/v1/reports", tags=["reports"])

# backend/app/services/auth_service.py
from app.services.auth_service import AuthService
# Usage: auth_service = AuthService(db)

# backend/app/services/dashboard_service.py
from app.services.dashboard_service import DashboardService
# Usage: dashboard_service = DashboardService(db)

# backend/app/services/report_service.py
from app.services.report_service import ReportService
# Usage: report_service = ReportService(db)

# backend/app/utils/security.py
from app.utils.security import verify_password, get_password_hash, create_access_token
# Usage: hashed = get_password_hash(plain_password)
# Usage: is_valid = verify_password(plain_password, hashed)
# Usage: token = create_access_token({"sub": str(user_id)})
```

### Frontend Exports

```typescript
// frontend/src/types/user.ts
export type { User, LoginRequest, AuthResponse } from './user';

// frontend/src/types/dashboard.ts
export type {
  SalesSummary,
  SalesByDate,
  TopProduct,
  CategorySales,
  OrderStatusCount,
  DashboardResponse,
  ReportRequest,
  ReportResponse,
} from './dashboard';

// frontend/src/api/client.ts
export { apiClient, setAuthToken, clearAuthToken } from './client';

// frontend/src/api/authApi.ts
export { login, getCurrentUser, refreshToken } from './authApi';

// frontend/src/api/dashboardApi.ts
export {
  getDashboardSummary,
  getSalesByDate,
  getTopProducts,
  getCategorySales,
  getSummaryStats,
} from './dashboardApi';

// frontend/src/api/reportApi.ts
export { generateReport, getReport, listReports } from './reportApi';

// frontend/src/stores/authStore.ts
export const useAuthStore = create<AuthStoreState>()(
  persist(authStoreSlice, { name: 'auth-storage' })
);
// Exposes: { user, token, isAuthenticated, login, logout, setUser }

// frontend/src/stores/dashboardStore.ts
export const useDashboardStore = create<DashboardStoreState>()(
  persist(dashboardStoreSlice, { name: 'dashboard-storage' })
);
// Exposes: { data, loading, error, period, fetchDashboard, fetchSalesByDate, fetchTopProducts }

// frontend/src/hooks/useAuth.ts
export const useAuth = () => ({
//   user, token, isAuthenticated, isLoading, login, logout, checkAuth
// });
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Zustand Stores

```typescript
// authStore.ts - Store Contract
interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

// dashboardStore.ts - Store Contract
interface DashboardStoreState {
  data: DashboardResponse | null;
  salesByDate: SalesByDate[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
  period: { startDate: string; endDate: string };
  fetchDashboard: (startDate: string, endDate: string) => Promise<void>;
  fetchSalesByDate: (startDate: string, endDate: string) => Promise<void>;
  fetchTopProducts: (startDate: string, endDate: string, limit?: number) => Promise<void>;
  setPeriod: (startDate: string, endDate: string) => void;
  clearData: () => void;
}
```

### React Hooks

```typescript
// useAuth.ts - Hook Contract
function useAuth(): {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// useDashboard.ts - Hook Contract
function useDashboard(): {
  data: DashboardResponse | null;
  salesByDate: SalesByDate[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
  fetchDashboard: (startDate: string, endDate: string) => Promise<void>;
  fetchSalesByDate: (startDate: string, endDate: string) => Promise<void>;
  fetchTopProducts: (startDate: string, endDate: string, limit?: number) => Promise<void>;
}

// useReports.ts - Hook Contract
function useReports(): {
  reports: ReportResponse[];
  loading: boolean;
  error: string | null;
  generating: boolean;
  generateReport: (request: ReportRequest) => Promise<ReportResponse | null>;
  fetchReports: (filters?: ReportFilters) => Promise<void>;
  fetchReportById: (reportId: string) => Promise<ReportResponse | null>;
}
```

### Component Props Contracts

```typescript
// Layout Components
Sidebar props/inputs: { isOpen: boolean; onToggle: () => void }
Header props/inputs: { title: string; onMenuClick: () => void }
Layout props/inputs: { children: React.ReactNode }

// Dashboard Components
SummaryCards props/inputs: { summary: SalesSummary; loading: boolean }
SalesChart props/inputs: { data: SalesByDate[]; loading: boolean }
TopProductsTable props/inputs: { products: TopProduct[]; loading: boolean }
CategoryPieChart props/inputs: { data: CategorySales[]; loading: boolean }
OrdersStatusChart props/inputs: { data: OrderStatusCount[]; loading: boolean }

// Report Components
ReportGenerator props/inputs: {
  onGenerate: (request: ReportRequest) => Promise<void>;
  generating: boolean;
}
ReportList props/inputs: {
  reports: ReportResponse[];
  onView: (reportId: string) => void;
  onDownload: (reportId: string, format: string) => void;
}

// Common Components
Button props/inputs: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
Card props/inputs: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}
Input props/inputs: {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}
Select props/inputs: {
  label?: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
DatePicker props/inputs: {
  label?: string;
  name: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}
LoadingSpinner props/inputs: { size?: 'sm' | 'md' | 'lg'; className?: string }
Modal props/inputs: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// Auth Components
LoginForm props/inputs: {
  onSubmit: (data: LoginRequest) => Promise<void>;
  loading: boolean;
}
```

### Page Components

```typescript
// LoginPage.tsx
// No props - manages own auth state via useAuth hook

// DashboardPage.tsx
// No props - uses dashboard store internally
// Uses: useDashboard(), fetches data on mount and date range change

// ReportsPage.tsx
// No props - uses useReports hook internally
// Uses: useReports(), ReportGenerator, ReportList components
```

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files:** `.tsx` for React components with JSX, `.ts` for pure TypeScript files
- **Project language:** TypeScript (strict mode enabled)
- **Backend files:** `.py` for Python source code
- **Configuration files:** `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `alembic.ini`, `requirements.txt`
- **Entry point:** `/src/main.tsx` (referenced in `index.html` as `<script type="module" src="/src/main.tsx"></script>`)
- **CSS entry:** `/src/index.css` (imported in `main.tsx`)

---

## 9. ADDITIONAL SPECIFICATIONS

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    format VARCHAR(10) DEFAULT 'json',
    file_path VARCHAR(500),
    data JSONB,
    generated_by INTEGER REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
```

### Authentication Flow

1. User submits credentials to `POST /api/v1/auth/login`
2. Backend validates credentials against database
3. On success, returns JWT token with 60-minute expiration
4. Frontend stores token in Zustand store (persisted to localStorage)
5. All subsequent requests include `Authorization: Bearer <token>` header
6. Token validation happens in `get_current_user` dependency
7. Protected routes return 401 if token is missing/invalid

### Error Response Format

```typescript
interface ErrorResponse {
  detail: string;
  status_code: number;
  timestamp: string;
}
```

All API errors follow this format with appropriate HTTP status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error