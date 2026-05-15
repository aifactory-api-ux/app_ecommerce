export interface SalesSummary {
  total_sales: number
  total_revenue: number
  period_start: string
  period_end: string
}

export interface ProductStat {
  product_id: number
  product_name: string
  units_sold: number
  revenue: number
}

export interface TopProductsResponse {
  products: ProductStat[]
}

export interface SalesReportRequest {
  start_date: string
  end_date: string
}

export interface SalesReportResponse {
  summary: SalesSummary
  top_products: ProductStat[]
}