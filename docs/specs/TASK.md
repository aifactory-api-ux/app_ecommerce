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

#### 🔴 TEST — Tests: backend/dashboard-api/api/dashboard.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_dashboard.py` (create/modify)
**Casos de prueba:**
- `test_generate_sales_report_valid_dates_returns_200_and_expected_response`: POST /api/dashboard/sales-report with valid start_date and end_date returns 200 and a SalesReportResponse with correct summary and top_products fields.
  - Input: `{'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 200, 'json_schema': {'summary': {'total_sales': 'int', 'total_revenue': 'float', 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}}`
- `test_generate_sales_report_missing_start_date_returns_422`: POST /api/dashboard/sales-report without start_date field returns 422 Unprocessable Entity.
  - Input: `{'body': {'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 422}`
- `test_generate_sales_report_missing_end_date_returns_422`: POST /api/dashboard/sales-report without end_date field returns 422 Unprocessable Entity.
  - Input: `{'body': {'start_date': '2024-06-01'}}`
  - Expected: `{'status_code': 422}`
- `test_generate_sales_report_invalid_date_format_returns_422`: POST /api/dashboard/sales-report with invalid date format for start_date returns 422 Unprocessable Entity.
  - Input: `{'body': {'start_date': '06-01-2024', 'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 422}`
- `test_generate_sales_report_start_date_after_end_date_returns_400`: POST /api/dashboard/sales-report with start_date after end_date returns 400 Bad Request.
  - Input: `{'body': {'start_date': '2024-07-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 400}`
- `test_generate_sales_report_empty_database_returns_zero_summary_and_empty_top_products`: POST /api/dashboard/sales-report when there are no sales in the database returns summary fields as zero and top_products as an empty list.
  - Input: `{'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'status_code': 200, 'json_schema': {'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': []}}`
- `test_generate_sales_report_large_date_range_returns_valid_response`: POST /api/dashboard/sales-report with a large date range returns 200 and a valid SalesReportResponse.
  - Input: `{'body': {'start_date': '2020-01-01', 'end_date': '2024-12-31'}}`
  - Expected: `{'status_code': 200, 'json_schema': {'summary': {'total_sales': 'int', 'total_revenue': 'float', 'period_start': '2020-01-01', 'period_end': '2024-12-31'}, 'top_products': 'list'}}`
- `test_generate_sales_report_nonexistent_endpoint_returns_404`: POST to a non-existent endpoint /api/dashboard/sales-reportt returns 404 Not Found.
  - Input: `{'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}, 'path': '/api/dashboard/sales-reportt'}`
  - Expected: `{'status_code': 404}`

#### 🔴 TEST — Tests: backend/dashboard-api/services/dashboard_service.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_dashboard_service.py` (create/modify)
**Casos de prueba:**
- `test_fetch_sales_report_returns_correct_summary_and_top_products`: fetch_sales_report returns a SalesReportResponse with correct summary and top_products for valid date range with sales data.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'summary': {'total_sales': 'int', 'total_revenue': 'float', 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}`
- `test_fetch_sales_report_no_sales_returns_zero_summary_and_empty_top_products`: fetch_sales_report returns summary fields as zero and top_products as an empty list when there are no sales in the given date range.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'summary': {'total_sales': 0, 'total_revenue': 0.0, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': []}`
- `test_fetch_sales_report_start_date_after_end_date_raises_value_error`: fetch_sales_report raises ValueError when start_date is after end_date.
  - Input: `{'start_date': '2024-07-01', 'end_date': '2024-06-30'}`
  - Expected: `{'exception': 'ValueError'}`
- `test_fetch_sales_report_returns_top_products_sorted_by_units_sold_desc`: fetch_sales_report returns top_products sorted by units_sold in descending order.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'top_products_sorted_by': 'units_sold_desc'}`
- `test_fetch_sales_report_handles_products_with_zero_sales`: fetch_sales_report does not include products with zero sales in top_products.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'top_products_excludes_zero_sales': True}`

