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
- `test_post_sales_report_valid_dates_returns_200_and_sales_report_response`: POST /api/dashboard/sales-report with valid start_date and end_date returns 200 OK and a SalesReportResponse with summary and top_products fields populated according to the contract.
  - Input: `{'json': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 200, 'fields': ['summary', 'top_products'], 'summary_fields': ['total_sales', 'total_revenue', 'period_start', 'period_end'], 'top_products_item_fields': ['product_id', 'product_name', 'units_sold', 'revenue']}`
- `test_post_sales_report_missing_start_date_returns_422`: POST /api/dashboard/sales-report with missing start_date field returns 422 Unprocessable Entity.
  - Input: `{'json': {'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_missing_end_date_returns_422`: POST /api/dashboard/sales-report with missing end_date field returns 422 Unprocessable Entity.
  - Input: `{'json': {'start_date': '2024-01-01'}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_invalid_date_format_returns_422`: POST /api/dashboard/sales-report with invalid date format for start_date or end_date returns 422 Unprocessable Entity.
  - Input: `{'json': {'start_date': '2024/01/01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_post_sales_report_start_date_after_end_date_returns_400`: POST /api/dashboard/sales-report with start_date after end_date returns 400 Bad Request.
  - Input: `{'json': {'start_date': '2024-02-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 400}`
- `test_post_sales_report_no_sales_in_period_returns_zeroed_summary_and_empty_top_products`: POST /api/dashboard/sales-report for a period with no sales returns summary with total_sales=0, total_revenue=0.0, and an empty top_products list.
  - Input: `{'json': {'start_date': '1999-01-01', 'end_date': '1999-01-31'}}`
  - Expected: `{'status_code': 200, 'summary': {'total_sales': 0, 'total_revenue': 0.0}, 'top_products': []}`
- `test_post_sales_report_large_date_range_returns_valid_response`: POST /api/dashboard/sales-report with a large date range returns 200 OK and a valid SalesReportResponse.
  - Input: `{'json': {'start_date': '2020-01-01', 'end_date': '2024-12-31'}}`
  - Expected: `{'status_code': 200, 'fields': ['summary', 'top_products']}`

#### 🔴 TEST — Tests: backend/dashboard-api/crud.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_crud.py` (create/modify)
**Casos de prueba:**
- `test_generate_sales_report_returns_correct_summary_and_top_products`: generate_sales_report returns a SalesReportResponse with correct summary and top_products for a given date range with sales data.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31'}`
  - Expected: `{'summary': {'total_sales': 'matches sum of sales in period', 'total_revenue': 'matches sum of revenue in period', 'period_start': '2024-01-01', 'period_end': '2024-01-31'}, 'top_products': 'list of ProductSales sorted by units_sold or revenue'}`
- `test_generate_sales_report_no_sales_returns_zeroed_summary_and_empty_top_products`: generate_sales_report for a period with no sales returns summary with total_sales=0, total_revenue=0.0, and an empty top_products list.
  - Input: `{'start_date': '1999-01-01', 'end_date': '1999-01-31'}`
  - Expected: `{'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '1999-01-01', 'period_end': '1999-01-31'}, 'top_products': []}`
- `test_generate_sales_report_start_date_after_end_date_raises_value_error`: generate_sales_report with start_date after end_date raises ValueError.
  - Input: `{'start_date': '2024-02-01', 'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValueError'}`
- `test_generate_sales_report_handles_single_day_range`: generate_sales_report with start_date equal to end_date returns correct summary and top_products for that single day.
  - Input: `{'start_date': '2024-01-15', 'end_date': '2024-01-15'}`
  - Expected: `{'summary': {'period_start': '2024-01-15', 'period_end': '2024-01-15'}, 'top_products': 'list of ProductSales for that day'}`
- `test_generate_sales_report_returns_top_products_sorted_by_units_sold`: generate_sales_report returns top_products sorted by units_sold in descending order.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31'}`
  - Expected: `{'top_products': 'sorted by units_sold descending'}`

#### 🟢 PROD — Implementar endpoint POST /api/dashboard/sales-report en backend
**Objetivo:** Agregar el endpoint /api/dashboard/sales-report (POST) en el backend, que reciba un cuerpo SalesReportRequest y devuelva un objeto SalesReportResponse según los contratos definidos.
**Archivos:**
- `backend/dashboard-api/crud.py` (create/modify)
- `backend/dashboard-api/api.py` (create/modify)

### Wave 2

#### 🔴 TEST — Tests: frontend/src/api/dashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/api/dashboard.test.ts` (create/modify)
**Casos de prueba:**
- `generateSalesReport sends POST request with correct body and returns parsed SalesReportResponse on success`: When generateSalesReport is called with valid start_date and end_date, it must send a POST request to /api/dashboard/sales-report with the correct SalesReportRequest body and return a parsed SalesReportResponse object matching the API contract.
  - Input: `{'request': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 200, 'response': {'summary': {'total_sales': 100, 'total_revenue': 12345.67, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': [{'product_id': 1, 'product_name': 'Widget', 'units_sold': 50, 'revenue': 5000.0}]}}`
