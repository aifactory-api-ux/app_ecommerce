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

#### 🟢 PROD — run_tests.sh — backend/api
**Objetivo:** Crea el archivo `backend/api/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `backend/api/run_tests.sh` (create/modify)

#### 🟢 PROD — run_tests.sh — backend/services
**Objetivo:** Crea el archivo `backend/services/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `backend/services/run_tests.sh` (create/modify)

#### 🟢 PROD — run_tests.sh — frontend
**Objetivo:** Crea el archivo `frontend/run_tests.sh` con el siguiente contenido EXACTO (no lo modifiques ni resumas):
**Archivos:**
- `frontend/run_tests.sh` (create/modify)

#### 🔴 TEST — Tests: backend/api/dashboard.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/api/tests/test_dashboard.py` (create/modify)
**Casos de prueba:**
- `test_get_top_products_happy_path_returns_top_products`: GET /api/dashboard/top-products with valid start_date, end_date, and limit returns 200 OK and TopProductsResponse with correct fields and product ordering by units_sold descending.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 3}}`
  - Expected: `{'status_code': 200, 'json_schema': {'products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}, 'products_length': 3, 'products_sorted_by': 'units_sold_desc'}`
- `test_get_top_products_missing_start_date_returns_422`: GET /api/dashboard/top-products without start_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'end_date': '2024-01-31', 'limit': 5}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_missing_end_date_returns_422`: GET /api/dashboard/top-products without end_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'limit': 5}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_invalid_date_format_returns_422`: GET /api/dashboard/top-products with invalid date format for start_date or end_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024/01/01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_limit_not_integer_returns_422`: GET /api/dashboard/top-products with non-integer limit returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 'five'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_limit_less_than_one_returns_422`: GET /api/dashboard/top-products with limit less than 1 returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 0}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_default_limit_is_5`: GET /api/dashboard/top-products without limit returns 5 products by default if available.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 200, 'products_length': 5}`
- `test_get_top_products_no_products_in_range_returns_empty_list`: GET /api/dashboard/top-products for a date range with no sales returns 200 OK and an empty products list.
  - Input: `{'query_params': {'start_date': '1999-01-01', 'end_date': '1999-01-31', 'limit': 5}}`
  - Expected: `{'status_code': 200, 'products_length': 0}`
- `test_get_top_products_limit_greater_than_available_products_returns_all_products`: GET /api/dashboard/top-products with limit greater than number of products sold in range returns all available products.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 10}}`
  - Expected: `{'status_code': 200, 'products_length_lte': 10}`
- `test_get_top_products_start_date_after_end_date_returns_422`: GET /api/dashboard/top-products with start_date after end_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-02-01', 'end_date': '2024-01-01', 'limit': 5}}`
  - Expected: `{'status_code': 422}`

#### 🔴 TEST — Tests: backend/services/dashboard_service.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/services/tests/test_dashboard_service.py` (create/modify)
**Casos de prueba:**
- `test_get_top_products_returns_correct_products_and_order`: get_top_products returns a list of TopProduct objects ordered by units_sold descending, limited by the limit parameter.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 3}`
  - Expected: `{'products_length': 3, 'products_sorted_by': 'units_sold_desc', 'fields': ['product_id', 'product_name', 'units_sold', 'revenue']}`
- `test_get_top_products_no_sales_returns_empty_list`: get_top_products returns an empty list when there are no sales in the given date range.
  - Input: `{'start_date': '1999-01-01', 'end_date': '1999-01-31', 'limit': 5}`
  - Expected: `{'products_length': 0}`
- `test_get_top_products_limit_greater_than_available_returns_all_products`: get_top_products returns all available products if limit is greater than the number of products sold in the range.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 10}`
  - Expected: `{'products_length': 4}`
- `test_get_top_products_limit_is_none_defaults_to_5`: get_top_products with limit=None returns up to 5 products by default.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': None}`
  - Expected: `{'products_length': 5}`
- `test_get_top_products_start_date_after_end_date_raises_value_error`: get_top_products raises ValueError if start_date is after end_date.
  - Input: `{'start_date': '2024-02-01', 'end_date': '2024-01-01', 'limit': 5}`
  - Expected: `{'raises': 'ValueError'}`

