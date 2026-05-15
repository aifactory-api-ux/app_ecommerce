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

### Wave 1

#### 🟢 PROD — run_tests.sh — backend/dashboard-api
**Objetivo:** Crea el archivo `backend/dashboard-api/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `backend/dashboard-api/run_tests.sh` (create/modify)

#### 🟢 PROD — run_tests.sh — frontend
**Objetivo:** Crea el archivo `frontend/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `frontend/run_tests.sh` (create/modify)

#### 🔴 TEST — Tests: backend/dashboard-api/api.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_api.py` (create/modify)
**Casos de prueba:**
- `test_post_sales_report_valid_dates_returns_200_and_expected_schema`: POST /api/dashboard/sales-report with valid start_date and end_date returns 200 OK and a SalesReportResponse with correct summary and top_products fields.
  - Input: `{'json': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 200, 'fields': ['summary', 'top_products'], 'summary_fields': ['total_sales', 'total_revenue', 'period_start', 'period_end'], 'top_products_item_fields': ['product_id', 'product_name', 'units_sold', 'revenue']}`
- `test_post_sales_report_missing_start_date_returns_422`: POST /api/dashboard/sales-report without start_date field returns 422 Unprocessable Entity.
  - Input: `{'json': {'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_missing_end_date_returns_422`: POST /api/dashboard/sales-report without end_date field returns 422 Unprocessable Entity.
  - Input: `{'json': {'start_date': '2024-01-01'}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_invalid_date_format_returns_422`: POST /api/dashboard/sales-report with invalid date format for start_date returns 422 Unprocessable Entity.
  - Input: `{'json': {'start_date': '01-01-2024', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_start_date_after_end_date_returns_400`: POST /api/dashboard/sales-report with start_date after end_date returns 400 Bad Request.
  - Input: `{'json': {'start_date': '2024-02-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 400}`
- `test_post_sales_report_empty_body_returns_422`: POST /api/dashboard/sales-report with empty request body returns 422 Unprocessable Entity.
  - Input: `{'json': {}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_no_data_in_range_returns_empty_top_products_and_zero_summary`: POST /api/dashboard/sales-report for a date range with no sales returns 200 OK, summary fields set to zero, and top_products as an empty list.
  - Input: `{'json': {'start_date': '1999-01-01', 'end_date': '1999-01-31'}}`
  - Expected: `{'status_code': 200, 'summary': {'total_sales': 0, 'total_revenue': 0.0}, 'top_products': []}`
- `test_post_sales_report_large_date_range_returns_valid_response`: POST /api/dashboard/sales-report with a large date range returns 200 OK and a valid SalesReportResponse.
  - Input: `{'json': {'start_date': '2020-01-01', 'end_date': '2024-12-31'}}`
  - Expected: `{'status_code': 200, 'fields': ['summary', 'top_products']}`

#### 🔴 TEST — Tests: backend/dashboard-api/schemas.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_schemas.py` (create/modify)
**Casos de prueba:**
- `test_sales_report_request_validates_required_fields`: SalesReportRequest schema requires both start_date and end_date fields; omitting either raises a validation error.
  - Input: `{'data': {'start_date': '2024-01-01'}}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_sales_report_request_invalid_date_type_raises_validation_error`: SalesReportRequest with non-date string for start_date or end_date raises a validation error.
  - Input: `{'data': {'start_date': 'not-a-date', 'end_date': '2024-01-31'}}`
  - Expected: `{'raises': 'ValidationError'}`
- `test_sales_report_response_serialization_and_fields`: SalesReportResponse serializes correctly and includes summary and top_products fields with correct types.
  - Input: `{'data': {'summary': {'total_sales': 10, 'total_revenue': 1000.0, 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': [{'product_id': 1, 'product_name': 'Widget', 'units_sold': 5, 'revenue': 500.0}]}}`
  - Expected: `{'fields': ['summary', 'top_products'], 'summary_fields': ['total_sales', 'total_revenue', 'period_start', 'period_end'], 'top_products_item_fields': ['product_id', 'product_name', 'units_sold', 'revenue']}`
- `test_sales_report_response_empty_top_products_allowed`: SalesReportResponse allows top_products to be an empty list.
  - Input: `{'data': {'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': []}}`
  - Expected: `{'fields': ['summary', 'top_products']}`

#### 🔴 TEST — Tests: backend/dashboard-api/crud.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_crud.py` (create/modify)
**Casos de prueba:**
- `test_generate_sales_report_returns_correct_summary_and_top_products`: generate_sales_report returns correct SalesSummary and top_products for a valid date range with sales data.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31'}`
  - Expected: `{'summary': {'total_sales': 'matches sum of sales in range', 'total_revenue': 'matches sum of revenue in range', 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': 'list of TopProduct sorted by units_sold or revenue'}`
- `test_generate_sales_report_no_sales_returns_zero_summary_and_empty_top_products`: generate_sales_report for a date range with no sales returns summary with zeros and empty top_products list.
  - Input: `{'start_date': '1999-01-01', 'end_date': '1999-01-31'}`
  - Expected: `{'summary': {'total_sales': 0, 'total_revenue': 0.0}, 'top_products': []}`
