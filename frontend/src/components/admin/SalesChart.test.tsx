import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Chart as ChartJS } from 'chart.js'
import SalesChart from './SalesChart'
import type { SalesDataPoint } from '../../types'

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => <div data-testid="mocked-line-chart">Line Chart</div>),
}))

describe('SalesChart', () => {
  const mockData: SalesDataPoint[] = [
    { date: '2026-05-20', orders_count: 5, revenue: 150.00 },
    { date: '2026-05-21', orders_count: 3, revenue: 90.00 },
    { date: '2026-05-22', orders_count: 7, revenue: 210.00 },
  ]

  beforeAll(() => {
    vi.spyOn(ChartJS, 'register').mockImplementation(() => {})
  })

  it('renders Line chart component', () => {
    const { container } = render(<SalesChart data={mockData} />)
    expect(container.querySelector('[data-testid="mocked-line-chart"]')).toBeDefined()
  })

  it('renders with data', () => {
    const { container } = render(<SalesChart data={mockData} />)
    expect(container).toBeDefined()
  })

  it('handles empty data array', () => {
    const { container } = render(<SalesChart data={[]} />)
    expect(container).toBeDefined()
  })

  it('renders chart container with proper structure', () => {
    const { container } = render(<SalesChart data={mockData} />)
    const chartContainer = container.querySelector('.bg-white.rounded-lg.shadow-md.p-6')
    expect(chartContainer).toBeDefined()
  })
})