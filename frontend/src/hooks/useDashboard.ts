import { useState } from 'react'
import api from '../api/axios'
import { TopProduct, TopProductsResponse } from '../types/models'
import { generateSalesReport as generateSalesReportApi, SalesReportResponse, SalesReportRequest } from '../api/dashboard'

interface UseDashboardParams {
  start_date: string
  end_date: string
  limit?: number
}

export function useDashboard(params: UseDashboardParams) {
  const [topProducts, setTopProducts] = useState<TopProduct[] | null>(null)
  const [topProductsLoading, setTopProductsLoading] = useState(false)
  const [topProductsError, setTopProductsError] = useState<string | null>(null)
  const [salesReport, setSalesReport] = useState<SalesReportResponse | null>(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const [errorReport, setErrorReport] = useState<string | null>(null)

  const fetchTopProducts = async () => {
    setTopProductsLoading(true)
    setTopProductsError(null)
    try {
      const queryParams = new URLSearchParams({
        start_date: params.start_date,
        end_date: params.end_date,
      })
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit))
      }

      const response = await api.get(`/api/dashboard/top-products?${queryParams.toString()}`)
      const data = response.data as TopProductsResponse
      setTopProducts(data.products)
    } catch (err: any) {
      if (err.response?.status === 422) {
        setTopProductsError('Invalid parameters')
      } else {
        setTopProductsError('Failed to fetch top products')
      }
    } finally {
      setTopProductsLoading(false)
    }
  }

  const generateSalesReport = async (data: SalesReportRequest) => {
    setLoadingReport(true)
    setErrorReport(null)
    try {
      const result = await generateSalesReportApi(data)
      setSalesReport(result)
    } catch (err: any) {
      const message = err.message || err.status_code || 'Failed to generate report'
      setErrorReport(String(message))
      setSalesReport(null)
    } finally {
      setLoadingReport(false)
    }
  }

  return {
    topProducts,
    topProductsLoading,
    topProductsError,
    fetchTopProducts,
    salesReport,
    loadingReport,
    errorReport,
    generateSalesReport,
  }
}