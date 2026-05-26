import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'

const mockGet = vi.fn()

vi.mock('../api/axios', () => ({
  default: {
    get: (...args: any[]) => mockGet(...args),
  },
}))

describe('useAdminStats', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial loading state', async () => {
    mockGet.mockImplementation(() => new Promise(() => {}))

    const { useAdminStats } = await import('../hooks/useAdminStats')
    const { result } = renderHook(() => useAdminStats('2026-05-01', '2026-05-26'))

    expect(result.current.loading).toBe(true)
  })

  it('returns summary after successful fetch', async () => {
    mockGet
      .mockResolvedValueOnce({ data: { total_orders: 0, total_revenue: 0, total_products_sold: 0 } })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] })

    const { useAdminStats } = await import('../hooks/useAdminStats')
    const { result } = renderHook(() => useAdminStats('2026-05-01', '2026-05-26'))

    await vi.runAllTimersAsync()

    expect(result.current.summary).toBeDefined()
  })

  it('returns error on fetch failure', async () => {
    mockGet.mockRejectedValueOnce({ response: { data: { detail: 'Server error' } } })

    const { useAdminStats } = await import('../hooks/useAdminStats')
    const { result } = renderHook(() => useAdminStats('2026-05-01', '2026-05-26'))

    await vi.runAllTimersAsync()

    expect(result.current.error).toBe('Server error')
  })

  it('has refetch function', async () => {
    mockGet
      .mockResolvedValueOnce({ data: { total_orders: 0, total_revenue: 0, total_products_sold: 0 } })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] })

    const { useAdminStats } = await import('../hooks/useAdminStats')
    const { result } = renderHook(() => useAdminStats('2026-05-01', '2026-05-26'))

    await vi.runAllTimersAsync()

    expect(typeof result.current.refetch).toBe('function')
  })
})
