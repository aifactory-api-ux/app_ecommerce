import axios from 'axios'
import { SalesReportRequest, SalesReportResponse } from '../types/models'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500'

function isValidISODate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false
  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date.getTime())
}

export async function generateSalesReport(request: SalesReportRequest): Promise<SalesReportResponse> {
  if (!request.start_date) {
    throw new Error('start_date is required')
  }
  if (!request.end_date) {
    throw new Error('end_date is required')
  }
  if (!isValidISODate(request.start_date)) {
    throw new Error('start_date must be a valid ISO date string')
  }
  if (!isValidISODate(request.end_date)) {
    throw new Error('end_date must be a valid ISO date string')
  }

  try {
    const response = await axios.post<SalesReportResponse>(
      `${API_URL}/api/dashboard/sales-report`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      throw new Error('Network error')
    }
    throw error
  }
}