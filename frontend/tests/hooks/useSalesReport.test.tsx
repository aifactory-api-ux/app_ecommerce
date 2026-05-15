import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSalesReport } from '../../src/hooks/useSalesReport'

vi.mock('../../src/api/dashboard', () => ({
  generateSalesReport: vi.fn()
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSalesReport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns data on successful fetch', async () => {
    const mockResponse = {
      summary: {
        total_sales: 120,
        total_revenue: 15400.5,
        period_start: '2024-06-01',
        period_end: '2024-06-30'
      },
      top_products: [
        {
          product_id: 1,
          product_name: 'Producto A',
          units_sold: 50,
          revenue: 5000.0
        }
      ]
    }

    const { generateSalesReport } = await import('../../src/api/dashboard')
    ;(generateSalesReport as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSalesReport(), { wrapper: createWrapper() })

    const promise = result.current.generateReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const data = await promise
    expect(data).toEqual(mockResponse)
    expect(result.current.isError).toBe(false)
    expect(result.current.data).toEqual(mockResponse)
  })

  it('sets isLoading true during fetch', async () => {
    const mockResponse = {
      summary: { total_sales: 0, total_revenue: 0, period_start: '2024-06-01', period_end: '2024-06-30' },
      top_products: []
    }

    const { generateSalesReport } = await import('../../src/api/dashboard')
    ;(generateSalesReport as any).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100)))

    const { result } = renderHook(() => useSalesReport(), { wrapper: createWrapper() })

    result.current.generateReport({ start_date: '2024-06-01', end_date: '2024-06-30' })

    expect(result.current.isLoading).toBe(true)
  })

  it('sets isError true on API error', async () => {
    const { generateSalesReport } = await import('../../src/api/dashboard')
    ;(generateSalesReport as any).mockRejectedValue(new Error('API error'))

    const { result } = renderHook(() => useSalesReport(), { wrapper: createWrapper() })

    await result.current.generateReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    }).catch(() => {})

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })

  it('does not fetch if start_date or end_date missing', async () => {
    const { generateSalesReport } = await import('../../src/api/dashboard')

    const { result } = renderHook(() => useSalesReport(), { wrapper: createWrapper() })

    try {
      await result.current.generateReport({
        start_date: '',
        end_date: '2024-06-30'
      })
    } catch (e) {
      // validation error expected
    }

    expect(generateSalesReport).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(result.current.isError).toBe(false)
  })

  it('returns empty top_products array if API returns none', async () => {
    const mockResponse = {
      summary: { total_sales: 0, total_revenue: 0, period_start: '2024-07-01', period_end: '2024-07-01' },
      top_products: []
    }

    const { generateSalesReport } = await import('../../src/api/dashboard')
    ;(generateSalesReport as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useSalesReport(), { wrapper: createWrapper() })

    await result.current.generateReport({
      start_date: '2024-07-01',
      end_date: '2024-07-01'
    })

    expect(result.current.data?.top_products).toBeDefined()
    expect(result.current.data?.top_products.length).toBe(0)
  })

  it('refetches when dates change', async () => {
    const mockResponse = {
      summary: { total_sales: 100, total_revenue: 10000, period_start: '2024-06-01', period_end: '2024-06-30' },
      top_products: []
    }

    const { generateSalesReport } = await import('../../src/api/dashboard')
    ;(generateSalesReport as any).mockResolvedValue(mockResponse)

    const { result, rerender } = renderHook(
      ({ startDate, endDate }) => {
        const mutation = useSalesReport()
        return mutation
      },
      {
        wrapper: createWrapper(),
        initialProps: { startDate: '2024-06-01', endDate: '2024-06-30' }
      }
    )

    await result.current.generateReport({ start_date: '2024-06-01', end_date: '2024-06-30' })

    rerender({ startDate: '2024-07-01', endDate: '2024-07-31' })

    await waitFor(() => {
      expect(generateSalesReport).toHaveBeenCalledTimes(2)
    })
  })
})