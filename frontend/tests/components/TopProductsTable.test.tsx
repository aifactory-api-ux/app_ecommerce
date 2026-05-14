import { render, screen } from '@testing-library/react'
import { TopProductsTable } from '../../src/components/TopProductsTable'

const mockTopProduct = {
  product_id: 1,
  product_name: 'Widget A',
  units_sold: 100,
  revenue: 2500.5,
}

describe('TopProductsTable', () => {
  it('renders table with top products data', () => {
    render(<TopProductsTable products={[mockTopProduct]} loading={false} />)

    expect(screen.getByText('Widget A')).toBeTruthy()
    expect(screen.getByText('100')).toBeTruthy()
    expect(screen.getByText('2500.5')).toBeTruthy()
  })

  it('renders empty state when products array is empty', () => {
    render(<TopProductsTable products={[]} loading={false} />)

    expect(screen.getByText(/no products/i)).toBeTruthy()
  })

  it('renders correctly with missing optional fields', () => {
    const partialProduct = {
      product_id: 3,
      product_name: 'Widget C',
      units_sold: 0,
      revenue: 0,
    }
    render(<TopProductsTable products={[partialProduct]} loading={false} />)

    expect(screen.getByText('Widget C')).toBeTruthy()
  })

  it('renders loading state when loading prop is true', () => {
    render(<TopProductsTable products={[]} loading={true} />)

    expect(screen.getByText(/loading/i)).toBeTruthy()
  })

  it('renders error state when error prop is present', () => {
    render(<TopProductsTable products={[]} loading={false} error="Failed to fetch top products" />)

    expect(screen.getByText(/Failed to fetch top products/i)).toBeTruthy()
  })
})