- `generateSalesReport throws validation error if start_date is missing`: If generateSalesReport is called without start_date, it must throw a validation error before making the API call.
  - Input: `{'request': {'end_date': '2024-06-30'}}`
  - Expected: `{'error': 'start_date is required'}`
- `generateSalesReport throws validation error if end_date is missing`: If generateSalesReport is called without end_date, it must throw a validation error before making the API call.
  - Input: `{'request': {'start_date': '2024-06-01'}}`
  - Expected: `{'error': 'end_date is required'}`
- `generateSalesReport handles empty top_products array in response`: If the API returns a SalesReportResponse with an empty top_products array, generateSalesReport must return the response with top_products as an empty array.
  - Input: `{'request': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 200, 'response': {'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': []}}`
- `generateSalesReport propagates API error response (400/422/500) as exception`: If the API responds with a non-200 status code (e.g., 400, 422, 500), generateSalesReport must throw an exception containing the error message and status code.
  - Input: `{'request': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}, 'api_error': {'status_code': 422, 'message': 'Invalid date range'}}`
  - Expected: `{'error': 'Invalid date range', 'status_code': 422}`
- `generateSalesReport throws error if start_date is not a valid ISO date string`: If generateSalesReport is called with a start_date that is not a valid ISO date string, it must throw a validation error before making the API call.
  - Input: `{'request': {'start_date': 'not-a-date', 'end_date': '2024-06-30'}}`
  - Expected: `{'error': 'start_date must be a valid ISO date string'}`
- `generateSalesReport throws error if end_date is not a valid ISO date string`: If generateSalesReport is called with an end_date that is not a valid ISO date string, it must throw a validation error before making the API call.
  - Input: `{'request': {'start_date': '2024-06-01', 'end_date': 'not-a-date'}}`
  - Expected: `{'error': 'end_date must be a valid ISO date string'}`
- `generateSalesReport handles network error gracefully`: If the network request fails (e.g., network down, timeout), generateSalesReport must throw an error indicating a network failure.
  - Input: `{'request': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}, 'network_error': True}`
  - Expected: `{'error': 'Network error'}`
- `generateSalesReport sends correct Content-Type header`: generateSalesReport must send the POST request with Content-Type: application/json header.
  - Input: `{'request': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'headers': {'Content-Type': 'application/json'}}`

#### 🟢 PROD — Implementar función generateSalesReport en el cliente API frontend
**Objetivo:** Agregar la función generateSalesReport en el archivo de cliente API frontend para consumir el endpoint /api/dashboard/sales-report (POST), usando los contratos TypeScript definidos.
**Archivos:**
- `frontend/src/api/dashboard.ts` (create/modify)

### Wave 3

#### 🔴 TEST — Tests: frontend/src/hooks/useDashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/hooks/useDashboard.test.tsx` (create/modify)
**Casos de prueba:**
- `calls generateSalesReport API and updates lastReport on success`: When generateSalesReport is called with valid start_date and end_date, the hook should call the /api/dashboard/sales-report endpoint, set loading to true during the request, update lastReport with the SalesReportResponse on success, and set loading to false.
  - Input: `{'start_date': '2024-05-01', 'end_date': '2024-05-31'}`
  - Expected: `{'api_called': True, 'api_path': '/api/dashboard/sales-report', 'api_method': 'POST', 'api_body': {'start_date': '2024-05-01', 'end_date': '2024-05-31'}, 'loading_sequence': [True, False], 'lastReport': {'summary': {'total_sales': 100, 'total_revenue': 12345.67, 'period_start': '2024-05-01', 'period_end': '2024-05-31'}, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 50, 'revenue': 5000.0}]}, 'error': None}`
- `sets error state when API returns validation error (missing start_date)`: If generateSalesReport is called with missing start_date, the hook should not call the API and should set error to a validation message.
  - Input: `{'start_date': '', 'end_date': '2024-05-31'}`
  - Expected: `{'api_called': False, 'error': 'start_date is required', 'lastReport': None, 'loading': False}`
- `sets error state when API returns 400 or 422 for invalid date range`: If generateSalesReport is called with end_date before start_date, the hook should not call the API and should set error to an appropriate message.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-05-01'}`
  - Expected: `{'api_called': False, 'error': 'end_date must be after start_date', 'lastReport': None, 'loading': False}`
