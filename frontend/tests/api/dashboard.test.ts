import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { generateSalesReport } from '../../src/api/dashboard'

vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('generateSalesReport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends POST request with correct body and returns parsed SalesReportResponse on success', async () => {
    const mockResponse = {
      status: 200,
      data: {
        summary: {
          total_sales: 100,
          total_revenue: 12345.67,
          period_start: '2024-06-01',
          period_end: '2024-06-30'
        },
        top_products: [
          {
            product_id: 1,
            product_name: 'Widget',
            units_sold: 50,
            revenue: 5000.0
          }
        ]
      }
    }
    mockedAxios.post.mockResolvedValueOnce(mockResponse)

    const result = await generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/dashboard/sales-report',
      { start_date: '2024-06-01', end_date: '2024-06-30' },
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('throws validation error if start_date is missing', async () => {
    await expect(generateSalesReport({
      end_date: '2024-06-30'
    } as any)).rejects.toThrow('start_date is required')
  })

  it('throws validation error if end_date is missing', async () => {
    await expect(generateSalesReport({
      start_date: '2024-06-01'
    } as any)).rejects.toThrow('end_date is required')
  })

  it('handles empty top_products array in response', async () => {
    const mockResponse = {
      status: 200,
      data: {
        summary: {
          total_sales: 0,
          total_revenue: 0.0,
          period_start: '2024-06-01',
          period_end: '2024-06-30'
        },
        top_products: []
      }
    }
    mockedAxios.post.mockResolvedValueOnce(mockResponse)

    const result = await generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })

    expect(result.top_products).toEqual([])
  })

  it('propagates API error response (400/422/500) as exception', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 422,
        data: { message: 'Invalid date range' }
      }
    })

    await expect(generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })).rejects.toThrow('Invalid date range')
  })

  it('throws error if start_date is not a valid ISO date string', async () => {
    await expect(generateSalesReport({
      start_date: 'not-a-date',
      end_date: '2024-06-30'
    })).rejects.toThrow('start_date must be a valid ISO date string')
  })

  it('throws error if end_date is not a valid ISO date string', async () => {
    await expect(generateSalesReport({
      start_date: '2024-06-01',
      end_date: 'not-a-date'
    })).rejects.toThrow('end_date must be a valid ISO date string')
  })

  it('handles network error gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))

    await expect(generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })).rejects.toThrow('Network error')
  })

  it('sends correct Content-Type header', async () => {
    const mockResponse = {
      status: 200,
      data: {
        summary: { total_sales: 0, total_revenue: 0, period_start: '2024-06-01', period_end: '2024-06-30' },
        top_products: []
      }
    }
    mockedAxios.post.mockResolvedValueOnce(mockResponse)

    await generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/api/dashboard/sales-report',
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' })
      })
    )
  })
})