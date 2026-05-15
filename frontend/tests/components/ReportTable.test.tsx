import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReportTable from '../../src/components/ReportTable'

describe('ReportTable', () => {
  it('renders summary and top_products from SalesReportResponse', () => {
    const mockData = {
      summary: {
        total_sales: 123,
        total_revenue: 4567.89,
        period_start: '2024-06-01',
        period_end: '2024-06-30',
      },
      top_products: [
        {
          product_id: 1,
          product_name: 'Producto A',
          units_sold: 100,
          revenue: 2000.0,
        },
      ],
    }

    render(<ReportTable report={mockData} loading={false} />)

    expect(screen.getByText(/123/)).toBeTruthy()
    expect(screen.getByText(/4567.89/)).toBeTruthy()
    expect(screen.getByText(/2024-06-01/)).toBeTruthy()
    expect(screen.getByText(/2024-06-30/)).toBeTruthy()
    expect(screen.getByText(/Producto A/)).toBeTruthy()
    expect(screen.getByText(/100/)).toBeTruthy()
    expect(screen.getByText(/2000.00/)).toBeTruthy()
  })

  it('shows loading indicator when loading is true', () => {
    render(<ReportTable report={null} loading={true} />)

    expect(screen.queryByRole('table')).toBeNull()
  })

  it('renders empty state when top_products is empty', () => {
    const mockData = {
      summary: {
        total_sales: 0,
        total_revenue: 0,
        period_start: '2024-06-01',
        period_end: '2024-06-30',
      },
      top_products: [],
    }

    render(<ReportTable report={mockData} loading={false} />)

    expect(screen.getByText(/no products found/i)).toBeTruthy()
  })

  it('handles null data gracefully', () => {
    render(<ReportTable report={null} loading={false} />)

    expect(screen.getByText(/no report data/i)).toBeTruthy()
  })

  it('renders multiple top_products rows correctly', () => {
    const mockData = {
      summary: {
        total_sales: 200,
        total_revenue: 8000.0,
        period_start: '2024-06-01',
        period_end: '2024-06-30',
      },
      top_products: [
        {
          product_id: 1,
          product_name: 'Producto A',
          units_sold: 100,
          revenue: 2000.0,
        },
        {
          product_id: 2,
          product_name: 'Producto B',
          units_sold: 100,
          revenue: 6000.0,
        },
      ],
    }

    render(<ReportTable report={mockData} loading={false} />)

    expect(screen.getByText(/Producto A/)).toBeTruthy()
    expect(screen.getByText(/Producto B/)).toBeTruthy()
  })
})