- `sets error state when API returns network/server error`: If the API call fails due to network/server error, the hook should set error to a generic error message and set loading to false.
  - Input: `{'start_date': '2024-05-01', 'end_date': '2024-05-31'}`
  - Expected: `{'api_called': True, 'api_path': '/api/dashboard/sales-report', 'api_method': 'POST', 'error': 'Failed to generate sales report. Please try again.', 'lastReport': None, 'loading': False}`
- `resets error and lastReport on new generateSalesReport call`: When generateSalesReport is called again after an error or previous report, the hook should reset error and lastReport before making the new request.
  - Input: `{'start_date': '2024-05-01', 'end_date': '2024-05-31'}`
  - Expected: `{'error_reset': True, 'lastReport_reset': True, 'loading_sequence': [True, False]}`
- `does not call API if start_date or end_date is not an ISO date string`: If generateSalesReport is called with invalid date formats, the hook should not call the API and should set error to a validation message.
  - Input: `{'start_date': '05-01-2024', 'end_date': '2024/05/31'}`
  - Expected: `{'api_called': False, 'error': 'Dates must be in ISO format (YYYY-MM-DD)', 'lastReport': None, 'loading': False}`

#### 🔴 TEST — Tests: frontend/src/components/SalesReportDialog.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/components/SalesReportDialog.test.tsx` (create/modify)
**Casos de prueba:**
- `renders dialog with date inputs and generate button`: The SalesReportDialog component should render input fields for start_date and end_date, and a button to generate the report.
  - Expected: `{'elements': ['start_date_input', 'end_date_input', 'generate_button'], 'visible': True}`
- `calls generateSalesReport from hook when generate button is clicked with valid dates`: When the user enters valid start_date and end_date and clicks the generate button, the component should call the generateSalesReport function from useDashboard with the correct arguments.
  - Input: `{'start_date': '2024-05-01', 'end_date': '2024-05-31'}`
  - Expected: `{'generateSalesReport_called': True, 'args': {'start_date': '2024-05-01', 'end_date': '2024-05-31'}}`
- `displays loading indicator while report is being generated`: While the generateSalesReport request is in progress (loading=true), the component should display a loading spinner or progress indicator and disable the generate button.
  - Input: `{'loading': True}`
  - Expected: `{'loading_indicator_visible': True, 'generate_button_disabled': True}`
- `displays error message when error is set in hook`: If the error property from useDashboard is set, the component should display the error message to the user.
  - Input: `{'error': 'Failed to generate sales report. Please try again.'}`
  - Expected: `{'error_message_displayed': 'Failed to generate sales report. Please try again.'}`
- `displays report summary and top products when lastReport is present`: When lastReport is set, the component should display the summary (total_sales, total_revenue, period_start, period_end) and a table or list of top_products.
  - Input: `{'lastReport': {'summary': {'total_sales': 100, 'total_revenue': 12345.67, 'period_start': '2024-05-01', 'period_end': '2024-05-31'}, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 50, 'revenue': 5000.0}]}}`
  - Expected: `{'summary_displayed': True, 'top_products_displayed': True}`
- `shows validation error if user tries to generate report with missing dates`: If the user clicks the generate button without entering start_date or end_date, the component should display a validation error and not call generateSalesReport.
  - Input: `{'start_date': '', 'end_date': ''}`
  - Expected: `{'validation_error_displayed': True, 'generateSalesReport_called': False}`
- `resets form fields and state when dialog is closed`: When the dialog is closed, the component should reset the date input fields, error messages, and lastReport display.
  - Input: `{'dialog_closed': True}`
  - Expected: `{'form_fields_reset': True, 'error_reset': True, 'lastReport_reset': True}`

#### 🟢 PROD — Integrar generación de reporte en hook useDashboard y componente SalesReportDialog
**Objetivo:** Integrar la función generateSalesReport en el hook useDashboard y conectar la lógica al componente SalesReportDialog para permitir la generación de reportes desde la UI.
**Archivos:**
- `frontend/src/hooks/useDashboard.ts` (create/modify)
- `frontend/src/components/SalesReportDialog.tsx` (create/modify)

### Wave 4

#### 🔴 TEST — Tests de la feature y regresión de módulos afectados
**Objetivo:** Agregar pruebas unitarias y de integración para el endpoint /api/dashboard/sales-report en backend y pruebas de integración para la función y UI de generación de reportes en frontend.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/dashboard-api/api.py`
- `backend/dashboard-api/crud.py`
- `backend/dashboard-api/run_tests.sh`
- `backend/dashboard-api/tests/test_api.py`
- `backend/dashboard-api/tests/test_crud.py`
- `frontend/run_tests.sh`
- `frontend/src/api/dashboard.ts`
- `frontend/src/components/SalesReportDialog.tsx`
- `frontend/src/hooks/useDashboard.ts`
- `frontend/tests/api/dashboard.test.ts`
- `frontend/tests/components/SalesReportDialog.test.tsx`
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