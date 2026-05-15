import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from '../../src/api/axios'

const mockAxiosPost = vi.fn()

vi.mock('../../src/api/axios', () => ({
  default: {
    post: mockAxiosPost,
  },
}))

import { generateSalesReport } from '../../src/api/dashboard'

describe('dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generateSalesReport sends POST request with correct body and returns parsed SalesReportResponse on 200', async () => {
    mockAxiosPost.mockResolvedValueOnce({
      status: 200,
      data: {
        total_sales: 100,
        total_revenue: 12345.67,
        top_products: [
          { product_id: 1, product_name: 'Widget', units_sold: 50, revenue: 5000.0 },
        ],
      },
    })

    const result = await generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })

    expect(mockAxiosPost).toHaveBeenCalledWith('/api/dashboard/sales-report', {
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })
    expect(result).toEqual({
      total_sales: 100,
      total_revenue: 12345.67,
      top_products: [
        { product_id: 1, product_name: 'Widget', units_sold: 50, revenue: 5000.0 },
      ],
    })
  })

  it('generateSalesReport throws validation error if start_date is missing', async () => {
    await expect(
      generateSalesReport({ end_date: '2024-06-30' } as any)
    ).rejects.toThrow('start_date is required')
  })

  it('generateSalesReport throws validation error if end_date is missing', async () => {
    await expect(
      generateSalesReport({ start_date: '2024-06-01' } as any)
    ).rejects.toThrow('end_date is required')
  })

  it('generateSalesReport throws validation error if start_date is not ISO date string', async () => {
    await expect(
      generateSalesReport({ start_date: 'not-a-date', end_date: '2024-06-30' })
    ).rejects.toThrow('start_date must be a valid ISO date string')
  })

  it('generateSalesReport throws validation error if end_date is not ISO date string', async () => {
    await expect(
      generateSalesReport({ start_date: '2024-06-01', end_date: 'not-a-date' })
    ).rejects.toThrow('end_date must be a valid ISO date string')
  })

  it('generateSalesReport returns empty top_products array if API returns empty list', async () => {
    mockAxiosPost.mockResolvedValueOnce({
      status: 200,
      data: {
        total_sales: 0,
        total_revenue: 0.0,
        top_products: [],
      },
    })

    const result = await generateSalesReport({
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })

    expect(result.top_products).toEqual([])
  })

  it('generateSalesReport throws error if API returns 400 Bad Request', async () => {
    mockAxiosPost.mockRejectedValueOnce({
      response: { status: 400, data: { detail: 'Invalid date range' } },
    })

    await expect(
      generateSalesReport({ start_date: '2024-06-01', end_date: '2024-06-30' })
    ).rejects.toEqual(expect.objectContaining({ status_code: 400, message: 'Invalid date range' }))
  })

  it('generateSalesReport throws error if API returns 500 Internal Server Error', async () => {
    mockAxiosPost.mockRejectedValueOnce({
      response: { status: 500, data: { detail: 'Internal Server Error' } },
    })

    await expect(
      generateSalesReport({ start_date: '2024-06-01', end_date: '2024-06-30' })
    ).rejects.toEqual(expect.objectContaining({ status_code: 500, message: 'Internal Server Error' }))
  })

  it('generateSalesReport throws error if network request fails', async () => {
    mockAxiosPost.mockRejectedValueOnce(new Error('Network Error'))

    await expect(
      generateSalesReport({ start_date: '2024-06-01', end_date: '2024-06-30' })
    ).rejects.toThrow('Network Error')
  })

  it('generateSalesReport supports start_date and end_date at the same day (edge case)', async () => {
    mockAxiosPost.mockResolvedValueOnce({
      status: 200,
      data: {
        total_sales: 1,
        total_revenue: 100.0,
        top_products: [
          { product_id: 2, product_name: 'SingleDayProduct', units_sold: 1, revenue: 100.0 },
        ],
      },
    })

    const result = await generateSalesReport({
      start_date: '2024-06-15',
      end_date: '2024-06-15',
    })

    expect(mockAxiosPost).toHaveBeenCalledWith('/api/dashboard/sales-report', {
      start_date: '2024-06-15',
      end_date: '2024-06-15',
    })
    expect(result.total_sales).toBe(1)
    expect(result.total_revenue).toBe(100.0)
  })
})