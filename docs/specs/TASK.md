# TASK.md

> Lee **SPEC.md** para el contrato técnico (stack, modelos, endpoints, naming).
> Este archivo define QUÉ implementar y en qué archivos para esta HU.
> Actualiza **STATE.md** marcando cada ítem completado (ver §4).

## §1 Objetivo

Summary: Dashboard de estadísticas de ventas
Description: **Historia de usuario:** Como administrador, quiero un panel con estadísticas de ventas, ingresos y productos más vendidos, para monitorear el rendimiento del negocio.

Implementar un dashboard visual con métricas clave y la capacidad de generar reportes básicos.

**Criterios de Aceptación:**
1. El administrador puede ver un resumen de ventas totales, ingresos y número de pedidos en un período.
2. El dashboard muestra los productos digitales más vendidos.
3. Se pueden filtrar las estadísticas por rango de fechas.
4. Se pueden exportar reportes básicos en formato CSV.


**Prioridad:** High
**Story Points:** 5
Type: Story
Priority: Medium
Jira URL: https://ai-factory-team.atlassian.net//browse/FC1BA5972D-11
Subtasks (ejecutar en orden):
- [1] FC1BA5972D-40 | Sub-task | To Do | [Backend - API Estadísticas] API estadísticas ventas (7h)
- [2] FC1BA5972D-42 | Sub-task | To Do | [Frontend - UI Dashboard] UI dashboard admin (6h)
- [3] FC1BA5972D-43 | Sub-task | To Do | [Data/BI - Diseño Reportes] Diseño queries reportes (4h)
- [4] FC1BA5972D-44 | Sub-task | To Do | [QA - Pruebas de Datos] Pruebas precisión datos (3h)

=== KNOWLEDGE BASE CONTEXT ===
Files: dashboard-analytics-spec.md

# Historia de Usuario – Dashboard de Estadísticas y Reportes

## Información General

| Campo | Valor |
|---|---|
| Historia | Como administrador, quiero un panel con estadísticas de ventas, ingresos y productos más vendidos, para monitorear el rendimiento del negocio |
| Prioridad | High |
| Story Points | 5 |
| Módulo | Analytics / Dashboard |
| Tipo | Backend API + Dashboard |
| Endpoint Base | `/api/dashboard` |

---

# Objetivo

Implementar un dashboard administrativo que permita visualizar métricas clave del negocio relacionadas con ventas, ingresos, pedidos y productos digitales más vendidos, incluyendo filtros por rango de fechas y exportación de reportes en formato CSV.

---

# Alcance

La funcionalidad debe permitir:

- Visualizar estadísticas generales del negocio.
- Consultar ventas e ingresos por período.
- Mostrar productos digitales más vendidos.
- Filtrar información por rango de fechas.
- Exportar reportes básicos en formato CSV.
-

---

erales del negocio.
- Consultar ventas e ingresos por período.
- Mostrar productos digitales más vendidos.
- Filtrar información por rango de fechas.
- Exportar reportes básicos en formato CSV.
- Preparar la solución para futuras métricas avanzadas.

---

# Endpoints

## Obtener resumen del dashboard

```http
GET /api/dashboard/summary
```

### Query Params

```http
?startDate=2026-05-01&endDate=2026-05-31
```

---

## Obtener productos más vendidos

```http
GET /api/dashboard/top-products
```

### Query Params

```http
?startDate=2026-05-01&endDate=2026-05-31&limit=10
```

---

## Exportar reporte CSV

```http
GET /api/dashboard/export
```

### Query Params

```http
?startDate=2026-05-01&endDate=2026-05-31&type=sales
```

---

# Response

## Success Response – Dashboard Summary

