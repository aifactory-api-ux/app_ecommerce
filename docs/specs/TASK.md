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
- `test_get_top_products_happy_path_returns_top_products`: GET /api/dashboard/top-products with valid start_date, end_date, and default limit returns 200 OK and a TopProductsResponse with up to 5 products sorted by units_sold descending.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}, 'max_products': 5, 'sorted_by': 'units_sold_desc'}`
- `test_get_top_products_with_custom_limit_returns_limited_products`: GET /api/dashboard/top-products with valid start_date, end_date, and limit=3 returns 200 OK and a TopProductsResponse with up to 3 products.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 3}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}, 'max_products': 3}`
- `test_get_top_products_missing_start_date_returns_422`: GET /api/dashboard/top-products without start_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_missing_end_date_returns_422`: GET /api/dashboard/top-products without end_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_invalid_limit_returns_422`: GET /api/dashboard/top-products with non-integer limit returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 'abc'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_start_date_after_end_date_returns_empty_list`: GET /api/dashboard/top-products with start_date after end_date returns 200 OK and an empty products list.
  - Input: `{'query_params': {'start_date': '2024-02-01', 'end_date': '2024-01-01'}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': []}}`
- `test_get_top_products_no_sales_in_range_returns_empty_list`: GET /api/dashboard/top-products for a date range with no sales returns 200 OK and an empty products list.
  - Input: `{'query_params': {'start_date': '1999-01-01', 'end_date': '1999-01-31'}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': []}}`
- `test_get_top_products_limit_greater_than_available_products_returns_all_products`: GET /api/dashboard/top-products with limit greater than number of products sold returns all available products.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 100}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': 'all_available'}}`

#### 🔴 TEST — Tests: backend/dashboard-api/crud.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_crud.py` (create/modify)
**Casos de prueba:**
- `test_get_top_products_returns_products_sorted_by_units_sold`: get_top_products returns a list of TopProduct objects sorted by units_sold descending, limited by the limit parameter.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 5}`
  - Expected: `{'products_sorted_by': 'units_sold_desc', 'max_products': 5}`
- `test_get_top_products_with_no_sales_returns_empty_list`: get_top_products returns an empty list when there are no sales in the given date range.
  - Input: `{'start_date': '1999-01-01', 'end_date': '1999-01-31', 'limit': 5}`
  - Expected: `{'products': []}`
- `test_get_top_products_with_limit_greater_than_products_returns_all_products`: get_top_products returns all available products if limit is greater than the number of products sold in the range.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 100}`
  - Expected: `{'products': 'all_available'}`
- `test_get_top_products_with_zero_limit_returns_empty_list`: get_top_products with limit=0 returns an empty list.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 0}`
  - Expected: `{'products': []}`
- `test_get_top_products_with_start_date_after_end_date_returns_empty_list`: get_top_products with start_date after end_date returns an empty list.
  - Input: `{'start_date': '2024-02-01', 'end_date': '2024-01-01', 'limit': 5}`
  - Expected: `{'products': []}`

#### 🟢 PROD — Implementar endpoint GET `/api/dashboard/top-products` en backend
**Objetivo:** Agregar el endpoint GET `/api/dashboard/top-products` en el backend para devolver los productos más vendidos en un rango de fechas, cumpliendo el contrato de SPEC.md.
**Archivos:**
- `backend/dashboard-api/api.py` (create/modify)
- `backend/dashboard-api/crud.py` (create/modify)

### Wave 2

#### 🔴 TEST — Tests: frontend/src/hooks/useDashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/hooks/useDashboard.test.tsx` (create/modify)
**Casos de prueba:**
- `returns_top_products_data_on_successful_fetch`: useTopProducts returns products data when API responds with 200 and valid TopProductsResponse.
  - Input: `{'params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 3}, 'mock_api_response': {'status': 200, 'body': {'products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 10, 'revenue': 100.0}]}}}`
  - Expected: `{'data': {'products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 10, 'revenue': 100.0}]}, 'isLoading': False, 'isError': False}`
