import { useState, useEffect } from 'react'
import api from '../api/axios'
import type { SalesSummary, TopProduct, SalesDataPoint } from '../types'

interface UseAdminStatsResult {
  summary: SalesSummary | null
  topProducts: TopProduct[]
  salesHistory: SalesDataPoint[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAdminStats(startDate: string, endDate: string): UseAdminStatsResult {
  const [summary, setSummary] = useState<SalesSummary | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [salesHistory, setSalesHistory] = useState<SalesDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = { start_date: startDate, end_date: endDate }

        const [summaryRes, topProductsRes, salesHistoryRes] = await Promise.all([
          api.get<SalesSummary>('/admin/stats', { params }),
          api.get<TopProduct[]>('/admin/top-products', { params: { ...params, limit: 5 } }),
          api.get<SalesDataPoint[]>('/admin/sales-history', { params }),
        ])

        setSummary(summaryRes.data)
        setTopProducts(topProductsRes.data)
        setSalesHistory(salesHistoryRes.data)
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch admin statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, refreshKey])

  return { summary, topProducts, salesHistory, loading, error, refetch }
}