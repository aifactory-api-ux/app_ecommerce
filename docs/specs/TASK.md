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

#### 🔴 TEST — Tests: backend/dashboard-api/api.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_api.py` (create/modify)
**Casos de prueba:**
- `test_get_top_products_happy_path_returns_top_products`: GET /api/dashboard/top-products with valid start_date, end_date, and default limit returns 200 OK and a TopProductsResponse with up to 5 products ordered by units_sold descending.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}, 'max_products': 5, 'ordered_by': 'units_sold_desc'}`
- `test_get_top_products_with_custom_limit_returns_limited_products`: GET /api/dashboard/top-products with valid start_date, end_date, and limit=3 returns 200 OK and a TopProductsResponse with up to 3 products.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 3}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': [{'product_id': 'int', 'product_name': 'str', 'units_sold': 'int', 'revenue': 'float'}]}, 'max_products': 3}`
- `test_get_top_products_missing_start_date_returns_422`: GET /api/dashboard/top-products without start_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_missing_end_date_returns_422`: GET /api/dashboard/top-products without end_date returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_invalid_date_format_returns_422`: GET /api/dashboard/top-products with invalid start_date or end_date format returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-13-01', 'end_date': '2024-01-31'}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_limit_zero_returns_422`: GET /api/dashboard/top-products with limit=0 returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 0}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_limit_negative_returns_422`: GET /api/dashboard/top-products with negative limit returns 422 Unprocessable Entity.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': -5}}`
  - Expected: `{'status_code': 422}`
- `test_get_top_products_start_date_after_end_date_returns_400`: GET /api/dashboard/top-products with start_date after end_date returns 400 Bad Request.
  - Input: `{'query_params': {'start_date': '2024-02-01', 'end_date': '2024-01-01'}}`
  - Expected: `{'status_code': 400}`
- `test_get_top_products_no_products_in_range_returns_empty_list`: GET /api/dashboard/top-products for a date range with no sales returns 200 OK and an empty products list.
  - Input: `{'query_params': {'start_date': '1999-01-01', 'end_date': '1999-01-31'}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': []}}`
- `test_get_top_products_limit_greater_than_available_products_returns_all_products`: GET /api/dashboard/top-products with limit greater than number of available products returns all available products.
  - Input: `{'query_params': {'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 100}}`
  - Expected: `{'status_code': 200, 'body_schema': {'products': 'all_available'}}`

#### 🔴 TEST — Tests: backend/dashboard-api/crud.py
**Objetivo:** TDD — escribe los tests ANTES que el código de producción.
**Archivos:**
- `backend/dashboard-api/tests/test_crud.py` (create/modify)
**Casos de prueba:**
- `test_get_top_products_returns_correct_products_and_order`: get_top_products returns a list of TopProduct objects ordered by units_sold descending, limited by the limit parameter.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 5}`
  - Expected: `{'products_count': 'min(5, total_products)', 'ordered_by': 'units_sold_desc', 'fields': ['product_id', 'product_name', 'units_sold', 'revenue']}`
- `test_get_top_products_with_no_sales_returns_empty_list`: get_top_products returns an empty list when there are no sales in the given date range.
  - Input: `{'start_date': '1999-01-01', 'end_date': '1999-01-31', 'limit': 5}`
  - Expected: `{'products': []}`
- `test_get_top_products_with_limit_greater_than_products_returns_all`: get_top_products returns all available products if limit is greater than the number of products sold in the range.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 100}`
  - Expected: `{'products_count': 3}`
- `test_get_top_products_with_limit_one_returns_top_product`: get_top_products with limit=1 returns only the top-selling product.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 1}`
  - Expected: `{'products_count': 1}`
- `test_get_top_products_invalid_date_range_raises_value_error`: get_top_products raises ValueError if start_date is after end_date.
  - Input: `{'start_date': '2024-02-01', 'end_date': '2024-01-01', 'limit': 5}`
  - Expected: `{'exception': 'ValueError'}`
- `test_get_top_products_limit_zero_raises_value_error`: get_top_products raises ValueError if limit is zero.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': 0}`
  - Expected: `{'exception': 'ValueError'}`
- `test_get_top_products_limit_negative_raises_value_error`: get_top_products raises ValueError if limit is negative.
  - Input: `{'start_date': '2024-01-01', 'end_date': '2024-01-31', 'limit': -10}`
  - Expected: `{'exception': 'ValueError'}`

#### 🟢 PROD — Implementar endpoint GET `/api/dashboard/top-products` en backend
**Objetivo:** Agregar el endpoint GET `/api/dashboard/top-products` en el backend para devolver los productos más vendidos en un rango de fechas, respetando los contratos de datos y API definidos en SPEC.md.
**Archivos:**
- `backend/dashboard-api/api.py` (create/modify)
- `backend/dashboard-api/crud.py` (create/modify)

### Wave 2

#### 🟢 PROD — Consumir y mostrar top productos en frontend
**Objetivo:** Consumir el endpoint `/api/dashboard/top-products` desde el frontend y mostrar los productos más vendidos en el componente `TopProductsTable.tsx`, usando los hooks y contratos definidos.
**Archivos:**
- `frontend/src/api/dashboard.ts` (create/modify)
- `frontend/src/hooks/useDashboard.ts` (create/modify)
- `frontend/src/components/TopProductsTable.tsx` (create/modify)

### Wave 3

#### 🔴 TEST — Tests de la feature y regresión de módulos afectados
**Objetivo:** Agregar tests unitarios y de integración para el endpoint `/api/dashboard/top-products` en backend y pruebas de integración/renderizado para el hook y componente en frontend.

---

## §3 Scope — Archivos Permitidos

Crea o modifica **ÚNICAMENTE** estos archivos:

- `backend/dashboard-api/api.py`
- `backend/dashboard-api/crud.py`
- `backend/dashboard-api/run_tests.sh`
- `backend/dashboard-api/tests/test_api.py`
- `backend/dashboard-api/tests/test_crud.py`
- `frontend/src/api/dashboard.ts`
- `frontend/src/components/TopProductsTable.tsx`
- `frontend/src/hooks/useDashboard.ts`

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
    config.py
    db/
    main.py
    models/
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
    api/
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