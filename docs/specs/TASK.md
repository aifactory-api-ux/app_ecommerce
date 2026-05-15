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
- `test_sales_report_request_model_accepts_valid_dates`: SalesReportRequest Pydantic model accepts valid start_date and end_date fields.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31'}`
  - Expected: `{'model_valid': True}`
- `test_sales_report_request_model_missing_start_date_raises_validation_error`: SalesReportRequest model missing start_date raises ValidationError.
  - Input: `{'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValidationError'}`
- `test_sales_report_request_model_invalid_date_format_raises_validation_error`: SalesReportRequest model with invalid date format raises ValidationError.
  - Input: `{'start_date': '2024/01/01', 'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValidationError'}`
- `test_sales_report_response_model_accepts_valid_data`: SalesReportResponse model accepts valid total_sales, total_revenue, and top_products fields.
  - Input: `{'total_sales': 10, 'total_revenue': 1234.56, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 5, 'revenue': 500.0}]}`
  - Expected: `{'model_valid': True}`
- `test_sales_report_response_model_empty_top_products_list_valid`: SalesReportResponse model with empty top_products list is valid.
  - Input: `{'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}`
  - Expected: `{'model_valid': True}`

#### 🔴 TEST — Tests: backend/dashboard-api/services/dashboard.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_dashboard.py` (create/modify)
**Casos de prueba:**
- `test_sales_report_request_model_accepts_valid_dates`: SalesReportRequest Pydantic model accepts valid start_date and end_date fields.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31'}`
  - Expected: `{'model_valid': True}`
- `test_sales_report_request_model_missing_start_date_raises_validation_error`: SalesReportRequest model missing start_date raises ValidationError.
  - Input: `{'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValidationError'}`
- `test_sales_report_request_model_invalid_date_format_raises_validation_error`: SalesReportRequest model with invalid date format raises ValidationError.
  - Input: `{'start_date': '2024/01/01', 'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValidationError'}`
- `test_sales_report_response_model_accepts_valid_data`: SalesReportResponse model accepts valid total_sales, total_revenue, and top_products fields.
  - Input: `{'total_sales': 10, 'total_revenue': 1234.56, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 5, 'revenue': 500.0}]}`
  - Expected: `{'model_valid': True}`
- `test_sales_report_response_model_empty_top_products_list_valid`: SalesReportResponse model with empty top_products list is valid.
  - Input: `{'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}`
  - Expected: `{'model_valid': True}`

#### 🔴 TEST — Tests: backend/dashboard-api/schemas/dashboard.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_dashboard.py` (create/modify)
**Casos de prueba:**
- `test_sales_report_request_model_accepts_valid_dates`: SalesReportRequest Pydantic model accepts valid start_date and end_date fields.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31'}`
  - Expected: `{'model_valid': True}`
- `test_sales_report_request_model_missing_start_date_raises_validation_error`: SalesReportRequest model missing start_date raises ValidationError.
  - Input: `{'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValidationError'}`
- `test_sales_report_request_model_invalid_date_format_raises_validation_error`: SalesReportRequest model with invalid date format raises ValidationError.
  - Input: `{'start_date': '2024/01/01', 'end_date': '2024-01-31'}`
  - Expected: `{'exception': 'ValidationError'}`
- `test_sales_report_response_model_accepts_valid_data`: SalesReportResponse model accepts valid total_sales, total_revenue, and top_products fields.
  - Input: `{'total_sales': 10, 'total_revenue': 1234.56, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 5, 'revenue': 500.0}]}`
  - Expected: `{'model_valid': True}`
- `test_sales_report_response_model_empty_top_products_list_valid`: SalesReportResponse model with empty top_products list is valid.
  - Input: `{'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}`
  - Expected: `{'model_valid': True}`

