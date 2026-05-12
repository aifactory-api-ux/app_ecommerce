# E-Commerce Platform - Especificación Técnica

## 1. Visión General

**Tipo:** Sistema e-commerce para productos digitales (software, licencias, descargas digitales)

**Stack Tecnológico:**
- **Backend:** Python 3.11 + FastAPI
- **Frontend:** React 18 + Vite + TypeScript
- **Base de Datos:** PostgreSQL 15
- **Cache/Sessions:** Redis 7
- **Reverse Proxy:** Nginx (Alpine)
- **Contenedores:** Docker + Docker Compose

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Servicios

```
┌─────────────────────────────────────────────────────────────────┐
│                         NGINX :8080                             │
│                    (Reverse Proxy / Load Balancer)              │
└──────────────┬─────────────────────┬─────────────────────────────┘
               │                     │
               ▼                     ▼
    ┌──────────────────┐    ┌──────────────────┐
    │   FRONTEND :3500 │    │   BACKEND :4500  │
    │   (Vite + React) │    │   (FastAPI)      │
    └──────────────────┘    └────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │  POSTGRES :5500│ │   REDIS :6500 │ │   (Future)   │
           │  (Database)    │ │  (Cache/Sess) │ │   (Queue)   │
           └──────────────┘ └──────────────┘ └──────────────┘
```

### 2.2 Mapa de Puertos

| Servicio  | Puerto | URL                          |
|-----------|--------|------------------------------|
| Nginx     | 8080   | http://localhost:8080        |
| Frontend  | 3500   | http://localhost:3500        |
| Backend   | 4500   | http://localhost:4500        |
| Swagger   | 4500   | http://localhost:4500/docs   |
| PostgreSQL| 5500   | localhost:5500               |
| Redis     | 6500   | localhost:6500               |

---

## 3. Modelos de Datos

### 3.1 User (Usuario)

```
users
├── id              UUID (PK)
├── email           VARCHAR(255) UNIQUE NOT NULL
├── password_hash   VARCHAR(255) NOT NULL
├── full_name       VARCHAR(255)
├── is_active       BOOLEAN DEFAULT TRUE
├── is_verified     BOOLEAN DEFAULT FALSE
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

### 3.2 Product (Producto Digital)

```
products
├── id              UUID (PK)
├── name            VARCHAR(255) NOT NULL
├── slug            VARCHAR(255) UNIQUE NOT NULL
├── description     TEXT
├── price           DECIMAL(10,2) NOT NULL
├── product_type    ENUM('software', 'license', 'download', 'subscription')
├── file_url        VARCHAR(500)  -- URL del archivo o clave de licencia
├── is_active       BOOLEAN DEFAULT TRUE
├── stock           INTEGER DEFAULT -1  -- -1 = infinito (digital)
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
```

### 3.3 Cart (Carrito)

```
cart_items
├── id              UUID (PK)
├── user_id         UUID (FK -> users.id)
├── product_id      UUID (FK -> products.id)
├── quantity        INTEGER DEFAULT 1
├── created_at      TIMESTAMP
└── updated_at      TIMESTAMP
UNIQUE(user_id, product_id)
```

### 3.4 Order (Orden)

```
orders
├── id                  UUID (PK)
├── user_id             UUID (FK -> users.id)
├── status              ENUM('pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded')
├── total_amount        DECIMAL(10,2) NOT NULL
├── payment_method      VARCHAR(50)  -- mock: 'simulated'
├── payment_reference   VARCHAR(255) -- mock: código de transacción simulada
├── created_at          TIMESTAMP
└── updated_at          TIMESTAMP
```

### 3.5 OrderItem (Item de Orden)

```
order_items
├── id              UUID (PK)
├── order_id        UUID (FK -> orders.id)
├── product_id      UUID (FK -> products.id)
├── quantity        INTEGER
├── unit_price      DECIMAL(10,2)
├── license_key     VARCHAR(255)  -- Clave de licencia generada
└── created_at      TIMESTAMP
```

---

## 4. API Endpoints

### 4.1 Autenticación (`/api/auth`)

| Método | Endpoint       | Descripción                  |
|--------|----------------|------------------------------|
| POST   | `/register`    | Registro de nuevo usuario    |
| POST   | `/login`        | Login, devuelve JWT          |
| POST   | `/refresh`      | Refresca access token        |
| POST   | `/logout`       | Invalida sesión Redis        |
| GET    | `/me`           | Usuario actual (protegido)   |

### 4.2 Usuarios (`/api/users`)

| Método | Endpoint       | Descripción                  |
|--------|----------------|------------------------------|
| GET    | `/profile`     | Obtiene perfil del usuario   |
| PUT    | `/profile`     | Actualiza perfil             |
| GET    | `/orders`      | Historial de órdenes         |

### 4.3 Productos (`/api/products`)

| Método | Endpoint       | Descripción                  |
|--------|----------------|------------------------------|
| GET    | `/`            | Lista productos (paginados)  |
| GET    | `/{slug}`      | Detalle de producto          |
| POST   | `/`            | Crear producto (admin)       |
| PUT    | `/{id}`        | Actualizar producto (admin)  |
| DELETE | `/{id}`        | Eliminar producto (admin)    |

### 4.4 Carrito (`/api/cart`)

| Método | Endpoint       | Descripción                  |
|--------|----------------|------------------------------|
| GET    | `/`            | Obtener carrito del usuario  |
| POST   | `/items`       | Agregar item al carrito      |
| PUT    | `/items/{id}`  | Actualizar cantidad         |
| DELETE | `/items/{id}`  | Elimar item del carrito      |
| DELETE | `/`            | Vaciar carrito               |

### 4.5 Órdenes (`/api/orders`)

| Método | Endpoint       | Descripción                  |
|--------|----------------|------------------------------|
| GET    | `/`            | Lista órdenes del usuario    |
| GET    | `/{id}`        | Detalle de orden             |
| POST   | `/checkout`    | Crear orden desde carrito    |
| POST   | `/{id}/cancel` | Cancelar orden               |

---

## 5. Autenticación y Autorización

### 5.1 JWT Strategy

- **Access Token:** 15 minutos de expiración (JWT)
- **Refresh Token:** 7 días de expiración (JWT)
- **Session:** Almacenada en Redis con key `session:{user_id}:{jti}`

### 5.2 Password Security

- Hash con bcrypt (cost factor 12)
- Validación: min 8 caracteres, 1 mayúscula, 1 número

### 5.3 Protected Routes

Requieren header: `Authorization: Bearer <access_token>`

### 5.4 Flujo de Autenticación (Detallado)

```
LOGIN FLOW:
1. POST /api/auth/login {email, password}
2. Validate credentials against DB
3. Generate access_token (15min) + refresh_token (7 days)
4. Store session in Redis: SET session:{user_id}:{jti} "active" EX 604800
5. Return {access_token, refresh_token}

