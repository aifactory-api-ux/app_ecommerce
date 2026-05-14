import { useState } from 'react'
import api from '../api/axios'
import { TopProduct, TopProductsResponse } from '../types/models'

interface UseDashboardParams {
  start_date: string
  end_date: string
  limit?: number
}

export function useDashboard(params: UseDashboardParams) {
  const [topProducts, setTopProducts] = useState<TopProduct[] | null>(null)
  const [topProductsLoading, setTopProductsLoading] = useState(false)
  const [topProductsError, setTopProductsError] = useState<string | null>(null)

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

  return {
    topProducts,
    topProductsLoading,
    topProductsError,
    fetchTopProducts,
  }
}