#### 🟢 PROD — Implementar endpoint POST /api/dashboard/sales-report en backend
**Objetivo:** Agregar el endpoint /api/dashboard/sales-report (POST) en el backend, que recibe un objeto SalesReportRequest y retorna un objeto SalesReportResponse según el contrato de SPEC.md. Implementar la lógica en el servicio y exponer el endpoint en el router.
**Archivos:**
- `backend/dashboard-api/api/dashboard.py` (create/modify)
- `backend/dashboard-api/services/dashboard.py` (create/modify)
- `backend/dashboard-api/schemas/dashboard.py` (create/modify)

### Wave 2

#### 🔴 TEST — Tests: frontend/src/api/dashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/api/dashboard.test.ts` (create/modify)
**Casos de prueba:**
- `generateSalesReport sends POST request with correct body and returns parsed SalesReportResponse on 200`: When generateSalesReport is called with valid start_date and end_date, it must send a POST request to /api/dashboard/sales-report with the correct JSON body and return the parsed SalesReportResponse object on a 200 response.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'request': {'method': 'POST', 'url': '/api/dashboard/sales-report', 'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}, 'response': {'status_code': 200, 'body': {'total_sales': 100, 'total_revenue': 12345.67, 'top_products': [{'product_id': 1, 'product_name': 'Widget', 'units_sold': 50, 'revenue': 5000.0}]}}, 'result': {'total_sales': 100, 'total_revenue': 12345.67, 'top_products': [{'product_id': 1, 'product_name': 'Widget', 'units_sold': 50, 'revenue': 5000.0}]}}`
- `generateSalesReport throws validation error if start_date is missing`: If generateSalesReport is called without start_date, it must throw a validation error before making any HTTP request.
  - Input: `{'end_date': '2024-06-30'}`
  - Expected: `{'error': 'start_date is required'}`
- `generateSalesReport throws validation error if end_date is missing`: If generateSalesReport is called without end_date, it must throw a validation error before making any HTTP request.
  - Input: `{'start_date': '2024-06-01'}`
  - Expected: `{'error': 'end_date is required'}`
- `generateSalesReport throws validation error if start_date is not ISO date string`: If generateSalesReport is called with a start_date that is not a valid ISO date string, it must throw a validation error before making any HTTP request.
  - Input: `{'start_date': 'not-a-date', 'end_date': '2024-06-30'}`
  - Expected: `{'error': 'start_date must be a valid ISO date string'}`
- `generateSalesReport throws validation error if end_date is not ISO date string`: If generateSalesReport is called with an end_date that is not a valid ISO date string, it must throw a validation error before making any HTTP request.
  - Input: `{'start_date': '2024-06-01', 'end_date': 'not-a-date'}`
  - Expected: `{'error': 'end_date must be a valid ISO date string'}`
- `generateSalesReport returns empty top_products array if API returns empty list`: If the API responds with an empty top_products array, generateSalesReport must return a SalesReportResponse with top_products as an empty array.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'request': {'method': 'POST', 'url': '/api/dashboard/sales-report', 'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}, 'response': {'status_code': 200, 'body': {'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}}, 'result': {'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}}`
- `generateSalesReport throws error if API returns 400 Bad Request`: If the API responds with a 400 Bad Request, generateSalesReport must throw an error containing the status code and error message.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'request': {'method': 'POST', 'url': '/api/dashboard/sales-report', 'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}, 'response': {'status_code': 400, 'body': {'detail': 'Invalid date range'}}, 'error': {'status_code': 400, 'message': 'Invalid date range'}}`
- `generateSalesReport throws error if API returns 500 Internal Server Error`: If the API responds with a 500 Internal Server Error, generateSalesReport must throw an error containing the status code and error message.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'request': {'method': 'POST', 'url': '/api/dashboard/sales-report', 'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}, 'response': {'status_code': 500, 'body': {'detail': 'Internal Server Error'}}, 'error': {'status_code': 500, 'message': 'Internal Server Error'}}`
- `generateSalesReport throws error if network request fails`: If the network request fails (e.g. network error, timeout), generateSalesReport must throw an error indicating a network failure.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'error': 'Network Error'}`
- `generateSalesReport supports start_date and end_date at the same day (edge case)`: If start_date and end_date are the same valid ISO date string, generateSalesReport must send the request and return the API response as usual.
  - Input: `{'start_date': '2024-06-15', 'end_date': '2024-06-15'}`
  - Expected: `{'request': {'method': 'POST', 'url': '/api/dashboard/sales-report', 'body': {'start_date': '2024-06-15', 'end_date': '2024-06-15'}}, 'response': {'status_code': 200, 'body': {'total_sales': 1, 'total_revenue': 100.0, 'top_products': [{'product_id': 2, 'product_name': 'SingleDayProduct', 'units_sold': 1, 'revenue': 100.0}]}}, 'result': {'total_sales': 1, 'total_revenue': 100.0, 'top_products': [{'product_id': 2, 'product_name': 'SingleDayProduct', 'units_sold': 1, 'revenue': 100.0}]}}`

#### 🟢 PROD — Implementar función generateSalesReport en el cliente frontend
**Objetivo:** Agregar la función generateSalesReport en el archivo de cliente API del frontend para consumir el endpoint /api/dashboard/sales-report según el contrato de SPEC.md.
**Archivos:**
- `frontend/src/api/dashboard.ts` (create/modify)

### Wave 3

#### 🔴 TEST — Tests: frontend/src/hooks/useDashboard.ts
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/hooks/useDashboard.test.tsx` (create/modify)
**Casos de prueba:**
- `calls generateSalesReport and updates salesReport state on success`: When generateSalesReport is called with valid start_date and end_date, it should POST to /api/dashboard/sales-report, set loadingReport to true during the request, and update salesReport with the SalesReportResponse on success.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'api_call': {'method': 'POST', 'url': '/api/dashboard/sales-report', 'body': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}, 'state_changes': [{'loadingReport': True, 'when': 'before response'}, {'salesReport': {'total_sales': 100, 'total_revenue': 5000.0, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 50, 'revenue': 2500.0}]}, 'loadingReport': False, 'errorReport': None, 'when': 'after response'}]}`
- `sets errorReport on API error response`: If the API returns an error (e.g., 500), generateSalesReport should set errorReport with the error message and loadingReport should be false.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'api_call': {'method': 'POST', 'url': '/api/dashboard/sales-report'}, 'state_changes': [{'loadingReport': True, 'when': 'before response'}, {'errorReport': 'Internal Server Error', 'loadingReport': False, 'salesReport': None, 'when': 'after response'}]}`
- `does not call API and sets errorReport if start_date or end_date is missing`: If generateSalesReport is called with missing start_date or end_date, it should not call the API and should set errorReport to a validation message.
  - Input: `{'start_date': '', 'end_date': '2024-06-30'}`
  - Expected: `{'api_call': 'not called', 'state_changes': [{'errorReport': 'start_date and end_date are required', 'loadingReport': False, 'salesReport': None}]}`