#### 🟢 PROD — Implementar endpoint POST /api/dashboard/sales-report en backend
**Objetivo:** Agregar el endpoint POST /api/dashboard/sales-report en FastAPI, que reciba un cuerpo SalesReportRequest y devuelva un objeto SalesReportResponse según el contrato de SPEC.md. Debe delegar la lógica a un método en dashboard_service.py y usar los modelos Pydantic definidos.
**Archivos:**
- `backend/dashboard-api/api/dashboard.py` (create/modify)
- `backend/dashboard-api/services/dashboard_service.py` (create/modify)

### Wave 2

#### 🔴 TEST — Tests: frontend/src/hooks/useDashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/hooks/useDashboard.test.tsx` (create/modify)
**Casos de prueba:**
- `should fetch sales report successfully and return correct data`: Calling useDashboard hook with valid start_date and end_date should fetch sales report and return summary and top_products as per SalesReportResponse.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'fields': ['summary.total_sales', 'summary.total_revenue', 'summary.period_start', 'summary.period_end', 'top_products']}`
- `should handle API validation error and expose error state`: Calling useDashboard with missing start_date or end_date should result in error state with appropriate error message.
  - Input: `{'start_date': '', 'end_date': '2024-06-30'}`
  - Expected: `{'error': True}`
- `should handle API error when start_date is after end_date`: Calling useDashboard with start_date after end_date should result in error state and not return data.
  - Input: `{'start_date': '2024-07-01', 'end_date': '2024-06-30'}`
  - Expected: `{'error': True}`
- `should return empty top_products and zero summary when API returns empty data`: When API returns empty sales data, useDashboard should return summary fields as zero and top_products as empty array.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'fields': ['summary.total_sales=0', 'summary.total_revenue=0.0', 'top_products=[]']}`
- `should refetch data when start_date or end_date changes`: useDashboard should refetch and update data when start_date or end_date parameters change.
  - Input: `[{'start_date': '2024-06-01', 'end_date': '2024-06-30'}, {'start_date': '2024-07-01', 'end_date': '2024-07-31'}]`
  - Expected: `{'fields': ['summary', 'top_products']}`

#### 🟢 PROD — Implementar cliente API y hook React Query para sales report
**Objetivo:** Agregar la función generateSalesReport en el cliente API frontend y el hook useSalesReport en React Query, ambos siguiendo los contratos de SPEC.md para consumir el endpoint /api/dashboard/sales-report.
**Archivos:**
- `frontend/src/api/dashboard.ts` (create/modify)
- `frontend/src/hooks/useDashboard.ts` (create/modify)

### Wave 3

