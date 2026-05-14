export interface SalesSummary {
  total_sales: number;
  total_revenue: number;
  period_start: string;
  period_end: string;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  units_sold: number;
  revenue: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

export interface SalesReportRequest {
  start_date: string;
  end_date: string;
}

export interface SalesReportEntry {
  date: string;
  sales: number;
  revenue: number;
}

export interface SalesReportResponse {
  entries: SalesReportEntry[];
}