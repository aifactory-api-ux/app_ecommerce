import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchSalesSummary } from '../../src/api/dashboard'

vi.mock('axios')

const mockedAxios = vi.mocked(axios, true)

describe('fetchSalesSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns sales summary for valid dates', async () => {
    const mockResponse = {
      total_sales: 120,
      total_revenue: 15400.5,
      period_start: '2024-06-01',
      period_end: '2024-06-30'
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockResponse })

    const result = await fetchSalesSummary('2024-06-01', '2024-06-30')

    expect(result).toEqual(mockResponse)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/dashboard/sales-summary',
      expect.objectContaining({
        params: { start_date: '2024-06-01', end_date: '2024-06-30' }
      })
    )
  })

  it('throws error if start_date is missing', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new Error('Missing required parameter: start_date')
    )

    await expect(fetchSalesSummary('', '2024-06-30')).rejects.toThrow(
      'Missing required parameter: start_date'
    )
  })

  it('throws error if end_date is missing', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new Error('Missing required parameter: end_date')
    )

    await expect(fetchSalesSummary('2024-06-01', '')).rejects.toThrow(
      'Missing required parameter: end_date'
    )
  })

  it('throws error for invalid date format', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      new Error('Invalid date format for start_date')
    )

    await expect(
      fetchSalesSummary('2024/06/01', '2024-06-30')
    ).rejects.toThrow('Invalid date format for start_date')
  })

  it('handles backend 400 error response', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { status: 400, data: { detail: 'Bad Request' } }
    })

    await expect(
      fetchSalesSummary('invalid-date', '2024-06-30')
    ).rejects.toThrow('Bad Request')
  })

  it('handles backend 500 error response', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { status: 500, data: { detail: 'Internal Server Error' } }
    })

    await expect(
      fetchSalesSummary('2024-06-01', '2024-06-30')
    ).rejects.toThrow('Internal Server Error')
  })

  it('returns correct types for all fields', async () => {
    const mockResponse = {
      total_sales: 120,
      total_revenue: 15400.5,
      period_start: '2024-06-01',
      period_end: '2024-06-30'
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockResponse })

    const result = await fetchSalesSummary('2024-06-01', '2024-06-30')

    expect(typeof result.total_sales).toBe('number')
    expect(typeof result.total_revenue).toBe('number')
    expect(typeof result.period_start).toBe('string')
    expect(typeof result.period_end).toBe('string')
  })

  it('sends correct query parameters', async () => {
    const mockResponse = {
      total_sales: 120,
      total_revenue: 15400.5,
      period_start: '2024-06-01',
      period_end: '2024-06-30'
    }
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockResponse })

    await fetchSalesSummary('2024-06-01', '2024-06-30')

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/dashboard/sales-summary',
      expect.objectContaining({
        params: { start_date: '2024-06-01', end_date: '2024-06-30' }
      })
    )
  })
})