- `returns_error_on_422_response`: useTopProducts sets isError=true when API responds with 422 Unprocessable Entity.
  - Input: `{'params': {'start_date': '', 'end_date': '2024-01-31'}, 'mock_api_response': {'status': 422, 'body': {}}}`
  - Expected: `{'data': None, 'isLoading': False, 'isError': True}`
- `returns_empty_products_list_when_api_returns_empty`: useTopProducts returns an empty products list when API responds with 200 and products: [].
  - Input: `{'params': {'start_date': '2099-01-01', 'end_date': '2099-01-31'}, 'mock_api_response': {'status': 200, 'body': {'products': []}}}`
  - Expected: `{'data': {'products': []}, 'isLoading': False, 'isError': False}`
- `uses_default_limit_when_limit_not_provided`: useTopProducts omits limit param and expects API to return up to 5 products.
  - Input: `{'params': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}, 'mock_api_response': {'status': 200, 'body': {'products': [{'product_id': 1, 'product_name': 'A', 'units_sold': 1, 'revenue': 10.0}, {'product_id': 2, 'product_name': 'B', 'units_sold': 2, 'revenue': 20.0}, {'product_id': 3, 'product_name': 'C', 'units_sold': 3, 'revenue': 30.0}, {'product_id': 4, 'product_name': 'D', 'units_sold': 4, 'revenue': 40.0}, {'product_id': 5, 'product_name': 'E', 'units_sold': 5, 'revenue': 50.0}]}}}`
  - Expected: `{'data': {'products': [{'product_id': 1, 'product_name': 'A', 'units_sold': 1, 'revenue': 10.0}, {'product_id': 2, 'product_name': 'B', 'units_sold': 2, 'revenue': 20.0}, {'product_id': 3, 'product_name': 'C', 'units_sold': 3, 'revenue': 30.0}, {'product_id': 4, 'product_name': 'D', 'units_sold': 4, 'revenue': 40.0}, {'product_id': 5, 'product_name': 'E', 'units_sold': 5, 'revenue': 50.0}]}, 'isLoading': False, 'isError': False}`
- `sets_isLoading_true_while_fetching`: useTopProducts sets isLoading=true while request is in progress.
  - Input: `{'params': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}, 'mock_api_response': {'delay': 500}}`
  - Expected: `{'isLoading': True}`

#### 🟢 PROD — Agregar hook React Query para top products en frontend
**Objetivo:** Implementar en el frontend la lógica React Query para consumir el endpoint `/api/dashboard/top-products` y exponer el estado y métodos en el hook `useDashboard`.
**Archivos:**
- `frontend/src/hooks/useDashboard.ts` (create/modify)

### Wave 3

#### 🔴 TEST — Tests: frontend/src/components/TopProductsTable.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/components/TopProductsTable.test.tsx` (create/modify)
**Casos de prueba:**
- `renders table with top products data`: Should render a table displaying product_id, product_name, units_sold, and revenue for each TopProduct in props.products.
  - Input: `{'products': [{'product_id': 1, 'product_name': 'Widget A', 'units_sold': 100, 'revenue': 2500.5}, {'product_id': 2, 'product_name': 'Widget B', 'units_sold': 50, 'revenue': 1200}]}`
  - Expected: `{'table_rows': 2, 'fields_present': ['product_id', 'product_name', 'units_sold', 'revenue'], 'values_present': [['1', 'Widget A', '100', '2500.5'], ['2', 'Widget B', '50', '1200']]}`
- `renders empty state when products array is empty`: Should display an appropriate empty state message or UI when props.products is an empty array.
  - Input: `{'products': []}`
  - Expected: `{'table_rows': 0, 'empty_state_displayed': True}`
- `renders correctly with missing optional fields`: Should render table rows even if some TopProduct objects have missing or undefined optional fields (simulate partial data).
  - Input: `{'products': [{'product_id': 3, 'product_name': 'Widget C', 'units_sold': 0, 'revenue': 0}, {'product_id': 4, 'product_name': '', 'units_sold': 10, 'revenue': 100}]}`
  - Expected: `{'table_rows': 2, 'fields_present': ['product_id', 'product_name', 'units_sold', 'revenue'], 'values_present': [['3', 'Widget C', '0', '0'], ['4', '', '10', '100']]}`
