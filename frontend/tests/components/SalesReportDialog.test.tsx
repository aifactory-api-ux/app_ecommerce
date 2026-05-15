import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SalesReportDialog from '../../src/components/SalesReportDialog'
import { SalesReportResponse } from '../../src/types/models'

describe('SalesReportDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dialog with summary and top_products when open', () => {
    const mockReport: SalesReportResponse = {
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

    render(<SalesReportDialog open={true} onClose={vi.fn()} report={mockReport} loading={false} />)

    expect(screen.getByText('120')).toBeTruthy()
    expect(screen.getByText('15400.5')).toBeTruthy()
    expect(screen.getByText('2024-06-01')).toBeTruthy()
    expect(screen.getByText('2024-06-30')).toBeTruthy()
    expect(screen.getByText('Producto A')).toBeTruthy()
    expect(screen.getByText('50')).toBeTruthy()
  })

  it('does not render dialog when open is false', () => {
    render(<SalesReportDialog open={false} onClose={vi.fn()} report={null} loading={false} />)

    expect(screen.queryByText('Reporte de Ventas')).toBeNull()
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn()
    const mockReport: SalesReportResponse = {
      summary: { total_sales: 120, total_revenue: 15400.5, period_start: '2024-06-01', period_end: '2024-06-30' },
      top_products: []
    }

    render(<SalesReportDialog open={true} onClose={mockOnClose} report={mockReport} loading={false} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders empty state when top_products is empty', () => {
    const mockReport: SalesReportResponse = {
      summary: { total_sales: 0, total_revenue: 0.0, period_start: '2024-06-01', period_end: '2024-06-30' },
      top_products: []
    }

    render(<SalesReportDialog open={true} onClose={vi.fn()} report={mockReport} loading={false} />)

    expect(screen.getByText(/no se vendieron productos/i)).toBeTruthy()
  })

  it('renders correctly with single-day period', () => {
    const mockReport: SalesReportResponse = {
      summary: { total_sales: 10, total_revenue: 1000.0, period_start: '2024-06-15', period_end: '2024-06-15' },
      top_products: [
        { product_id: 2, product_name: 'Producto B', units_sold: 10, revenue: 1000.0 }
      ]
    }

    render(<SalesReportDialog open={true} onClose={vi.fn()} report={mockReport} loading={false} />)

    expect(screen.getByText('10')).toBeTruthy()
    expect(screen.getByText('1000')).toBeTruthy()
    expect(screen.getByText('2024-06-15')).toBeTruthy()
  })

  it('shows loading indicator when loading prop is true', () => {
    render(<SalesReportDialog open={true} onClose={vi.fn()} report={null} loading={true} />)

    expect(screen.getByText(/generando reporte/i)).toBeTruthy()
  })

  it('shows error message when error prop is set', () => {
    render(<SalesReportDialog open={true} onClose={vi.fn()} report={null} loading={false} error="No se pudo generar el reporte" />)

    expect(screen.getByText(/no se pudo generar el reporte/i)).toBeTruthy()
  })
})