import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSalesReport } from '../../src/hooks/useSalesReport'
import * as axiosModule from 'axios'

vi.mock('axios')

const mockedAxios = vi.mocked(axiosModule.default)

describe('useSalesReport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return sales report data on successful request', async () => {
    const mockResponse = {
      summary: {
        total_sales: 100,
        total_revenue: 12345.67,
        period_start: '2024-01-01',
        period_end: '2024-01-31'
      },
      top_products: [
        {
          product_id: 1,
          product_name: 'Product A',
          units_sold: 50,
          revenue: 5000.0
        }
      ]
    }

    mockedAxios.post.mockResolvedValue({ data: mockResponse })

    const { result } = renderHook(() => useSalesReport())

    const response = await result.current.generateReport({
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    })

    expect(response.summary.total_sales).toBe(100)
    expect(response.summary.total_revenue).toBe(12345.67)
    expect(response.top_products).toHaveLength(1)
  })

  it('should handle API validation error (422) and set error state', async () => {
    const errorResponse = {
      response: {
        status: 422,
        data: {
          detail: [
            {
              loc: ['body', 'start_date'],
              msg: 'field required',
              type: 'value_error.missing'
            }
          ]
        }
      }
    }

    mockedAxios.post.mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useSalesReport())

    try {
      await result.current.generateReport({
        start_date: '',
        end_date: '2024-01-31'
      })
    } catch (e) {
      // Expected error
    }

    expect(result.current.error).not.toBeNull()
  })

  it('should handle API error (400) for start_date after end_date', async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: {
          detail: 'start_date must be before or equal to end_date'
        }
      }
    }

    mockedAxios.post.mockRejectedValue(errorResponse)

    const { result } = renderHook(() => useSalesReport())

    try {
      await result.current.generateReport({
        start_date: '2024-02-01',
        end_date: '2024-01-01'
      })
    } catch (e) {
      // Expected error
    }

    expect(result.current.error).not.toBeNull()
  })

  it('should return empty sales report when API returns zero sales', async () => {
    const mockResponse = {
      summary: {
        total_sales: 0,
        total_revenue: 0.0,
        period_start: '1999-01-01',
        period_end: '1999-01-31'
      },
      top_products: []
    }

    mockedAxios.post.mockResolvedValue({ data: mockResponse })

    const { result } = renderHook(() => useSalesReport())

    const response = await result.current.generateReport({
      start_date: '1999-01-01',
      end_date: '1999-01-31'
    })

    expect(response.summary.total_sales).toBe(0)
    expect(response.summary.total_revenue).toBe(0.0)
    expect(response.top_products).toHaveLength(0)
  })

  it('should set isLoading true while fetching and false after completion', async () => {
    const mockResponse = {
      summary: {
        total_sales: 10,
        total_revenue: 1000.0,
        period_start: '2024-01-01',
        period_end: '2024-01-31'
      },
      top_products: []
    }

    mockedAxios.post.mockResolvedValue({ data: mockResponse })

    const { result } = renderHook(() => useSalesReport())

    expect(result.current.isLoading).toBe(false)

    const promise = result.current.generateReport({
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    })

    expect(result.current.isLoading).toBe(true)

    await promise

    expect(result.current.isLoading).toBe(false)
  })
})