#### 🔴 TEST — Tests: frontend/src/components/SalesReportForm.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/components/SalesReportForm.test.tsx` (create/modify)
**Casos de prueba:**
- `submits valid date range and triggers useSalesReport with correct parameters`: When the user fills in valid ISO start_date and end_date and submits the form, the onSubmit handler must call useSalesReport with a SalesReportRequest containing the correct start_date and end_date.
  - Input: `{'form': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'useSalesReport_called_with': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
- `shows validation error when start_date is missing`: If the user submits the form without a start_date, the form must display a validation error and must NOT call useSalesReport.
  - Input: `{'form': {'start_date': '', 'end_date': '2024-06-30'}}`
  - Expected: `{'validation_error_displayed': 'start_date is required', 'useSalesReport_not_called': True}`
- `shows validation error when end_date is missing`: If the user submits the form without an end_date, the form must display a validation error and must NOT call useSalesReport.
  - Input: `{'form': {'start_date': '2024-06-01', 'end_date': ''}}`
  - Expected: `{'validation_error_displayed': 'end_date is required', 'useSalesReport_not_called': True}`
- `shows validation error when start_date is after end_date`: If the user submits the form with start_date after end_date, the form must display a validation error and must NOT call useSalesReport.
  - Input: `{'form': {'start_date': '2024-07-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'validation_error_displayed': 'start_date must be before or equal to end_date', 'useSalesReport_not_called': True}`
- `disables submit button while loading`: When the form is submitted and useSalesReport is loading, the submit button must be disabled to prevent duplicate submissions.
  - Input: `{'form': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}, 'useSalesReport_loading': True}`
  - Expected: `{'submit_button_disabled': True}`
- `shows API error message if useSalesReport returns error`: If useSalesReport returns an error (e.g., network or 400/422 error), the form must display an error message to the user.
  - Input: `{'form': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}, 'useSalesReport_error': 'Request failed with status code 400'}`
  - Expected: `{'error_message_displayed': 'Request failed with status code 400'}`

#### 🔴 TEST — Tests: frontend/src/components/ReportTable.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/components/ReportTable.test.tsx` (create/modify)
**Casos de prueba:**
- `renders summary and top_products from SalesReportResponse`: When provided with a valid SalesReportResponse prop, the component must display the summary fields (total_sales, total_revenue, period_start, period_end) and a table listing all top_products with product_id, product_name, units_sold, and revenue.
  - Input: `{'props': {'data': {'summary': {'total_sales': 123, 'total_revenue': 4567.89, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': [{'product_id': 1, 'product_name': 'Producto A', 'units_sold': 100, 'revenue': 2000.0}]}, 'loading': False}}`
  - Expected: `{'fields_displayed': ['total_sales: 123', 'total_revenue: 4567.89', 'period_start: 2024-06-01', 'period_end: 2024-06-30', 'product_id: 1', 'product_name: Producto A', 'units_sold: 100', 'revenue: 2000.00']}`
- `shows loading indicator when loading is true`: When the loading prop is true, the component must display a loading indicator and must not display any data rows.
  - Input: `{'props': {'data': None, 'loading': True}}`
  - Expected: `{'loading_indicator_displayed': True, 'data_rows_displayed': False}`
- `renders empty state when top_products is empty`: If the SalesReportResponse prop has an empty top_products array, the component must display a message indicating no products found.
  - Input: `{'props': {'data': {'summary': {'total_sales': 0, 'total_revenue': 0, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': []}, 'loading': False}}`
  - Expected: `{'empty_state_message_displayed': 'No products found'}`
- `handles null data gracefully`: If the data prop is null or undefined, the component must not throw and must display an appropriate empty or placeholder state.
  - Input: `{'props': {'data': None, 'loading': False}}`
  - Expected: `{'empty_state_message_displayed': 'No report data'}`
- `renders multiple top_products rows correctly`: When top_products contains multiple items, the component must render a row for each product with correct product_id, product_name, units_sold, and revenue.
  - Input: `{'props': {'data': {'summary': {'total_sales': 200, 'total_revenue': 8000.0, 'period_start': '2024-06-01', 'period_end': '2024-06-30'}, 'top_products': [{'product_id': 1, 'product_name': 'Producto A', 'units_sold': 100, 'revenue': 2000.0}, {'product_id': 2, 'product_name': 'Producto B', 'units_sold': 100, 'revenue': 6000.0}]}, 'loading': False}}`
  - Expected: `{'rows_displayed': [{'product_id': 1, 'product_name': 'Producto A', 'units_sold': 100, 'revenue': 2000.0}, {'product_id': 2, 'product_name': 'Producto B', 'units_sold': 100, 'revenue': 6000.0}]}`

#### 🟢 PROD — Integrar formulario y tabla de reporte en frontend
**Objetivo:** Conectar el componente SalesReportForm para enviar parámetros al hook useSalesReport y mostrar los resultados en el componente ReportTable, siguiendo los contratos de props definidos en SPEC.md.
**Archivos:**
- `frontend/src/components/SalesReportForm.tsx` (create/modify)
- `frontend/src/components/ReportTable.tsx` (create/modify)

### Wave 4

#### 🔴 TEST — Tests de la feature y regresión
**Objetivo:** Agregar tests unitarios y de integración para el endpoint /api/dashboard/sales-report en backend y pruebas de integración para el hook y componentes afectados en frontend.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/dashboard-api/api/dashboard.py`
- `backend/dashboard-api/run_tests.sh`
- `backend/dashboard-api/services/dashboard_service.py`
- `backend/dashboard-api/tests/test_dashboard.py`
- `backend/dashboard-api/tests/test_dashboard_service.py`
- `frontend/run_tests.sh`
- `frontend/src/api/dashboard.ts`
- `frontend/src/components/ReportTable.tsx`
- `frontend/src/components/SalesReportForm.tsx`
- `frontend/src/hooks/useDashboard.ts`
- `frontend/tests/components/ReportTable.test.tsx`
- `frontend/tests/components/SalesReportForm.test.tsx`
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