- `test_generate_sales_report_start_date_after_end_date_raises_value_error`: generate_sales_report with start_date after end_date raises ValueError.
  - Input: `{'start_date': '2024-02-01', 'end_date': '2024-01-31'}`
  - Expected: `{'raises': 'ValueError'}`
- `test_generate_sales_report_handles_large_dataset_performance`: generate_sales_report completes within reasonable time for a large dataset (performance edge case).
  - Input: `{'start_date': '2020-01-01', 'end_date': '2024-12-31'}`
  - Expected: `{'completes_within_seconds': 2}`

#### 🟢 PROD — Implementar endpoint POST /api/dashboard/sales-report en backend
**Objetivo:** Agregar el endpoint /api/dashboard/sales-report (POST) en el backend, que recibe un cuerpo SalesReportRequest y responde con SalesReportResponse, utilizando los contratos y funciones existentes.
**Archivos:**
- `backend/dashboard-api/api.py` (create/modify)
- `backend/dashboard-api/schemas.py` (create/modify)
- `backend/dashboard-api/crud.py` (create/modify)

### Wave 2

#### 🔴 TEST — Tests: frontend/src/hooks/useSalesReport.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/hooks/useSalesReport.test.tsx` (create/modify)
**Casos de prueba:**
- `should return sales report data on successful request`: useSalesReport hook returns expected SalesReportResponse data when API responds with 200 OK and valid data.
  - Input: `{'request': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}, 'mock_api_response': {'status': 200, 'body': {'summary': {'total_sales': 100, 'total_revenue': 12345.67, 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 50, 'revenue': 5000.0}]}}}`
  - Expected: `{'data': {'summary': {'total_sales': 100, 'total_revenue': 12345.67, 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 50, 'revenue': 5000.0}]}, 'isLoading': False, 'isError': False}`
- `should handle API validation error (422) and set error state`: useSalesReport hook sets isError to true and exposes error details when API responds with 422 Unprocessable Entity.
  - Input: `{'request': {'start_date': '', 'end_date': '2024-01-31'}, 'mock_api_response': {'status': 422, 'body': {'detail': [{'loc': ['body', 'start_date'], 'msg': 'field required', 'type': 'value_error.missing'}]}}}`
  - Expected: `{'data': None, 'isLoading': False, 'isError': True, 'error': {'status': 422, 'detail': [{'loc': ['body', 'start_date'], 'msg': 'field required', 'type': 'value_error.missing'}]}}`
- `should handle API error (400) for start_date after end_date`: useSalesReport hook sets isError to true and exposes error details when API responds with 400 Bad Request due to start_date after end_date.
  - Input: `{'request': {'start_date': '2024-02-01', 'end_date': '2024-01-01'}, 'mock_api_response': {'status': 400, 'body': {'detail': 'start_date must be before or equal to end_date'}}}`
  - Expected: `{'data': None, 'isLoading': False, 'isError': True, 'error': {'status': 400, 'detail': 'start_date must be before or equal to end_date'}}`
- `should return empty sales report when API returns zero sales`: useSalesReport hook returns summary fields set to zero and empty top_products when API responds with 200 OK and no sales data.
  - Input: `{'request': {'start_date': '1999-01-01', 'end_date': '1999-01-31'}, 'mock_api_response': {'status': 200, 'body': {'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '1999-01-01', 'period_end': '1999-01-31'}, 'top_products': []}}}`
  - Expected: `{'data': {'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '1999-01-01', 'period_end': '1999-01-31'}, 'top_products': []}, 'isLoading': False, 'isError': False}`
- `should set isLoading true while fetching and false after completion`: useSalesReport hook sets isLoading to true during request and false after response is received.
  - Input: `{'request': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}, 'mock_api_response': {'status': 200, 'body': {'summary': {'total_sales': 10, 'total_revenue': 1000.0, 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': []}}}`
  - Expected: `{'isLoading_sequence': [True, False]}`

#### 🟢 PROD — Implementar hook useSalesReport en frontend
**Objetivo:** Crear el hook React Query useSalesReport en el frontend, que expone generateReport(params: SalesReportRequest): Promise<SalesReportResponse>, isLoading, y error, usando el endpoint /api/dashboard/sales-report.
**Archivos:**
- `frontend/src/hooks/useSalesReport.ts` (create/modify)

### Wave 3

#### 🔴 TEST — Tests de la nueva feature (backend y frontend)
**Objetivo:** Agregar pruebas unitarias y de integración para el endpoint /api/dashboard/sales-report en backend y para el hook useSalesReport en frontend, cubriendo casos exitosos y de error.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/dashboard-api/api.py`
- `backend/dashboard-api/crud.py`
- `backend/dashboard-api/run_tests.sh`
- `backend/dashboard-api/schemas.py`
- `backend/dashboard-api/tests/test_api.py`
- `backend/dashboard-api/tests/test_crud.py`
- `backend/dashboard-api/tests/test_schemas.py`
- `frontend/run_tests.sh`
- `frontend/src/hooks/useSalesReport.ts`
- `frontend/tests/hooks/useSalesReport.test.tsx`

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
  requirements-dev.txt
  requirements.txt
  seed.py
frontend/
  Dockerfile
  index.html
  package.json
  postcss.config.js
  src/
    App.tsx
    api/
    components/
    context/
    hooks/
    index.css
  tailwind.config.js
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
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