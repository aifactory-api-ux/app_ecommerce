import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'

const mockUseAdminStats = vi.fn()

vi.mock('../../hooks/useAdminStats', () => ({
  useAdminStats: () => mockUseAdminStats(),
}))

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAdminStats.mockReturnValue({
      summary: { total_orders: 0, total_revenue: 0, total_products_sold: 0 },
      topProducts: [],
      salesHistory: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
  })

  it('renders page title "Dashboard"', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeDefined()
  })

  it('renders DateRangePicker', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(document.body.querySelector('input[type="date"]')).toBeDefined()
  })

  it('renders loading state when fetching', () => {
    mockUseAdminStats.mockReturnValueOnce({
      summary: null,
      topProducts: [],
      salesHistory: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(screen.getByText('Cargando estadísticas...')).toBeDefined()
  })

  it('renders error message on failure', () => {
    mockUseAdminStats.mockReturnValueOnce({
      summary: null,
      topProducts: [],
      salesHistory: [],
      loading: false,
      error: 'Failed to load statistics',
      refetch: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(screen.getByText(/Failed to load statistics/)).toBeDefined()
  })

  it('renders StatCards after successful load', () => {
    mockUseAdminStats.mockReturnValue({
      summary: { total_orders: 100, total_revenue: 15000, total_products_sold: 250 },
      topProducts: [{ product_name: 'Test', quantity_sold: 10, revenue: 100 }],
      salesHistory: [{ date: '2026-05-20', orders_count: 10, revenue: 1000 }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(screen.getByText('Ventas Totales')).toBeDefined()
    expect(screen.getByText('Ingresos Totales')).toBeDefined()
    expect(screen.getByText('Productos Vendidos')).toBeDefined()
  })
})