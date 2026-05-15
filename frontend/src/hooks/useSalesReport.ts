import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { generateSalesReport } from '../api/dashboard'
import { SalesReportRequest, SalesReportResponse } from '../types/models'

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