import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { Chart as ChartJS } from 'chart.js'
import TopProductsChart from './TopProductsChart'
import type { TopProduct } from '../../types'

vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn(() => <div data-testid="mocked-bar-chart">Bar Chart</div>),
}))

describe('TopProductsChart', () => {
  const mockData: TopProduct[] = [
    { product_name: 'Product A', quantity_sold: 10, revenue: 100.00 },
    { product_name: 'Product B', quantity_sold: 5, revenue: 50.00 },
    { product_name: 'Product C', quantity_sold: 3, revenue: 30.00 },
  ]

  beforeAll(() => {
    vi.spyOn(ChartJS, 'register').mockImplementation(() => {})
  })

  it('renders Bar chart component', () => {
    const { container } = render(<TopProductsChart data={mockData} />)
    expect(container.querySelector('[data-testid="mocked-bar-chart"]')).toBeDefined()
  })

  it('handles empty data array', () => {
    const { container } = render(<TopProductsChart data={[]} />)
    expect(container).toBeDefined()
  })

  it('renders chart container with proper structure', () => {
    const { container } = render(<TopProductsChart data={mockData} />)
    const chartContainer = container.querySelector('.bg-white.rounded-lg.shadow-md.p-6')
    expect(chartContainer).toBeDefined()
  })
})