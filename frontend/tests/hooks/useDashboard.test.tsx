import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDashboard } from '../../src/hooks/useDashboard'
import * as dashboardApi from '../../src/api/dashboard'

vi.mock('../../src/api/dashboard')

const mockedDashboardApi = dashboardApi as jest.Mocked<typeof dashboardApi>

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls generateSalesReport API and updates lastReport on success', async () => {
    const mockReport = {
      summary: {
        total_sales: 100,
        total_revenue: 12345.67,
        period_start: '2024-05-01',
        period_end: '2024-05-31'
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
    mockedDashboardApi.generateSalesReport.mockResolvedValueOnce(mockReport)

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '2024-05-01',
        end_date: '2024-05-31'
      })
    })

    expect(mockedDashboardApi.generateSalesReport).toHaveBeenCalledWith({
      start_date: '2024-05-01',
      end_date: '2024-05-31'
    })
    expect(result.current.lastReport).toEqual(mockReport)
    expect(result.current.reportError).toBeNull()
  })

  it('sets error state when API returns validation error (missing start_date)', async () => {
    mockedDashboardApi.generateSalesReport.mockRejectedValueOnce(
      new Error('start_date is required')
    )

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '',
        end_date: '2024-05-31'
      } as any)
    })

    expect(result.current.errorTopProducts).toBe('start_date is required')
    expect(result.current.lastReport).toBeNull()
  })

  it('sets error state when API returns 400 or 422 for invalid date range', async () => {
    mockedDashboardApi.generateSalesReport.mockRejectedValueOnce(
      new Error('end_date must be after start_date')
    )

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '2024-06-01',
        end_date: '2024-05-01'
      })
    })

    expect(result.current.errorTopProducts).toBe('end_date must be after start_date')
  })

  it('sets error state when API returns network/server error', async () => {
    mockedDashboardApi.generateSalesReport.mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '2024-05-01',
        end_date: '2024-05-31'
      })
    })

    expect(result.current.errorTopProducts).toBe('Failed to generate sales report. Please try again.')
  })

  it('resets error and lastReport on new generateSalesReport call', async () => {
    mockedDashboardApi.generateSalesReport.mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '2024-05-01',
        end_date: '2024-05-31'
      })
    })

    expect(result.current.errorTopProducts).toBeDefined()

    mockedDashboardApi.generateSalesReport.mockResolvedValueOnce({
      summary: { total_sales: 50, total_revenue: 5000, period_start: '2024-06-01', period_end: '2024-06-30' },
      top_products: []
    })

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '2024-06-01',
        end_date: '2024-06-30'
      })
    })

    expect(result.current.lastReport).toBeDefined()
  })

  it('does not call API if start_date or end_date is not an ISO date string', async () => {
    const { result } = renderHook(() => useDashboard())

    await act(async () => {
      await result.current.generateSalesReport({
        start_date: '05-01-2024',
        end_date: '2024/05/31'
      } as any)
    })

    expect(mockedDashboardApi.generateSalesReport).not.toHaveBeenCalled()
    expect(result.current.errorTopProducts).toBe('Dates must be in ISO format (YYYY-MM-DD)')
  })
})