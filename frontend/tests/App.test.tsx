import { render, screen } from '@testing-library/react'
import App from '../../src/App'

jest.mock('../../src/hooks/useDashboard', () => ({
  useDashboard: jest.fn(() => ({
    topProducts: [{ product_id: 1, product_name: 'Widget A', units_sold: 100, revenue: 2500.5 }],
    topProductsLoading: false,
    topProductsError: null,
    fetchTopProducts: jest.fn(),
  })),
}))

describe('App', () => {
  it('renders TopProductsTable with data from useDashboard', () => {
    render(<App />)
    expect(screen.getByText('Widget A')).toBeTruthy()
  })

  it('shows loading state in TopProductsTable when topProductsLoading is true', () => {
    const { useDashboard } = require('../../src/hooks/useDashboard')
    useDashboard.mockReturnValueOnce({
      topProducts: [],
      topProductsLoading: true,
      topProductsError: null,
      fetchTopProducts: jest.fn(),
    })

    render(<App />)
    expect(screen.getByTestId('loading')).toBeTruthy()
  })

  it('shows error state in TopProductsTable when topProductsError is present', () => {
    const { useDashboard } = require('../../src/hooks/useDashboard')
    useDashboard.mockReturnValueOnce({
      topProducts: [],
      topProductsLoading: false,
      topProductsError: 'Network error',
      fetchTopProducts: jest.fn(),
    })

    render(<App />)
    expect(screen.getByTestId('error')).toBeTruthy()
  })

  it('renders TopProductsTable with empty state when topProducts is empty', () => {
    const { useDashboard } = require('../../src/hooks/useDashboard')
    useDashboard.mockReturnValueOnce({
      topProducts: [],
      topProductsLoading: false,
      topProductsError: null,
      fetchTopProducts: jest.fn(),
    })

    render(<App />)
    expect(screen.getByTestId('empty')).toBeTruthy()
  })

  it('passes correct limit and date range to useDashboard hook', () => {
    const { useDashboard } = require('../../src/hooks/useDashboard')
    const fetchTopProducts = jest.fn()
    useDashboard.mockReturnValueOnce({
      topProducts: [],
      topProductsLoading: false,
      topProductsError: null,
      fetchTopProducts,
    })

    render(<App />)
    expect(useDashboard).toHaveBeenCalledWith(
      expect.objectContaining({
        start_date: expect.any(String),
        end_date: expect.any(String),
        limit: 5,
      })
    )
  })
})