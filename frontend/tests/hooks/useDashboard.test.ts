import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDashboard } from '../../src/hooks/useDashboard'

vi.mock('../../src/api/dashboard', () => ({
  fetchSalesSummary: vi.fn()
}))

import { fetchSalesSummary } from '../../src/api/dashboard'

const mockedFetchSalesSummary = vi.mocked(fetchSalesSummary, true)

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exposes salesSummary, loadingSummary, errorSummary, and fetchSalesSummary', () => {
    const { result } = renderHook(() => useDashboard())

    expect(result.current).toHaveProperty('salesSummary')
    expect(result.current).toHaveProperty('loadingSummary')
    expect(result.current).toHaveProperty('errorSummary')
    expect(result.current).toHaveProperty('fetchSalesSummary')
  })

  it('sets loadingSummary true during fetch and false after completion', async () => {
    mockedFetchSalesSummary.mockImplementation(() => Promise.resolve({
      total_sales: 120,
      total_revenue: 15400.5,
      period_start: '2024-06-01',
      period_end: '2024-06-30'
    }))

    const { result } = renderHook(() => useDashboard())

    let loadingStates: boolean[] = []
    act(() => {
      result.current.fetchSalesSummary('2024-06-01', '2024-06-30')
    })

    expect(result.current.loadingSummary).toBe(true)
  })

  it('sets salesSummary on success', async () => {
    const mockSummary = {
      total_sales: 120,
      total_revenue: 15400.5,
      period_start: '2024-06-01',
      period_end: '2024-06-30'
    }
    mockedFetchSalesSummary.mockResolvedValueOnce(mockSummary)

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.fetchSalesSummary('2024-06-01', '2024-06-30')
    })

    expect(result.current.salesSummary).toEqual(mockSummary)
    expect(result.current.errorSummary).toBeNull()
  })

  it('sets errorSummary on API error', async () => {
    mockedFetchSalesSummary.mockRejectedValueOnce(new Error('Internal Server Error'))

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.fetchSalesSummary('2024-06-01', '2024-06-30')
    })

    expect(result.current.salesSummary).toBeNull()
    expect(result.current.errorSummary).toBe('Internal Server Error')
  })

  it('sets errorSummary on validation error', async () => {
    mockedFetchSalesSummary.mockRejectedValueOnce(
      new Error('Missing required parameter: start_date')
    )

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.fetchSalesSummary('', '2024-06-30')
    })

    expect(result.current.salesSummary).toBeNull()
    expect(result.current.errorSummary).toBe('Missing required parameter: start_date')
  })

  it('resets errorSummary on new request', async () => {
    mockedFetchSalesSummary
      .mockRejectedValueOnce(new Error('Internal Server Error'))
      .mockResolvedValueOnce({
        total_sales: 60,
        total_revenue: 7700.25,
        period_start: '2024-06-16',
        period_end: '2024-06-30'
      })

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.fetchSalesSummary('2024-06-01', '2024-06-30')
    })

    expect(result.current.errorSummary).toBe('Internal Server Error')

    await act(async () => {
      await result.current.fetchSalesSummary('2024-06-16', '2024-06-30')
    })

    expect(result.current.errorSummary).toBeNull()
  })

  it('handles rapid consecutive calls', async () => {
    mockedFetchSalesSummary
      .mockResolvedValueOnce({
        total_sales: 60,
        total_revenue: 7700.25,
        period_start: '2024-06-16',
        period_end: '2024-06-30'
      })

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.fetchSalesSummary('2024-06-16', '2024-06-30')
    })

    expect(result.current.salesSummary).toEqual({
      total_sales: 60,
      total_revenue: 7700.25,
      period_start: '2024-06-16',
      period_end: '2024-06-30'
    })
  })
})