```json
{
  "totalSales": 150,
  "totalRevenue": 1250000,
  "totalOrders": 98,
  "currency": "COP",
  "period": {
    "startDate":

---

--

# Response

## Success Response – Dashboard Summary

```json
{
  "totalSales": 150,
  "totalRevenue": 1250000,
  "totalOrders": 98,
  "currency": "COP",
  "period": {
    "startDate": "2026-05-01",
    "endDate": "2026-05-31"
  }
}
```

---

## Success Response – Top Products

```json
{
  "products": [
    {
      "productId": "DIGI-001",
      "name": "Curso de Node.js",
      "totalSold": 45,
      "revenue": 450000
    },
    {
      "productId": "DIGI-002",
      "name": "Plantilla SaaS",
      "totalSold": 30,
      "revenue": 300000
    }
  ]
}
```

---

# Criterios de Aceptación

1. El administrador puede visualizar ventas totales, ingresos y número de pedidos.
2. El sistema permite filtrar estadísticas por rango de fechas.
3. El dashboard muestra los productos digitales más vendidos.
4. El sistema permite exportar reportes básicos en formato CSV.
5. El backend responde correctamente ante filtros inválidos.
6. La

---

as.
3. El dashboard muestra los productos digitales más vendidos.
4. El sistema permite exportar reportes básicos en formato CSV.
5. El backend responde correctamente ante filtros inválidos.
6. La implementación cumple estándares de arquitectura y testing.

---

# Reglas de Negocio

## Validaciones Generales

- Solo usuarios administradores pueden acceder al dashboard.
- El rango de fechas es opcional.
- Si no se envían fechas:
  - Se utiliza el mes actual por defecto.
- `startDate` no puede ser mayor que `endDate`.
- No se permiten fechas inválidas.
- Los productos más vendidos deben ordenarse de mayor a menor.
- El export CSV debe respetar los filtros aplicados.

---

# Validaciones Técnicas

## Validación de Query Params

El sistema debe validar:

- Formato correcto de fechas.
- Rangos válidos.
- Tipos de reporte válidos.
- Límites máximos de exportación.

---

# Contrato HTTP

| Escenario | Código |
|---|---|
| Consulta exitosa | `200 OK`

---

ato correcto de fechas.
- Rangos válidos.
- Tipos de reporte válidos.
- Límites máximos de exportación.

---

# Contrato HTTP

| Escenario | Código |
|---|---|
| Consulta exitosa | `200 OK` |
| Parámetros inválidos | `400 Bad Request` |
| Error de validación | `422 Unprocessable Entity` |
| No autorizado | `401 Unauthorized` |
| Error interno | `500 Internal Server Error` |

---

# Arquitectura Esperada

La implementación debe seguir arquitectura por capas:

```text
Controller -> Service -> Repository -> Database
```

---

# Responsabilidades

## Controller

- Recibir requests.
- Validar query params.
- Delegar lógica al service.
- Retornar responses HTTP.

---

## Service

- Calcular métricas.
- Aplicar reglas de negocio.
- Generar reportes CSV.
- Consolidar estadísticas.

---

## Repository

- Consultas agregadas.
- Acceso a base de datos.
- Optimización de queries.

---

# Estructura Recomendada

```bash
src/
├──

---

ortes CSV.
- Consolidar estadísticas.

---

## Repository

- Consultas agregadas.
- Acceso a base de datos.
- Optimización de queries.

---

# Estructura Recomendada

```bash
src/
├── controllers/
├── services/
├── repositories/
├── dto/
├── entities/
├── routes/
├── middlewares/
├── validations/
├── exports/
├── utils/
└── tests/
```

---

# DTOs de Referencia

```ts
export class DashboardFilterDto {
  startDate?: string;
  endDate?: string;
}

export class TopProductsFilterDto {
  startDate?: string;
  endDate?: string;
  limit?: number;
}
```

---

# Estándares de Código

## Naming Convention

| Elemento | Convención |
|---|---|
| Variables | `camelCase` |
| Funciones | `camelCase` |
| Clases | `PascalCase` |
| Interfaces | `PascalCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Archivos | `kebab-case` |

---

# Buenas Prácticas

- Evitar lógica de negocio en controllers.
- Centralizar cálculos estadísticos.
-

---

s | `PascalCase` |
| Constantes | `UPPER_SNAKE_CASE` |
| Archivos | `kebab-case` |

---

# Buenas Prácticas

- Evitar lógica de negocio en controllers.
- Centralizar cálculos estadísticos.
- Reutilizar validaciones.
- Optimizar consultas agregadas.
- No exponer errores internos.
- Aplicar tipado fuerte con TypeScript.
- Mantener separación clara entre capas.

---

# Manejo de Errores

## Ejemplo de Error de Validación

```json
{
  "message": "Invalid date range",
  "errors": [
    {
      "field": "startDate",
      "message": "startDate cannot be greater than endDate"
    }
  ]
}
```

---

# Logging

El sistema debe registrar:

- Consultas al dashboard.
- Generación de reportes CSV.
- Errores de validación.
- Errores internos.
- Exportaciones realizadas.

No deben exponerse datos sensibles en logs.

---

# Seguridad

- Validar autenticación.
- Restringir acceso a administradores.
- Sanitizar query params.
- Evitar inyección

---

ones realizadas.

No deben exponerse datos sensibles en logs.

---

# Seguridad

- Validar autenticación.
- Restringir acceso a administradores.
- Sanitizar query params.
- Evitar inyección SQL.
- Validar límites de exportación.

---

# Testing

## Unit Tests

Validar:

- Cálculo correcto de métricas.
- Filtros por fecha.
- Ordenamiento de productos.
- Exportación CSV.
- Manejo de errores.
- Validación de rangos inválidos.

---

## Integration Tests

Validar:

- Endpoint `/api/dashboard/summary`
- Endpoint `/api/dashboard/top-products`
- Endpoint `/api/dashboard/export`
- Contrato API.
- Respuestas HTTP.
- Generación correcta de CSV.

---

# Cobertura Objetivo

| Tipo | Cobertura |
|---|---|
| Services | ≥ 80% |
| Controllers | ≥ 70% |
| Validaciones críticas | 100% |

---

# Consideraciones Futuras

La implementación debe quedar preparada para:

- Dashboard en tiempo real.
- Gráficas avanzadas.
- Métricas por categoría.
-

---

Validaciones críticas | 100% |

---

# Consideraciones Futuras

La implementación debe quedar preparada para:

- Dashboard en tiempo real.
- Gráficas avanzadas.
- Métricas por categoría.
- Exportación PDF.
- Integración con herramientas BI.
- Caché de métricas.
- Eventos analíticos.

---

# Definición de Terminado (DoD)

- Dashboard implementado.
- Endpoints funcionales.
- Filtros por fecha implementados.
- Exportación CSV funcional.
- Validaciones completas.
- Tests unitarios exitosos.
- Tests de integración exitosos.
- Cobertura mínima cumplida.
- Código revisado.
- Sin errores de lint.
- Manejo de errores implementado.
- Documentación actualizada.

---

# Notas Técnicas Adicionales

- Optimizar consultas agregadas.
- Mantener compatibilidad con futuras métricas.
- Diseñar endpoints reutilizables.
- Preparar escalabilidad para grandes volúmenes de datos.
- Toda lógica analítica debe ser testeable.

---

## §2 Items a Implementar

#### 🟢 PROD — run_tests.sh — backend/app
**Objetivo:** Crea el archivo `backend/app/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `backend/app/run_tests.sh` (create/modify)

