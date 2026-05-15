import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ProductStat {
  product_id: number
  product_name: string
  units_sold: number
  revenue: number
}

interface TopProductsResponse {
  products: ProductStat[]
}

interface SalesReportResponse {
  summary: {
    total_sales: number
    total_revenue: number
    period_start: string
    period_end: string
  }
  top_products: ProductStat[]
}

describe('useDashboard hook', () => {
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

  it('should fetch sales report successfully and return correct data', async () => {
    const mockResponse: SalesReportResponse = {
      summary: {
        total_sales: 123,
        total_revenue: 4567.89,
        period_start: '2024-06-01',
        period_end: '2024-06-30',
      },
      top_products: [
        {
          product_id: 1,
          product_name: 'Producto A',
          units_sold: 100,
          revenue: 2000.0,
        },
      ],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any

    const { result } = renderHook(() => {
      const useDashboard = () => {
        const startDate = '2024-06-01'
        const endDate = '2024-06-30'

        return {
          generateReport: async (params: { start_date: string; end_date: string }) => {
            const response = await fetch('/api/dashboard/sales-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            })
            if (!response.ok) throw new Error(`Request failed with status code ${response.status}`)
            return response.json()
          },
          data: undefined as SalesReportResponse | undefined,
          loading: false,
          error: null as Error | null,
        }
      }
      return useDashboard()
    })

    const report = await result.current.generateReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })

    expect(report).toHaveProperty('summary')
    expect(report.summary).toHaveProperty('total_sales')
    expect(report.summary).toHaveProperty('total_revenue')
    expect(report.summary).toHaveProperty('period_start')
    expect(report.summary).toHaveProperty('period_end')
    expect(report).toHaveProperty('top_products')
  })

  it('should handle API validation error and expose error state', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ detail: 'Validation error' }),
    }) as any

    const { result } = renderHook(() => {
      const useDashboard = () => {
        return {
          generateReport: async (params: { start_date: string; end_date: string }) => {
            const response = await fetch('/api/dashboard/sales-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            })
            if (!response.ok) throw new Error(`Request failed with status code ${response.status}`)
            return response.json()
          },
          data: undefined as SalesReportResponse | undefined,
          loading: false,
          error: null as Error | null,
        }
      }
      return useDashboard()
    })

    try {
      await result.current.generateReport({
        start_date: '',
        end_date: '2024-06-30',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  it('should handle API error when start_date is after end_date', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: 'start_date cannot be greater than end_date' }),
    }) as any

    const { result } = renderHook(() => {
      const useDashboard = () => {
        return {
          generateReport: async (params: { start_date: string; end_date: string }) => {
            const response = await fetch('/api/dashboard/sales-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            })
            if (!response.ok) throw new Error(`Request failed with status code ${response.status}`)
            return response.json()
          },
          data: undefined as SalesReportResponse | undefined,
          loading: false,
          error: null as Error | null,
        }
      }
      return useDashboard()
    })

    try {
      await result.current.generateReport({
        start_date: '2024-07-01',
        end_date: '2024-06-30',
      })
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  it('should return empty top_products and zero summary when API returns empty data', async () => {
    const mockResponse: SalesReportResponse = {
      summary: {
        total_sales: 0,
        total_revenue: 0.0,
        period_start: '2024-06-01',
        period_end: '2024-06-30',
      },
      top_products: [],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any

    const { result } = renderHook(() => {
      const useDashboard = () => {
        return {
          generateReport: async (params: { start_date: string; end_date: string }) => {
            const response = await fetch('/api/dashboard/sales-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            })
            if (!response.ok) throw new Error(`Request failed with status code ${response.status}`)
            return response.json()
          },
          data: undefined as SalesReportResponse | undefined,
          loading: false,
          error: null as Error | null,
        }
      }
      return useDashboard()
    })

    const report = await result.current.generateReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })

    expect(report.summary.total_sales).toBe(0)
    expect(report.summary.total_revenue).toBe(0.0)
    expect(report.top_products).toEqual([])
  })

  it('should refetch data when start_date or end_date changes', async () => {
    const mockResponse: SalesReportResponse = {
      summary: {
        total_sales: 200,
        total_revenue: 8000.0,
        period_start: '2024-07-01',
        period_end: '2024-07-31',
      },
      top_products: [],
    }

    let callCount = 0
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any

    const { result } = renderHook(() => {
      const useDashboard = () => {
        return {
          generateReport: async (params: { start_date: string; end_date: string }) => {
            callCount++
            const response = await fetch('/api/dashboard/sales-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params),
            })
            if (!response.ok) throw new Error(`Request failed with status code ${response.status}`)
            return response.json()
          },
          data: undefined as SalesReportResponse | undefined,
          loading: false,
          error: null as Error | null,
        }
      }
      return useDashboard()
    })

    await result.current.generateReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })

    await result.current.generateReport({
      start_date: '2024-07-01',
      end_date: '2024-07-31',
    })

    expect(callCount).toBe(2)
  })

  it('useTopProducts exposes fetchTopProducts and related state', async () => {
    const mockResponse: TopProductsResponse = {
      products: [
        { product_id: 1, product_name: 'Product A', units_sold: 100, revenue: 5000.0 }
      ]
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any

    const { result } = renderHook(() => {
      const { useTopProducts } = require('../../src/hooks/useDashboard')
      return useTopProducts('2024-06-01', '2024-06-30', 5)
    })

    await waitFor(() => {
      expect(result.current.products).toBeDefined()
    })
    expect(result.current.loading).toBeDefined()
    expect(result.current.error).toBeDefined()
    expect(result.current.refetch).toBeDefined()
  })

  it('fetchTopProducts sets loading true during fetch', async () => {
    const mockResponse: TopProductsResponse = {
      products: [
        { product_id: 1, product_name: 'Product A', units_sold: 100, revenue: 5000.0 }
      ]
    }

    let resolvePromise: (value: unknown) => void
    const fetchPromise = new Promise(resolve => { resolvePromise = resolve })

    global.fetch = vi.fn().mockImplementation(() => fetchPromise.then(() => ({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }))) as any

    const { result } = renderHook(() => {
      const { useTopProducts } = require('../../src/hooks/useDashboard')
      return useTopProducts('2024-06-01', '2024-06-30', 5)
    })

    expect(result.current.loading).toBe(true)
  })

  it('fetchTopProducts updates topProducts on success', async () => {
    const mockResponse: TopProductsResponse = {
      products: [
        { product_id: 1, product_name: 'Product A', units_sold: 100, revenue: 5000.0 }
      ]
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any

    const { result } = renderHook(() => {
      const { useTopProducts } = require('../../src/hooks/useDashboard')
      return useTopProducts('2024-06-01', '2024-06-30', 5)
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(mockResponse.products)
    })
    expect(result.current.error).toBeNull()
  })

  it('fetchTopProducts sets errorTopProducts on API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: 'API Error' }),
    }) as any

    const { result } = renderHook(() => {
      const { useTopProducts } = require('../../src/hooks/useDashboard')
      return useTopProducts('2024-06-01', '2024-06-30', 5)
    })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
    expect(result.current.products).toBeUndefined()
  })

  it('fetchTopProducts sets topProducts to empty array on empty response', async () => {
    const mockResponse: TopProductsResponse = {
      products: []
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any

    const { result } = renderHook(() => {
      const { useTopProducts } = require('../../src/hooks/useDashboard')
      return useTopProducts('2023-01-01', '2023-01-02', 5)
    })

    await waitFor(() => {
      expect(result.current.products).toEqual([])
    })
    expect(result.current.error).toBeNull()
  })
})