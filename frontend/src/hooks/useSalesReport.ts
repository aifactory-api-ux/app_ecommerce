import { useState } from 'react'
import api from '../api/axios'
import { SalesReportRequest, SalesReportResponse } from '../types/sales'

export function useSalesReport() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const generateReport = async (params: SalesReportRequest): Promise<SalesReportResponse> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/api/dashboard/sales-report', params)
      return response.data
    } catch (err: unknown) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { generateReport, isLoading, error }
}