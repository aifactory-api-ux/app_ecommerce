import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopProductsTable from '../../src/components/TopProductsTable'

describe('TopProductsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table with product rows matching data', () => {
    const mockProducts = [
      { product_id: 1, product_name: 'Product A', units_sold: 10, revenue: 100.0 },
      { product_id: 2, product_name: 'Product B', units_sold: 5, revenue: 50.0 }
    ]

    render(<TopProductsTable products={mockProducts} loading={false} error={null} />)

    expect(screen.getByText('Product A')).toBeTruthy()
    expect(screen.getByText('10')).toBeTruthy()
    expect(screen.getByText('$100.00')).toBeTruthy()
    expect(screen.getByText('Product B')).toBeTruthy()
    expect(screen.getByText('5')).toBeTruthy()
    expect(screen.getByText('$50.00')).toBeTruthy()
  })

  it('renders empty state when products array is empty', () => {
    render(<TopProductsTable products={[]} loading={false} error={null} />)

    expect(screen.getByText('No products found')).toBeTruthy()
  })

  it('renders loading indicator when loading is true', () => {
    render(<TopProductsTable products={[]} loading={true} error={null} />)

    expect(document.querySelector('.animate-spin')).toBeTruthy()
  })

  it('renders error message when error is provided', () => {
    render(<TopProductsTable products={[]} loading={false} error="Failed to fetch" />)

    expect(screen.getByText('Failed to fetch')).toBeTruthy()
  })

  it('renders correct column headers', () => {
    render(<TopProductsTable products={[]} loading={false} error={null} />)

    expect(screen.getByText('Product')).toBeTruthy()
    expect(screen.getByText('Units Sold')).toBeTruthy()
    expect(screen.getByText('Revenue')).toBeTruthy()
  })
})