#### 🔴 TEST — Tests: backend/app/routers/auth.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/app/tests/test_auth.py` (create/modify)
**Casos de prueba:**
- `test_login_valid_credentials_returns_200_with_tokens`: POST /api/v1/auth/login with valid email and password should return 200 OK with access_token and token_type.
  - Input: `{'email': 'test@example.com', 'password': 'SecurePassword123'}`
  - Expected: `{'status_code': 200, 'fields': ['access_token', 'token_type']}`
- `test_login_missing_password_returns_422`: POST /api/v1/auth/login without password field should return 422 Unprocessable Entity.
  - Input: `{'email': 'test@example.com'}`
  - Expected: `{'status_code': 422, 'detail': 'field required'}`
- `test_login_non_existent_user_returns_401`: POST /api/v1/auth/login with credentials for a non-existent user should return 401 Unauthorized.
  - Input: `{'email': 'nonexistent@example.com', 'password': 'AnyPassword123'}`
  - Expected: `{'status_code': 401, 'detail': 'Incorrect email or password'}`
- `test_login_invalid_password_returns_401`: POST /api/v1/auth/login with correct email but wrong password should return 401 Unauthorized.
  - Input: `{'email': 'test@example.com', 'password': 'WrongPassword'}`
  - Expected: `{'status_code': 401, 'detail': 'Incorrect email or password'}`
- `test_refresh_valid_token_returns_new_access_token`: POST /api/v1/auth/refresh with a valid refresh token should return 200 OK with a new access_token.
  - Input: `{'refresh_token': 'valid_refresh_token_string'}`
  - Expected: `{'status_code': 200, 'fields': ['access_token', 'token_type']}`
- `test_refresh_missing_token_returns_422`: POST /api/v1/auth/refresh without refresh_token field should return 422 Unprocessable Entity.
  - Expected: `{'status_code': 422, 'detail': 'field required'}`
- `test_refresh_invalid_token_returns_401`: POST /api/v1/auth/refresh with an invalid or expired refresh token should return 401 Unauthorized.
  - Input: `{'refresh_token': 'invalid_or_expired_token'}`
  - Expected: `{'status_code': 401, 'detail': 'Could not validate credentials'}`
- `test_get_me_authenticated_user_returns_200_with_user_info`: GET /api/v1/auth/me with a valid access token should return 200 OK with current user's information.
  - Input: `{'headers': {'Authorization': 'Bearer valid_access_token'}}`
  - Expected: `{'status_code': 200, 'fields': ['id', 'email', 'full_name', 'role', 'is_active', 'created_at', 'updated_at']}`
- `test_get_me_unauthenticated_returns_401`: GET /api/v1/auth/me without an access token should return 401 Unauthorized.
  - Expected: `{'status_code': 401, 'detail': 'Not authenticated'}`
- `test_get_me_invalid_token_returns_401`: GET /api/v1/auth/me with an invalid or expired access token should return 401 Unauthorized.
  - Input: `{'headers': {'Authorization': 'Bearer invalid_access_token'}}`
  - Expected: `{'status_code': 401, 'detail': 'Could not validate credentials'}`

