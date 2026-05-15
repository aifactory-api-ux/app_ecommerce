import api from './axios'
import { SalesReportRequest, SalesReportResponse } from '../types/models'

export async function getSalesSummary(
  startDate: string,
  endDate: string
): Promise<{ total_sales: number; total_revenue: number; period_start: string; period_end: string }> {
  const response = await api.get('/api/dashboard/sales-summary', {
    params: { start_date: startDate, end_date: endDate },
  })
  return response.data
}

export async function getTopProducts(
  startDate: string,
  endDate: string,
  limit: number = 5
): Promise<{ products: Array<{ product_id: number; product_name: string; units_sold: number; revenue: number }> }> {
  const response = await api.get('/api/dashboard/top-products', {
    params: { start_date: startDate, end_date: endDate, limit },
  })
  return response.data
}

export async function generateSalesReport(
  request: SalesReportRequest
): Promise<SalesReportResponse> {
  const response = await api.post('/api/dashboard/sales-report', request)
  return response.data
}