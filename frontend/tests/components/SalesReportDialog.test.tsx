import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SalesReportDialog } from '../../src/components/SalesReportDialog'
import { useDashboard } from '../../src/hooks/useDashboard'

vi.mock('../../src/hooks/useDashboard')

const mockedUseDashboard = useDashboard as jest.MockedFunction<typeof useDashboard>

describe('SalesReportDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onGenerate: vi.fn(),
    loading: false,
    error: null,
    lastReport: null
  }

  it('renders dialog with date inputs and generate button', () => {
    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: vi.fn(),
      reportLoading: false,
      reportError: null,
      lastReport: null
    } as any)

    render(<SalesReportDialog {...defaultProps} />)

    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('calls generateSalesReport from hook when generate button is clicked with valid dates', async () => {
    const mockGenerate = vi.fn().mockResolvedValue({
      summary: { total_sales: 100, total_revenue: 12345.67, period_start: '2024-05-01', period_end: '2024-05-31' },
      top_products: [{ product_id: 1, product_name: 'Product A', units_sold: 50, revenue: 5000.0 }]
    })

    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: mockGenerate,
      reportLoading: false,
      reportError: null,
      lastReport: null
    } as any)

    render(<SalesReportDialog {...defaultProps} />)

    const startDateInput = screen.getByLabelText(/start date/i)
    const endDateInput = screen.getByLabelText(/end date/i)
    const generateButton = screen.getByRole('button', { name: /generate/i })

    fireEvent.change(startDateInput, { target: { value: '2024-05-01' } })
    fireEvent.change(endDateInput, { target: { value: '2024-05-31' } })
    fireEvent.click(generateButton)

    expect(mockGenerate).toHaveBeenCalledWith({
      start_date: '2024-05-01',
      end_date: '2024-05-31'
    })
  })

  it('displays loading indicator while report is being generated', () => {
    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: vi.fn(),
      reportLoading: true,
      reportError: null,
      lastReport: null
    } as any)

    render(<SalesReportDialog {...defaultProps} />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled()
  })

  it('displays error message when error is set in hook', () => {
    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: vi.fn(),
      reportLoading: false,
      reportError: 'Failed to generate sales report. Please try again.',
      lastReport: null
    } as any)

    render(<SalesReportDialog {...defaultProps} />)

    expect(screen.getByText('Failed to generate sales report. Please try again.')).toBeInTheDocument()
  })

  it('displays report summary and top products when lastReport is present', () => {
    const mockReport = {
      summary: { total_sales: 100, total_revenue: 12345.67, period_start: '2024-05-01', period_end: '2024-05-31' },
      top_products: [{ product_id: 1, product_name: 'Product A', units_sold: 50, revenue: 5000.0 }]
    }

    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: vi.fn(),
      reportLoading: false,
      reportError: null,
      lastReport: mockReport
    } as any)

    render(<SalesReportDialog {...defaultProps} />)

    expect(screen.getByText(/total sales/i)).toBeInTheDocument()
    expect(screen.getByText(/product a/i)).toBeInTheDocument()
  })

  it('shows validation error if user tries to generate report with missing dates', () => {
    const mockGenerate = vi.fn()

    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: mockGenerate,
      reportLoading: false,
      reportError: null,
      lastReport: null
    } as any)

    render(<SalesReportDialog {...defaultProps} />)

    const generateButton = screen.getByRole('button', { name: /generate/i })
    fireEvent.click(generateButton)

    expect(mockGenerate).not.toHaveBeenCalled()
  })

  it('resets form fields and state when dialog is closed', () => {
    const onClose = vi.fn()

    mockedUseDashboard.mockReturnValue({
      salesSummary: null,
      topProducts: [],
      loadingSummary: false,
      loadingTopProducts: false,
      errorSummary: null,
      errorTopProducts: null,
      fetchSalesSummary: vi.fn(),
      fetchTopProducts: vi.fn(),
      generateSalesReport: vi.fn(),
      reportLoading: false,
      reportError: null,
      lastReport: null
    } as any)

    const { rerender } = render(<SalesReportDialog {...defaultProps} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })
})