#### 🔴 TEST — Tests: backend/app/routers/dashboard.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/app/tests/test_dashboard.py` (create/modify)
**Casos de prueba:**
- `test_get_dashboard_summary_valid_dates_returns_200_with_data`: GET /api/v1/dashboard/summary with valid start_date and end_date for an authenticated user should return 200 OK with complete dashboard summary data.
  - Input: `{'query_params': {'start_date': '2023-01-01', 'end_date': '2023-01-31'}, 'headers': {'Authorization': 'Bearer valid_access_token'}}`
  - Expected: `{'status_code': 200, 'fields': ['summary', 'sales_by_date', 'top_products', 'sales_by_category', 'orders_by_status', 'period_start', 'period_end']}`
- `test_get_dashboard_summary_missing_start_date_returns_422`: GET /api/v1/dashboard/summary without start_date query parameter should return 422 Unprocessable Entity.
  - Input: `{'query_params': {'end_date': '2023-01-31'}, 'headers': {'Authorization': 'Bearer valid_access_token'}}`
  - Expected: `{'status_code': 422, 'detail': 'field required'}`
- `test_get_dashboard_summary_invalid_date_format_returns_422`: GET /api/v1/dashboard/summary with invalid date format for start_date should return 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2023/01/01', 'end_date': '2023-01-31'}, 'headers': {'Authorization': 'Bearer valid_access_token'}}`
  - Expected: `{'status_code': 422, 'detail': 'value is not a valid date'}`
- `test_get_dashboard_summary_start_date_after_end_date_returns_422`: GET /api/v1/dashboard/summary where start_date is after end_date should return 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2023-01-31', 'end_date': '2023-01-01'}, 'headers': {'Authorization': 'Bearer valid_access_token'}}`
  - Expected: `{'status_code': 422, 'detail': 'start_date cannot be after end_date'}`
- `test_get_dashboard_summary_no_data_for_period_returns_200_empty_lists`: GET /api/v1/dashboard/summary for a period with no sales data should return 200 OK with zero values in summary and empty lists for breakdowns.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}, 'headers': {'Authorization': 'Bearer valid_access_token'}}`
  - Expected: `{'status_code': 200, 'json_response': {'summary': {'total_sales': 0.0, 'total_orders': 0, 'total_products_sold': 0, 'average_order_value': 0.0, 'sales_change_percent': 0.0}, 'sales_by_date': [], 'top_products': [], 'sales_by_category': [], 'orders_by_status': [], 'period_start': '2024-01-01', 'period_end': '2024-01-31'}}`
- `test_get_dashboard_summary_unauthenticated_returns_401`: GET /api/v1/dashboard/summary without an access token should return 401 Unauthorized.
  - Input: `{'query_params': {'start_date': '2023-01-01', 'end_date': '2023-01-31'}}`
  - Expected: `{'status_code': 401, 'detail': 'Not authenticated'}`

#### 🟢 PROD — Feature specification required
**Objetivo:** Awaiting input from user to define the specific functionality to implement

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/app/run_tests.sh`
- `backend/app/tests/test_auth.py`
- `backend/app/tests/test_dashboard.py`

**FORBIDDEN:** No toques archivos fuera de esta lista.

---

## §4 STATE.md — Registro de Avance

Crea/actualiza `STATE.md` al completar cada ítem:

```markdown
# STATE.md
## Completados
- [x] ITEM-1: <título> (commit: <hash>)
## Pendientes
- [ ] ITEM-2: <título>
## Fallos
- ITEM-X primer intento: <error breve>
```

---

## §5 Contexto del Repositorio

**Estructura:**
```
backend/
  Dockerfile
  app/
    __init__.py
    api/
    config.py
    database.py
    dependencies.py
    main.py
  cli.py
  dashboard-api/
    __init__.py
    api/
    coverage/
    db/
  requirements-dev.txt
  requirements.txt
  seed.py
  shared/
    __init__.py
    models.py
frontend/
  Dockerfile
  index.html
  node_modules/
    @adobe/
    @alloc/
    @asamuzakjp/
    @babel/
  package-lock.json
  package.json
  postcss.config.js
  run_tests.sh
  src/
    App.tsx
    api/
    components/
    context/
    hooks/
    index.css
  tailwind.config.js
  tests/
    api/
    components/
    hooks/
  tsconfig.json
  tsconfig.node.json
```
**Infra existente:** docker-compose services: nginx, frontend, backend, postgres, redis, postgres_data, redis_data, ecommerce_network

---

## §6 Instrucciones

1. Lee SPEC.md para el contrato técnico global
2. Respeta patrones del repo (naming, imports, estructura existente)
3. Implementa solo los cambios del §2
4. NO modifiques archivos fuera del §3 Scope
5. Actualiza STATE.md al completar cada ítem

**Finalización:** `git add -A && git commit -m 'feat: implement HU'`