import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from '../../src/api/axios'

vi.mock('../../src/api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getSalesSummary returns SalesSummary on valid dates (happy path)', async () => {
    const mockResponse = {
      total_sales: 100,
      total_revenue: 12345.67,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    }

    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const { getSalesSummary } = await import('../../src/api/dashboard')
    const result = await getSalesSummary('2024-01-01', '2024-01-31')

    expect(result).toEqual(mockResponse)
    expect(axios.get).toHaveBeenCalledWith('/api/dashboard/sales-summary', {
      params: { start_date: '2024-01-01', end_date: '2024-01-31' },
    })
  })

  it('getSalesSummary throws error if start_date is missing', async () => {
    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('' as any, '2024-01-31')).rejects.toThrow('start_date is required')
  })

  it('getSalesSummary throws error if end_date is missing', async () => {
    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('2024-01-01', '' as any)).rejects.toThrow('end_date is required')
  })

  it('getSalesSummary throws error if start_date is not ISO format', async () => {
    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('01-01-2024', '2024-01-31')).rejects.toThrow('start_date must be an ISO date string')
  })

  it('getSalesSummary throws error if end_date is not ISO format', async () => {
    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('2024-01-01', '31-01-2024')).rejects.toThrow('end_date must be an ISO date string')
  })

  it('getSalesSummary returns error if API responds with 400 Bad Request', async () => {
    ;(axios.get as any).mockRejectedValue({
      response: { status: 400, statusText: 'Bad Request' },
    })

    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('2024-02-01', '2024-01-01')).rejects.toThrow('Bad Request')
  })

  it('getSalesSummary returns error if API responds with 500 Internal Server Error', async () => {
    ;(axios.get as any).mockRejectedValue({
      response: { status: 500, statusText: 'Internal Server Error' },
    })

    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('2024-01-01', '2024-01-31')).rejects.toThrow('Internal Server Error')
  })

  it('getSalesSummary returns error if network fails', async () => {
    ;(axios.get as any).mockRejectedValue(new Error('Network Error'))

    const { getSalesSummary } = await import('../../src/api/dashboard')

    await expect(getSalesSummary('2024-01-01', '2024-01-31')).rejects.toThrow('Network Error')
  })

  it('getSalesSummary returns correct types for all fields', async () => {
    const mockResponse = {
      total_sales: 100,
      total_revenue: 12345.67,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    }

    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const { getSalesSummary } = await import('../../src/api/dashboard')
    const result = await getSalesSummary('2024-01-01', '2024-01-31')

    expect(typeof result.total_sales).toBe('number')
    expect(typeof result.total_revenue).toBe('number')
    expect(typeof result.period_start).toBe('string')
    expect(typeof result.period_end).toBe('string')
  })

  it('getSalesSummary passes query params as expected', async () => {
    const mockResponse = {
      total_sales: 100,
      total_revenue: 12345.67,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    }

    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const { getSalesSummary } = await import('../../src/api/dashboard')
    await getSalesSummary('2024-01-01', '2024-01-31')

    expect(axios.get).toHaveBeenCalledWith(
      '/api/dashboard/sales-summary',
      { params: { start_date: '2024-01-01', end_date: '2024-01-31' } }
    )
  })

  it('generateSalesReport returns SalesReportResponse on valid dates', async () => {
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

    ;(axios.post as any).mockResolvedValue({ data: mockResponse })

    const { generateSalesReport } = await import('../../src/api/dashboard')
    const result = await generateSalesReport({ start_date: '2024-06-01', end_date: '2024-06-30' })

    expect(result).toEqual(mockResponse)
    expect(axios.post).toHaveBeenCalledWith('/api/dashboard/sales-report', {
      start_date: '2024-06-01',
      end_date: '2024-06-30'
    })
    expect(result.summary.total_sales).toBe(120)
    expect(result.summary.total_revenue).toBe(15400.5)
    expect(result.top_products).toHaveLength(1)
  })

  it('generateSalesReport throws error on missing start_date', async () => {
    const { generateSalesReport } = await import('../../src/api/dashboard')

    await expect(generateSalesReport({ start_date: '', end_date: '2024-06-30' } as any)).rejects.toThrow('start_date is required')
  })

  it('generateSalesReport throws error on missing end_date', async () => {
    const { generateSalesReport } = await import('../../src/api/dashboard')

    await expect(generateSalesReport({ start_date: '2024-06-01', end_date: '' } as any)).rejects.toThrow('end_date is required')
  })

  it('generateSalesReport throws error on invalid date format', async () => {
    const { generateSalesReport } = await import('../../src/api/dashboard')

    await expect(generateSalesReport({ start_date: '06/01/2024', end_date: '2024-06-30' } as any)).rejects.toThrow('start_date must be an ISO date string')
  })

  it('generateSalesReport returns empty top_products array if no sales', async () => {
    const mockResponse = {
      summary: { total_sales: 0, total_revenue: 0, period_start: '2024-07-01', period_end: '2024-07-01' },
      top_products: []
    }

    ;(axios.post as any).mockResolvedValue({ data: mockResponse })

    const { generateSalesReport } = await import('../../src/api/dashboard')
    const result = await generateSalesReport({ start_date: '2024-07-01', end_date: '2024-07-01' })

    expect(result.top_products).toBeDefined()
    expect(result.top_products.length).toBe(0)
  })

  it('generateSalesReport propagates API error response', async () => {
    ;(axios.post as any).mockRejectedValue({
      response: { status: 400, data: { detail: 'Invalid date range' } },
    })

    const { generateSalesReport } = await import('../../src/api/dashboard')

    await expect(generateSalesReport({ start_date: '2024-06-01', end_date: '2024-06-30' })).rejects.toThrow('Invalid date range')
  })

  it('fetchTopProducts returns products on valid date range', async () => {
    const mockResponse = {
      products: [
        { product_id: 1, product_name: 'Product A', units_sold: 100, revenue: 5000.0 }
      ]
    }

    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const { getTopProducts } = await import('../../src/api/dashboard')
    const result = await getTopProducts('2024-06-01', '2024-06-30', 5)

    expect(result).toEqual(mockResponse)
    expect(axios.get).toHaveBeenCalledWith('/api/dashboard/top-products', {
      params: { start_date: '2024-06-01', end_date: '2024-06-30', limit: 5 },
    })
  })

  it('fetchTopProducts omits limit and defaults to 5', async () => {
    const mockResponse = {
      products: [
        { product_id: 1, product_name: 'Product A', units_sold: 100, revenue: 5000.0 }
      ]
    }

    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const { getTopProducts } = await import('../../src/api/dashboard')
    const result = await getTopProducts('2024-06-01', '2024-06-30')

    expect(result).toEqual(mockResponse)
    expect(axios.get).toHaveBeenCalledWith('/api/dashboard/top-products', {
      params: { start_date: '2024-06-01', end_date: '2024-06-30', limit: 5 },
    })
  })

  it('fetchTopProducts returns empty products array when no sales', async () => {
    const mockResponse = {
      products: []
    }

    ;(axios.get as any).mockResolvedValue({ data: mockResponse })

    const { getTopProducts } = await import('../../src/api/dashboard')
    const result = await getTopProducts('2023-01-01', '2023-01-02')

    expect(result).toEqual(mockResponse)
    expect(result.products).toEqual([])
  })

  it('fetchTopProducts throws error on missing start_date', async () => {
    const { getTopProducts } = await import('../../src/api/dashboard')

    await expect(getTopProducts('' as any, '2024-06-30')).rejects.toThrow('start_date is required')
  })

  it('fetchTopProducts throws error on missing end_date', async () => {
    const { getTopProducts } = await import('../../src/api/dashboard')

    await expect(getTopProducts('2024-06-01', '' as any)).rejects.toThrow('end_date is required')
  })

  it('fetchTopProducts throws error on invalid date format', async () => {
    const { getTopProducts } = await import('../../src/api/dashboard')

    await expect(getTopProducts('06-01-2024', '06-30-2024')).rejects.toThrow('start_date must be an ISO date string')
  })

  it('fetchTopProducts throws error on negative limit', async () => {
    const { getTopProducts } = await import('../../src/api/dashboard')

    await expect(getTopProducts('2024-06-01', '2024-06-30', -1)).rejects.toThrow('limit must be a positive integer')
  })

  it('fetchTopProducts propagates network error', async () => {
    ;(axios.get as any).mockRejectedValue(new Error('Network Error'))

    const { getTopProducts } = await import('../../src/api/dashboard')

    await expect(getTopProducts('2024-06-01', '2024-06-30')).rejects.toThrow('Network Error')
  })

  it('fetchTopProducts propagates API error response', async () => {
    ;(axios.get as any).mockRejectedValue({
      response: { status: 400, data: { detail: 'API Error' } },
    })

    const { getTopProducts } = await import('../../src/api/dashboard')

    await expect(getTopProducts('2024-06-01', '2024-06-30')).rejects.toThrow('API Error')
  })
})