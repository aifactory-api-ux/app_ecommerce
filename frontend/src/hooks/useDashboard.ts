import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query'
import { generateSalesReport, getSalesSummary, getTopProducts } from '../api/dashboard'
import { SalesReportRequest, SalesReportResponse, ProductStat } from '../types/models'

interface UseDashboardSummaryResult {
  summary: { total_sales: number; total_revenue: number; period_start: string; period_end: string } | undefined
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useDashboardSummary(
  startDate: string,
  endDate: string
): UseDashboardSummaryResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-summary', startDate, endDate],
    queryFn: () => getSalesSummary(startDate, endDate),
  })

  return {
    summary: data,
    loading: isLoading,
    error: error as Error | null,
    refetch,
  }
}

interface UseTopProductsResult {
  products: ProductStat[] | undefined
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useTopProducts(
  startDate: string,
  endDate: string,
  limit: number = 5
): UseTopProductsResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-top-products', startDate, endDate, limit],
    queryFn: () => getTopProducts(startDate, endDate, limit),
  })

  return {
    products: data?.products,
    loading: isLoading,
    error: error as Error | null,
    refetch,
  }
}

interface UseSalesReportResult extends Omit<UseMutationResult<SalesReportResponse, Error, SalesReportRequest>, 'data'> {
  generateReport: (params: SalesReportRequest) => Promise<SalesReportResponse>
  data: SalesReportResponse | undefined
}

export function useSalesReport(): UseSalesReportResult {
  const mutation = useMutation({
    mutationFn: (params: SalesReportRequest) => generateSalesReport(params),
  })

  return {
    ...mutation,
    generateReport: mutation.mutateAsync,
    data: mutation.data,
  }
}