#### 🟢 PROD — Implementar endpoint GET /api/dashboard/top-products en backend
**Objetivo:** Agregar el endpoint /api/dashboard/top-products (GET) en el backend, que recibe start_date, end_date y limit como query params y retorna los productos más vendidos en ese rango, usando el contrato TopProductsResponse.
**Archivos:**
- `backend/api/dashboard.py` (create/modify)
- `backend/services/dashboard_service.py` (create/modify)

### Wave 2

#### 🔴 TEST — Tests: frontend/src/api/dashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/api/dashboard.test.ts` (create/modify)
**Casos de prueba:**
- `fetchTopProducts returns products on valid date range`: Calling fetchTopProducts with valid start_date and end_date returns a TopProductsResponse with products array and status 200.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30', 'limit': 5}`
  - Expected: `{'status_code': 200, 'body': {'products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 100, 'revenue': 5000.0}]}}`
- `fetchTopProducts omits limit and defaults to 5`: Calling fetchTopProducts without the limit parameter defaults to 5 products in the response.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'status_code': 200, 'body': {'products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 100, 'revenue': 5000.0}]}}`
- `fetchTopProducts returns empty products array when no sales`: Calling fetchTopProducts for a date range with no sales returns a TopProductsResponse with an empty products array.
  - Input: `{'start_date': '2023-01-01', 'end_date': '2023-01-02'}`
  - Expected: `{'status_code': 200, 'body': {'products': []}}`
- `fetchTopProducts throws error on missing start_date`: Calling fetchTopProducts without start_date throws a validation error.
  - Input: `{'end_date': '2024-06-30'}`
  - Expected: `{'error': 'start_date is required'}`
- `fetchTopProducts throws error on missing end_date`: Calling fetchTopProducts without end_date throws a validation error.
  - Input: `{'start_date': '2024-06-01'}`
  - Expected: `{'error': 'end_date is required'}`
- `fetchTopProducts throws error on invalid date format`: Calling fetchTopProducts with non-ISO date strings throws a validation error.
  - Input: `{'start_date': '06-01-2024', 'end_date': '06-30-2024'}`
  - Expected: `{'error': 'start_date and end_date must be ISO date strings'}`
- `fetchTopProducts throws error on negative limit`: Calling fetchTopProducts with a negative limit throws a validation error.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30', 'limit': -1}`
  - Expected: `{'error': 'limit must be a positive integer'}`
- `fetchTopProducts propagates network error`: If the API request fails due to network error, fetchTopProducts throws an error with the network error message.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'error': 'Network Error'}`
- `fetchTopProducts propagates API error response`: If the API returns a non-200 status code, fetchTopProducts throws an error with the API error message.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'error': 'API Error'}`

#### 🔴 TEST — Tests: frontend/src/hooks/useDashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/hooks/useDashboard.test.ts` (create/modify)
**Casos de prueba:**
- `useDashboard exposes fetchTopProducts and related state`: The useDashboard hook exposes fetchTopProducts, topProducts, loadingTopProducts, and errorTopProducts fields.
  - Expected: `{'fields': ['fetchTopProducts', 'topProducts', 'loadingTopProducts', 'errorTopProducts']}`
