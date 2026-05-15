import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReportGenerator } from '../../src/components/ReportGenerator'

describe('ReportGenerator', () => {
  const defaultProps = {
    onGenerate: jest.fn(),
    loading: false,
    error: null,
    report: undefined,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls onGenerate with correct dates when form is submitted', async () => {
    render(<ReportGenerator {...defaultProps} />)

    const startDateInput = screen.getByLabelText(/start date/i)
    const endDateInput = screen.getByLabelText(/end date/i)
    const submitButton = screen.getByRole('button', { name: /generate report/i })

    fireEvent.change(startDateInput, { target: { value: '2024-06-01' } })
    fireEvent.change(endDateInput, { target: { value: '2024-06-30' } })
    fireEvent.click(submitButton)

    expect(defaultProps.onGenerate).toHaveBeenCalledWith({
      start_date: '2024-06-01',
      end_date: '2024-06-30',
    })
  })

  it('displays loading indicator when loadingReport is true', () => {
    render(<ReportGenerator {...defaultProps} loading={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button').textContent).toBe('Generating...')
  })

  it('renders sales report data when salesReport prop is provided', () => {
    const report = {
      total_sales: 100,
      total_revenue: 5000.0,
      top_products: [
        { product_id: 1, product_name: 'Product A', units_sold: 50, revenue: 2500.0 },
      ],
    }

    render(<ReportGenerator {...defaultProps} report={report} />)

    expect(screen.getByText(/total sales: 100/i)).toBeInTheDocument()
    expect(screen.getByText(/total revenue: 5000/i)).toBeInTheDocument()
    expect(screen.getByText(/product a/i)).toBeInTheDocument()
  })

  it('shows error message when errorReport prop is set', () => {
    render(<ReportGenerator {...defaultProps} error="Internal Server Error" />)

    expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
  })

  it('disables submit button when loadingReport is true', () => {
    render(<ReportGenerator {...defaultProps} loading={true} />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders empty state when salesReport.top_products is empty', () => {
    const report = {
      total_sales: 0,
      total_revenue: 0.0,
      top_products: [],
    }

    render(<ReportGenerator {...defaultProps} report={report} />)

    expect(screen.getByText(/no products available/i)).toBeInTheDocument()
  })

  it('validates required fields and shows validation error if missing', async () => {
    render(<ReportGenerator {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /generate report/i })
    fireEvent.click(submitButton)

    expect(screen.getByText(/start_date and end_date are required/i)).toBeInTheDocument()
    expect(defaultProps.onGenerate).not.toHaveBeenCalled()
  })
})