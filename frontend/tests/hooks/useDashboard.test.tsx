import { renderHook, waitFor } from '@testing-library/react'
import { useDashboard } from '../../src/hooks/useDashboard'

const mockApiGet = jest.fn()

jest.mock('../../src/api/axios', () => ({
  default: {
    get: mockApiGet,
  },
}))

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns_top_products_data_on_successful_fetch', async () => {
    mockApiGet.mockResolvedValueOnce({
      status: 200,
      data: {
        products: [
          { product_id: 1, product_name: 'Product A', units_sold: 10, revenue: 100.0 },
        ],
      },
    })

    const { result } = renderHook(() =>
      useDashboard({ start_date: '2024-01-01', end_date: '2024-01-31', limit: 3 })
    )

    await waitFor(() => {
      expect(result.current.topProducts).toBeDefined()
    })
  })

  it('returns_error_on_422_response', async () => {
    mockApiGet.mockRejectedValueOnce({
      response: { status: 422, data: {} },
    })

    const { result } = renderHook(() =>
      useDashboard({ start_date: '', end_date: '2024-01-31' })
    )

    await waitFor(() => {
      expect(result.current.topProductsError).toBeTruthy()
    })
  })

  it('returns_empty_products_list_when_api_returns_empty', async () => {
    mockApiGet.mockResolvedValueOnce({
      status: 200,
      data: { products: [] },
    })

    const { result } = renderHook(() =>
      useDashboard({ start_date: '2099-01-01', end_date: '2099-01-31' })
    )

    await waitFor(() => {
      expect(result.current.topProducts).toEqual([])
    })
  })

  it('uses_default_limit_when_limit_not_provided', async () => {
    mockApiGet.mockResolvedValueOnce({
      status: 200,
      data: {
        products: [
          { product_id: 1, product_name: 'A', units_sold: 1, revenue: 10.0 },
          { product_id: 2, product_name: 'B', units_sold: 2, revenue: 20.0 },
          { product_id: 3, product_name: 'C', units_sold: 3, revenue: 30.0 },
          { product_id: 4, product_name: 'D', units_sold: 4, revenue: 40.0 },
          { product_id: 5, product_name: 'E', units_sold: 5, revenue: 50.0 },
        ],
      },
    })

    const { result } = renderHook(() =>
      useDashboard({ start_date: '2024-01-01', end_date: '2024-01-31' })
    )

    await waitFor(() => {
      expect(result.current.topProducts).toHaveLength(5)
    })
  })

  it('sets_isLoading_true_while_fetching', async () => {
    mockApiGet.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ status: 200, data: { products: [] } }), 500))
    )

    const { result } = renderHook(() =>
      useDashboard({ start_date: '2024-01-01', end_date: '2024-01-31' })
    )

    expect(result.current.topProductsLoading).toBe(true)
  })
})