- `fetchTopProducts sets loadingTopProducts true during fetch`: When fetchTopProducts is called, loadingTopProducts is set to true until the request completes.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'loadingTopProducts': [True, False]}`
- `fetchTopProducts updates topProducts on success`: After a successful fetchTopProducts call, topProducts is updated with the products from the API response.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'topProducts': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 100, 'revenue': 5000.0}], 'errorTopProducts': None}`
- `fetchTopProducts sets errorTopProducts on API error`: If fetchTopProducts fails due to an API error, errorTopProducts is set to the error message and topProducts is not updated.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'errorTopProducts': 'API Error', 'topProducts': []}`
- `fetchTopProducts sets errorTopProducts on validation error`: If fetchTopProducts is called with missing or invalid parameters, errorTopProducts is set to the validation error message.
  - Input: `{'start_date': '2024-06-01'}`
  - Expected: `{'errorTopProducts': 'end_date is required'}`
- `fetchTopProducts sets topProducts to empty array on empty response`: If the API returns an empty products array, topProducts is set to an empty array and errorTopProducts is null.
  - Input: `{'start_date': '2023-01-01', 'end_date': '2023-01-02'}`
  - Expected: `{'topProducts': [], 'errorTopProducts': None}`
- `fetchTopProducts resets errorTopProducts on new successful fetch`: If errorTopProducts was previously set, a new successful fetchTopProducts call resets errorTopProducts to null.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'errorTopProducts': None}`
- `fetchTopProducts does not update topProducts or errorTopProducts if called with identical parameters while loading`: If fetchTopProducts is called with the same parameters while loadingTopProducts is true, it does not trigger a new request or update state.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'topProducts': 'unchanged', 'errorTopProducts': 'unchanged'}`

#### 🟢 PROD — Implementar función fetchTopProducts y estado en frontend
**Objetivo:** Agregar la función fetchTopProducts en el cliente API y exponerla en el hook useDashboard, actualizando el estado topProducts, loadingTopProducts y errorTopProducts según el contrato.
**Archivos:**
- `frontend/src/api/dashboard.ts` (create/modify)
- `frontend/src/hooks/useDashboard.ts` (create/modify)

### Wave 3

#### 🔴 TEST — Tests: frontend/src/components/TopProductsTable.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/components/TopProductsTable.test.tsx` (create/modify)
**Casos de prueba:**
- `renders table with product rows matching data`: TopProductsTable renders a row for each product in the products prop.
  - Input: `{'products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 10, 'revenue': 100.0}, {'product_id': 2, 'product_name': 'Product B', 'units_sold': 5, 'revenue': 50.0}]}`
  - Expected: `{'table_rows': 2, 'cells': ['Product A', '10', '100.0', 'Product B', '5', '50.0']}`
- `renders empty state when products array is empty`: TopProductsTable displays an empty state message when products prop is an empty array.
  - Input: `{'products': []}`
  - Expected: `{'empty_state': True}`
- `renders loading indicator when loading is true`: TopProductsTable displays a loading indicator when loading prop is true.
  - Input: `{'products': [], 'loading': True}`
  - Expected: `{'loading_indicator': True}`
- `renders error message when error is true`: TopProductsTable displays an error message when error prop is true.
  - Input: `{'products': [], 'error': True}`
  - Expected: `{'error_message': True}`
- `renders correct column headers`: TopProductsTable renders the correct column headers: Product, Units Sold, Revenue.
  - Input: `{'products': []}`
  - Expected: `{'headers': ['Product', 'Units Sold', 'Revenue']}`

#### 🟢 PROD — Mostrar tabla de productos más vendidos en DashboardPage
**Objetivo:** Renderizar el componente TopProductsTable en DashboardPage, pasando los props requeridos desde el hook useDashboard y permitiendo seleccionar el rango de fechas y límite.
**Archivos:**
- `frontend/src/pages/DashboardPage.tsx` (create/modify)
- `frontend/src/components/TopProductsTable.tsx` (create/modify)

### Wave 4

#### 🔴 TEST — Tests de la feature y regresión de módulos afectados
**Objetivo:** Agregar tests unitarios y de integración para el endpoint /api/dashboard/top-products en backend y pruebas de integración/renderizado para la tabla de productos más vendidos en frontend.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/api/dashboard.py`
- `backend/api/run_tests.sh`
- `backend/api/tests/test_dashboard.py`
- `backend/services/dashboard_service.py`
- `backend/services/run_tests.sh`
- `backend/services/tests/test_dashboard_service.py`
- `frontend/run_tests.sh`
- `frontend/src/api/dashboard.ts`
- `frontend/src/components/TopProductsTable.tsx`
- `frontend/src/hooks/useDashboard.ts`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/tests/api/dashboard.test.ts`
- `frontend/tests/components/TopProductsTable.test.tsx`
- `frontend/tests/hooks/useDashboard.test.ts`

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
    coverage/
    database.py
    dependencies.py
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