- `renders loading state when loading prop is true`: Should display a loading indicator or skeleton when loading prop is true.
  - Input: `{'products': [], 'loading': True}`
  - Expected: `{'loading_indicator_displayed': True}`
- `renders error state when error prop is present`: Should display an error message or UI when error prop is provided.
  - Input: `{'products': [], 'error': 'Failed to fetch top products'}`
  - Expected: `{'error_message_displayed': True, 'error_text': 'Failed to fetch top products'}`

#### 🔴 TEST — Tests: frontend/src/App.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/App.test.tsx` (create/modify)
**Casos de prueba:**
- `renders TopProductsTable with data from useDashboard`: Should render TopProductsTable and pass products data from useDashboard hook when API returns TopProductsResponse with products.
  - Input: `{'mock_useDashboard': {'topProducts': [{'product_id': 1, 'product_name': 'Widget A', 'units_sold': 100, 'revenue': 2500.5}], 'topProductsLoading': False, 'topProductsError': None}}`
  - Expected: `{'TopProductsTable_rendered': True, 'table_rows': 1, 'values_present': [['1', 'Widget A', '100', '2500.5']]}`
- `shows loading state in TopProductsTable when topProductsLoading is true`: Should render TopProductsTable with loading indicator when useDashboard returns topProductsLoading as true.
  - Input: `{'mock_useDashboard': {'topProducts': [], 'topProductsLoading': True, 'topProductsError': None}}`
  - Expected: `{'TopProductsTable_rendered': True, 'loading_indicator_displayed': True}`
- `shows error state in TopProductsTable when topProductsError is present`: Should render TopProductsTable with error message when useDashboard returns topProductsError.
  - Input: `{'mock_useDashboard': {'topProducts': [], 'topProductsLoading': False, 'topProductsError': 'Network error'}}`
  - Expected: `{'TopProductsTable_rendered': True, 'error_message_displayed': True, 'error_text': 'Network error'}`
- `renders TopProductsTable with empty state when topProducts is empty`: Should render TopProductsTable with empty state UI when useDashboard returns an empty topProducts array.
  - Input: `{'mock_useDashboard': {'topProducts': [], 'topProductsLoading': False, 'topProductsError': None}}`
  - Expected: `{'TopProductsTable_rendered': True, 'table_rows': 0, 'empty_state_displayed': True}`
- `passes correct limit and date range to useDashboard hook`: Should call useDashboard with correct limit, start_date, and end_date parameters when rendering App.
  - Input: `{'date_range': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}, 'limit': 5}`
  - Expected: `{'useDashboard_called_with': {'limit': 5, 'start_date': '2024-01-01', 'end_date': '2024-01-31'}}`

#### 🟢 PROD — Mostrar tabla de top products en frontend
**Objetivo:** Renderizar la tabla de productos más vendidos usando el componente `TopProductsTable`, alimentado por el hook `useDashboard`.
**Archivos:**
- `frontend/src/components/TopProductsTable.tsx` (create/modify)
- `frontend/src/App.tsx` (create/modify)

### Wave 4

#### 🔴 TEST — Tests de la feature y regresión
**Objetivo:** Agregar pruebas unitarias y de integración para el endpoint `/api/dashboard/top-products` en backend y pruebas de integración/renderizado para el hook y componente en frontend.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/dashboard-api/api.py`
- `backend/dashboard-api/crud.py`
- `backend/dashboard-api/run_tests.sh`
- `backend/dashboard-api/tests/test_api.py`
- `backend/dashboard-api/tests/test_crud.py`
- `frontend/run_tests.sh`
- `frontend/src/App.tsx`
- `frontend/src/components/TopProductsTable.tsx`
- `frontend/src/hooks/useDashboard.ts`
- `frontend/tests/App.test.tsx`
- `frontend/tests/components/TopProductsTable.test.tsx`
- `frontend/tests/hooks/useDashboard.test.tsx`

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