REFRESH FLOW:
1. POST /api/auth/refresh {refresh_token}
2. Decode JWT, verify type="refresh", check expiry
3. Check session exists in Redis: EXISTS session:{user_id}:{jti}
4. DELETE old session key
5. Generate NEW tokens with NEW jti
6. Store new session in Redis
7. Return new {access_token, refresh_token}

LOGOUT FLOW:
1. POST /api/auth/logout (Bearer token)
2. Decode JWT, extract user_id + jti
3. DELETE session:{user_id}:{jti} from Redis
4. Return {message: "Logged out"}
```

---

## 6. Redis Usage

### 6.1 Cache

| Key Pattern              | TTL    | Contenido                    |
|--------------------------|--------|------------------------------|
| `products:list:{page}`   | 5 min  | Lista paginada de productos  |
| `products:detail:{slug}` | 10 min | Detalle de producto          |
| `user:{id}:profile`      | 15 min | Perfil de usuario            |

### 6.2 Sessions

| Key Pattern              | TTL    | Contenido                    |
|--------------------------|--------|------------------------------|
| `session:{user_id}:{jti}`| 7 days | Refresh token metadata       |

---

## 7. Flujo de Checkout (Mock)

```
1. Usuario -> POST /api/orders/checkout
2. Backend:
   a. Validar carrito no vacío
   b. Calcular total
   c. Crear Order (status='pending')
   d. Por cada item:
      - Generar License Key (UUID v4)
      - Crear OrderItem
   e. Simular pago (esperar 1 segundo)
   f. Update Order status='completed'
   g. Limpiar carrito del usuario
   h. Invalidar cache de productos