- `resets errorReport before new request`: When generateSalesReport is called, errorReport should be reset to null before the API call is made.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'state_changes': [{'errorReport': None, 'when': 'before API call'}]}`
- `handles empty top_products array in response`: If the API returns a SalesReportResponse with an empty top_products array, salesReport.top_products should be an empty array.
  - Input: `{'start_date': '2024-06-01', 'end_date': '2024-06-30'}`
  - Expected: `{'api_call': {'method': 'POST', 'url': '/api/dashboard/sales-report'}, 'state_changes': [{'salesReport': {'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}}]}`

#### 🔴 TEST — Tests: frontend/src/components/ReportGenerator.tsx
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `frontend/tests/components/ReportGenerator.test.tsx` (create/modify)
**Casos de prueba:**
- `calls onGenerate with correct dates when form is submitted`: When the user fills in start_date and end_date and submits the form, the onGenerate prop should be called with the correct SalesReportRequest object.
  - Input: `{'form': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
  - Expected: `{'onGenerate_called_with': {'start_date': '2024-06-01', 'end_date': '2024-06-30'}}`
- `displays loading indicator when loadingReport is true`: If the loadingReport prop is true, the component should display a loading spinner or indicator.
  - Input: `{'props': {'loadingReport': True}}`
  - Expected: `{'ui': 'loading spinner is visible'}`
- `renders sales report data when salesReport prop is provided`: If the salesReport prop is provided, the component should display total_sales, total_revenue, and a list of top_products with product_id, product_name, units_sold, and revenue.
  - Input: `{'props': {'salesReport': {'total_sales': 100, 'total_revenue': 5000.0, 'top_products': [{'product_id': 1, 'product_name': 'Product A', 'units_sold': 50, 'revenue': 2500.0}]}}}`
  - Expected: `{'ui': ['total_sales: 100', 'total_revenue: 5000.0', 'top_products: Product A (50 units, 2500.0 revenue)']}`
- `shows error message when errorReport prop is set`: If the errorReport prop is set, the component should display the error message to the user.
  - Input: `{'props': {'errorReport': 'Internal Server Error'}}`
  - Expected: `{'ui': "error message 'Internal Server Error' is visible"}`
- `disables submit button when loadingReport is true`: When loadingReport is true, the submit button should be disabled to prevent multiple submissions.
  - Input: `{'props': {'loadingReport': True}}`
  - Expected: `{'ui': 'submit button is disabled'}`
- `renders empty state when salesReport.top_products is empty`: If salesReport.top_products is an empty array, the component should display an appropriate empty state message.
  - Input: `{'props': {'salesReport': {'total_sales': 0, 'total_revenue': 0.0, 'top_products': []}}}`
  - Expected: `{'ui': 'empty state message for top_products is visible'}`
- `validates required fields and shows validation error if missing`: If the user submits the form without filling start_date or end_date, the component should show a validation error message and not call onGenerate.
  - Input: `{'form': {'start_date': '', 'end_date': '2024-06-30'}}`
  - Expected: `{'ui': 'validation error message is visible', 'onGenerate_called': False}`

#### 🟢 PROD — Integrar generación de reporte en hook useDashboard y componente ReportGenerator
**Objetivo:** Integrar la función de generación de reporte en el hook useDashboard y conectar el componente ReportGenerator para permitir la generación y visualización del reporte desde el frontend.
**Archivos:**
- `frontend/src/hooks/useDashboard.ts` (create/modify)
- `frontend/src/components/ReportGenerator.tsx` (create/modify)

### Wave 4

#### 🔴 TEST — Tests de la feature y regresión de módulos afectados
**Objetivo:** Agregar pruebas unitarias y de integración para el endpoint /api/dashboard/sales-report en backend y pruebas de integración para la generación de reporte en frontend, asegurando la cobertura de la nueva feature y la no regresión de los módulos afectados.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/dashboard-api/api/dashboard.py`
- `backend/dashboard-api/run_tests.sh`
- `backend/dashboard-api/schemas/dashboard.py`
- `backend/dashboard-api/services/dashboard.py`
- `backend/dashboard-api/tests/test_dashboard.py`
- `frontend/run_tests.sh`
- `frontend/src/api/dashboard.ts`
- `frontend/src/components/ReportGenerator.tsx`
- `frontend/src/hooks/useDashboard.ts`
- `frontend/tests/api/dashboard.test.ts`
- `frontend/tests/components/ReportGenerator.test.tsx`
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
  dashboard-api/
    __init__.py
    api.py
    coverage/
    crud.py
    db.py
    main.py
  requirements-dev.txt
  requirements.txt
  seed.py
  shared/
    __init__.py
    models.py
frontend/
  Dockerfile
  index.html
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
    App.test.tsx
    components/
    hooks/
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