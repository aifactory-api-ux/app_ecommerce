import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardSummary from '../../src/components/DashboardSummary'

describe('DashboardSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders summary data correctly when summary prop is provided', () => {
    const mockSummary = {
      total_sales: 100,
      total_revenue: 12345.67,
      period_start: '2024-06-01',
      period_end: '2024-06-30',
    }

    render(<DashboardSummary summary={mockSummary} loading={false} error={null} />)

    expect(screen.getByText('100')).toBeTruthy()
    expect(screen.getByText('12345.67')).toBeTruthy()
    expect(screen.getByText('2024-06-01')).toBeTruthy()
    expect(screen.getByText('2024-06-30')).toBeTruthy()
  })

  it('shows loading indicator when loading prop is true', () => {
    render(<DashboardSummary summary={null} loading={true} error={null} />)

    expect(screen.getByText(/loading/i)).toBeTruthy()
  })

  it('shows error message when error prop is provided', () => {
    render(<DashboardSummary summary={null} loading={false} error="Failed to fetch sales summary" />)

    expect(screen.getByText('Failed to fetch sales summary')).toBeTruthy()
  })

  it('renders nothing when loading is false and summary and error are null', () => {
    const { container } = render(<DashboardSummary summary={null} loading={false} error={null} />)

    expect(container.firstChild).toBeNull()
  })

  it('renders summary with zero values correctly', () => {
    const mockSummary = {
      total_sales: 0,
      total_revenue: 0.0,
      period_start: '2024-06-01',
      period_end: '2024-06-30',
    }

    render(<DashboardSummary summary={mockSummary} loading={false} error={null} />)

    expect(screen.getByText('0')).toBeTruthy()
    expect(screen.getByText('0.00')).toBeTruthy()
  })

  it('prioritizes error over summary when both are provided', () => {
    const mockSummary = {
      total_sales: 100,
      total_revenue: 12345.67,
      period_start: '2024-06-01',
      period_end: '2024-06-30',
    }

    render(<DashboardSummary summary={mockSummary} loading={false} error="Some error" />)

    expect(screen.getByText('Some error')).toBeTruthy()
    expect(screen.queryByText('100')).toBeNull()
  })
})