3. Respuesta: Order + License Keys
```

---

## 8. Frontend Pages

| Ruta              | Componente       | Descripción                    |
|-------------------|------------------|--------------------------------|
| `/`               | Home             | Landing + productos destacados |
| `/login`          | Login            | Formulario de login            |
| `/register`       | Register         | Formulario de registro         |
| `/products`       | Products         | Catálogo completo              |
| `/products/:slug` | ProductDetail    | Detalle de producto            |
| `/cart`           | Cart             | Carrito de compras             |
| `/checkout`       | Checkout         | Resumen + pago simulado        |
| `/orders`         | Orders           | Historial de órdenes           |
| `/orders/:id`     | OrderDetail      | Detalle + licencias            |
| `/profile`        | Profile          | Perfil del usuario             |

---

## 9. Testing Strategy (TDD)

### 9.1 Backend - Pytest

```
tests/
├── conftest.py              # Fixtures compartidos
├── test_auth.py            # Auth service + routes
├── test_products.py        # Product service + routes
├── test_cart.py            # Cart service + routes
├── test_orders.py          # Order service + routes
└── test_license.py          # License generation
```

**Orden de desarrollo TDD:**
1. Schemas (Pydantic) - validación
2. Services - lógica de negocio pura (mocks DB)
3. Routes - endpoints con mocks
4. Integración - PostgreSQL real + Redis real

### 9.2 Frontend - Vitest + Testing Library

```
src/
├── __tests__/
│   ├── components/
│   │   ├── ProductCard.test.tsx
│   │   ├── CartItem.test.tsx
│   │   └── OrderSummary.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   ├── useCart.test.ts
│   │   └── useProducts.test.ts
│   └── pages/
│       ├── Home.test.tsx
│       ├── Login.test.tsx
│       └── Cart.test.tsx
└── e2e/
    └── checkout.spec.ts     # Playwright
```

---

## 10. Variables de Entorno

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5500/ecommerce
DATABASE_URL_SYNC=postgresql://postgres:postgres@postgres:5500/ecommerce

# Redis
REDIS_URL=redis://redis:6500/0

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# App
APP_ENV=development
DEBUG=true
CORS_ORIGINS=["http://localhost:3500"]

# Admin (seed)
ADMIN_EMAIL=admin@ecommerce.local
ADMIN_PASSWORD=Admin123!
```

---

## 11. Docker Services

```yaml
services:
  nginx:       # :8080
  frontend:    # :3500
  backend:     # :4500
  postgres:    # :5500
  redis:       # :6500
```

---

## 12. Features MVP - Checklist

- [x] Registro de usuarios con validación email
- [x] Login con JWT (access + refresh tokens)
- [x] Sesiones invalidate via Redis
- [ ] CRUD Productos (catálogo digital)
- [ ] Carrito persistente por usuario
- [ ] Checkout mock (simulación de pago)
- [ ] Generación de licencias digitales
- [ ] Historial de órdenes
- [ ] Perfil de usuario
- [ ] Cache de productos en Redis
- [ ] Tests unitarios backend (pytest)
- [ ] Tests frontend (vitest)
- [ ] E2E checkout flow (Playwright)

---

## 14. Implementation Verification Checklist

### AUTH MODULE
- [ ] `login`: password verify, `_create_tokens` called, tokens returned
- [ ] `_create_tokens`: generates JWTs, **SAVES session to Redis** with correct TTL (7 days)
- [ ] `refresh_tokens`: decodes JWT, verifies type="refresh", checks Redis session exists, deletes old session, creates new
- [ ] `logout`: decodes JWT, extracts `user_id` + `jti`, **DELETES from Redis**

### CART MODULE
- [ ] `add_item`: checks product exists and is_active
- [ ] `add_item`: if product already in cart, increment quantity
- [ ] `update_item`: validates ownership (user_id match)
- [ ] `remove_item`: validates ownership
- [ ] `clear_cart`: deletes all items for user

### ORDER MODULE
- [ ] `checkout`: validates cart not empty
- [ ] `checkout`: calculates total from product prices
- [ ] `checkout`: generates license per item (format: LIC-{sha256}[:16].upper())
- [ ] `checkout`: simulates payment (1 sec delay)
- [ ] `checkout`: updates order status to 'completed'
- [ ] `checkout`: clears user's cart after successful order
- [ ] `cancel_order`: only allows cancel for pending/paid status

### PRODUCT MODULE
- [ ] Cache invalidation on create/update/delete
- [ ] Pagination works correctly
- [ ] Slug is unique

### REDIS PATTERNS
- [ ] `products:list:{page}` - TTL 5 min
- [ ] `products:detail:{slug}` - TTL 10 min
- [ ] `session:{user_id}:{jti}` - TTL 7 days

---

## 13. Futuras Extensiones (Out of Scope MVP)

- [ ] Login social (Google/GitHub OAuth)
- [ ] Integración real de pagos (Stripe/MercadoPago)
- [ ] Email transaccional (SendGrid)
- [ ] Cola de trabajos (Celery/Redis Queue)
- [ ] Admin dashboard
- [ ] Búsqueda avanzada (Elasticsearch)
- [ ] CDNs para archivos digitales
