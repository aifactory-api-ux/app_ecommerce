import { renderHook, waitFor } from '@testing-library/react'
import { useDashboard } from '../../src/hooks/useDashboard'

const mockApiGet = jest.fn()
const mockGenerateSalesReport = jest.fn()

jest.mock('../../src/api/axios', () => ({
  default: {
    get: mockApiGet,
  },
}))

jest.mock('../../src/api/dashboard', () => ({
  generateSalesReport: mockGenerateSalesReport,
}))

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateSalesReport', () => {
    it('calls generateSalesReport and updates salesReport state on success', async () => {
      mockGenerateSalesReport.mockResolvedValueOnce({
        total_sales: 100,
        total_revenue: 5000.0,
        top_products: [
          { product_id: 1, product_name: 'Product A', units_sold: 50, revenue: 2500.0 },
        ],
      })

      const { result } = renderHook(() =>
        useDashboard({ start_date: '2024-06-01', end_date: '2024-06-30' })
      )

      await result.current.generateSalesReport({
        start_date: '2024-06-01',
        end_date: '2024-06-30',
      })

      await waitFor(() => {
        expect(mockGenerateSalesReport).toHaveBeenCalledWith({
          start_date: '2024-06-01',
          end_date: '2024-06-30',
        })
      })

      expect(result.current.salesReport).toEqual({
        total_sales: 100,
        total_revenue: 5000.0,
        top_products: [
          { product_id: 1, product_name: 'Product A', units_sold: 50, revenue: 2500.0 },
        ],
      })
      expect(result.current.loadingReport).toBe(false)
      expect(result.current.errorReport).toBe(null)
    })

    it('sets errorReport on API error response', async () => {
      mockGenerateSalesReport.mockRejectedValueOnce({
        status_code: 500,
        message: 'Internal Server Error',
      })

      const { result } = renderHook(() =>
        useDashboard({ start_date: '2024-06-01', end_date: '2024-06-30' })
      )

      await result.current.generateSalesReport({
        start_date: '2024-06-01',
        end_date: '2024-06-30',
      })

      await waitFor(() => {
        expect(result.current.errorReport).toBe('Internal Server Error')
        expect(result.current.loadingReport).toBe(false)
        expect(result.current.salesReport).toBe(null)
      })
    })

    it('does not call API and sets errorReport if start_date or end_date is missing', async () => {
      const { result } = renderHook(() =>
        useDashboard({ start_date: '2024-06-01', end_date: '2024-06-30' })
      )

      await result.current.generateSalesReport({
        start_date: '',
        end_date: '2024-06-30',
      })

      expect(mockGenerateSalesReport).not.toHaveBeenCalled()
      expect(result.current.errorReport).toBe('start_date and end_date are required')
      expect(result.current.loadingReport).toBe(false)
      expect(result.current.salesReport).toBe(null)
    })

    it('resets errorReport before new request', async () => {
      mockGenerateSalesReport.mockResolvedValueOnce({
        total_sales: 100,
        total_revenue: 5000.0,
        top_products: [],
      })

      const { result } = renderHook(() =>
        useDashboard({ start_date: '2024-06-01', end_date: '2024-06-30' })
      )

      await result.current.generateSalesReport({
        start_date: '2024-06-01',
        end_date: '2024-06-30',
      })

      await waitFor(() => {
        expect(result.current.errorReport).toBe(null)
      })
    })

    it('handles empty top_products array in response', async () => {
      mockGenerateSalesReport.mockResolvedValueOnce({
        total_sales: 0,
        total_revenue: 0.0,
        top_products: [],
      })

      const { result } = renderHook(() =>
        useDashboard({ start_date: '2024-06-01', end_date: '2024-06-30' })
      )

      await result.current.generateSalesReport({
        start_date: '2024-06-01',
        end_date: '2024-06-30',
      })

      await waitFor(() => {
        expect(result.current.salesReport?.top_products).toEqual([])
      })
    })
  })
})