import { useState, useCallback } from 'react'
import { generateSalesReport as apiGenerateSalesReport } from '../api/dashboard'
import { SalesReportRequest, SalesReportResponse } from '../types/models'

interface UseDashboardReturn {
  salesSummary: SalesSummary | null
  topProducts: ProductSales[]
  loadingSummary: boolean
  loadingTopProducts: boolean
  errorSummary: string | null
  errorTopProducts: string | null
  fetchSalesSummary: (start_date: string, end_date: string) => Promise<void>
  fetchTopProducts: (start_date: string, end_date: string, limit?: number) => Promise<void>
  generateSalesReport: (req: SalesReportRequest) => Promise<SalesReportResponse>
  reportLoading: boolean
  reportError: string | null
  lastReport: SalesReportResponse | null
}

interface SalesSummary {
  total_sales: number
  total_revenue: number
  period_start: string
  period_end: string
}

interface ProductSales {
  product_id: number
  product_name: string
  units_sold: number
  revenue: number
}

function isValidISODate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false
  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date.getTime())
}

export function useDashboard(): UseDashboardReturn {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null)
  const [topProducts, setTopProducts] = useState<ProductSales[]>([])
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingTopProducts, setLoadingTopProducts] = useState(false)
  const [errorSummary, setErrorSummary] = useState<string | null>(null)
  const [errorTopProducts, setErrorTopProducts] = useState<string | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [lastReport, setLastReport] = useState<SalesReportResponse | null>(null)

  const fetchSalesSummary = useCallback(async (start_date: string, end_date: string) => {
    setLoadingSummary(true)
    setErrorSummary(null)
    try {
      const response = await fetch(`/api/dashboard/sales-summary?start_date=${start_date}&end_date=${end_date}`)
      if (!response.ok) throw new Error('Failed to fetch sales summary')
      const data = await response.json()
      setSalesSummary(data)
    } catch (err: any) {
      setErrorSummary(err.message || 'Failed to fetch sales summary')
    } finally {
      setLoadingSummary(false)
    }
  }, [])

  const fetchTopProducts = useCallback(async (start_date: string, end_date: string, limit: number = 5) => {
    setLoadingTopProducts(true)
    setErrorTopProducts(null)
    try {
      const response = await fetch(`/api/dashboard/top-products?start_date=${start_date}&end_date=${end_date}&limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch top products')
      const data = await response.json()
      setTopProducts(data.products || [])
    } catch (err: any) {
      setErrorTopProducts(err.message || 'Failed to fetch top products')
    } finally {
      setLoadingTopProducts(false)
    }
  }, [])

  const generateSalesReport = useCallback(async (req: SalesReportRequest): Promise<SalesReportResponse> => {
    if (!req.start_date || !req.end_date) {
      const errorMsg = !req.start_date ? 'start_date is required' : 'end_date is required'
      setErrorTopProducts(errorMsg)
      throw new Error(errorMsg)
    }

    if (!isValidISODate(req.start_date) || !isValidISODate(req.end_date)) {
      const errorMsg = 'Dates must be in ISO format (YYYY-MM-DD)'
      setErrorTopProducts(errorMsg)
      throw new Error(errorMsg)
    }

    if (req.start_date > req.end_date) {
      const errorMsg = 'end_date must be after start_date'
      setErrorTopProducts(errorMsg)
      throw new Error(errorMsg)
    }

    setReportLoading(true)
    setReportError(null)
    setLastReport(null)

    try {
      const result = await apiGenerateSalesReport(req)
      setLastReport(result)
      setReportError(null)
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate sales report. Please try again.'
      setReportError(errorMessage)
      setErrorTopProducts(errorMessage)
      throw err
    } finally {
      setReportLoading(false)
    }
  }, [])

  return {
    salesSummary,
    topProducts,
    loadingSummary,
    loadingTopProducts,
    errorSummary,
    errorTopProducts,
    fetchSalesSummary,
    fetchTopProducts,
    generateSalesReport,
    reportLoading,
    reportError,
    lastReport
  }
}