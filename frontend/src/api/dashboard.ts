import api from './axios'

export interface ProductStat {
  product_id: number
  product_name: string
  units_sold: number
  revenue: number
}

export interface SalesReportRequest {
  start_date: string
  end_date: string
}

export interface SalesReportResponse {
  total_sales: number
  total_revenue: number
  top_products: ProductStat[]
}

function isValidISODate(dateStr: string): boolean {
  const date = new Date(dateStr)
  return !isNaN(date.getTime()) && dateStr === date.toISOString().split('T')[0]
}

export async function generateSalesReport(
  data: SalesReportRequest
): Promise<SalesReportResponse> {
  if (!data.start_date) {
    throw new Error('start_date is required')
  }
  if (!data.end_date) {
    throw new Error('end_date is required')
  }
  if (!isValidISODate(data.start_date)) {
    throw new Error('start_date must be a valid ISO date string')
  }
  if (!isValidISODate(data.end_date)) {
    throw new Error('end_date must be a valid ISO date string')
  }

  try {
    const response = await api.post('/api/dashboard/sales-report', {
      start_date: data.start_date,
      end_date: data.end_date,
    })
    return response.data as SalesReportResponse
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.detail || 'Request failed'
      throw { status_code: status, message }
    }
    if (error.request) {
      throw new Error('Network Error')
    }
    throw error
  }
}