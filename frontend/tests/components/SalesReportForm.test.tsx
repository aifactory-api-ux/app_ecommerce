import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SalesReportForm from '../../src/components/SalesReportForm'

vi.mock('../../src/hooks/useDashboard', () => ({
  useSalesReport: () => ({
    generateReport: vi.fn(),
    data: undefined,
    loading: false,
    error: null,
  }),
}))

describe('SalesReportForm', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits valid date range and triggers useSalesReport with correct parameters', async () => {
    const mockGenerateReport = vi.fn().mockResolvedValue({
      summary: { total_sales: 100, total_revenue: 5000, period_start: '2024-06-01', period_end: '2024-06-30' },
      top_products: [],
    })

    vi.mock('../../src/hooks/useDashboard', () => ({
      useSalesReport: () => ({
        generateReport: mockGenerateReport,
        data: undefined,
        loading: false,
        error: null,
      }),
    }))

    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const startDateInput = screen.getByLabelText(/start date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    const endDateInput = screen.getByLabelText(/end date/i) || screen.getByPlaceholderText('YYYY-MM-DD')

    if (startDateInput) fireEvent.change(startDateInput, { target: { value: '2024-06-01' } })
    if (endDateInput) fireEvent.change(endDateInput, { target: { value: '2024-06-30' } })

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith({
        start_date: '2024-06-01',
        end_date: '2024-06-30',
      })
    })
  })

  it('shows validation error when start_date is missing', async () => {
    const mockGenerateReport = vi.fn()
    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const endDateInput = screen.getByLabelText(/end date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    if (endDateInput) fireEvent.change(endDateInput, { target: { value: '2024-06-30' } })

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockGenerateReport).not.toHaveBeenCalled()
    })
  })

  it('shows validation error when end_date is missing', async () => {
    const mockGenerateReport = vi.fn()
    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const startDateInput = screen.getByLabelText(/start date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    if (startDateInput) fireEvent.change(startDateInput, { target: { value: '2024-06-01' } })

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockGenerateReport).not.toHaveBeenCalled()
    })
  })

  it('shows validation error when start_date is after end_date', async () => {
    const mockGenerateReport = vi.fn()
    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const startDateInput = screen.getByLabelText(/start date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    const endDateInput = screen.getByLabelText(/end date/i) || screen.getByPlaceholderText('YYYY-MM-DD')

    if (startDateInput) fireEvent.change(startDateInput, { target: { value: '2024-07-01' } })
    if (endDateInput) fireEvent.change(endDateInput, { target: { value: '2024-06-30' } })

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockGenerateReport).not.toHaveBeenCalled()
    })
  })

  it('disables submit button while loading', () => {
    const mockGenerateReport = vi.fn()
    render(<SalesReportForm onSubmit={mockGenerateReport} loading={true} />)

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i }) as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })

  it('shows API error message if error prop is set', async () => {
    const mockError = new Error('Request failed with status code 400')
    const mockGenerateReport = vi.fn().mockRejectedValue(mockError)

    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const startDateInput = screen.getByLabelText(/start date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    const endDateInput = screen.getByLabelText(/end date/i) || screen.getByPlaceholderText('YYYY-MM-DD')

    if (startDateInput) fireEvent.change(startDateInput, { target: { value: '2024-06-01' } })
    if (endDateInput) fireEvent.change(endDateInput, { target: { value: '2024-06-30' } })

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText(/request failed/i)).toBeTruthy()
    })
  })

  it('submits minimum valid date range (single-day report)', async () => {
    const mockGenerateReport = vi.fn().mockResolvedValue({
      summary: { total_sales: 10, total_revenue: 1000, period_start: '2024-06-15', period_end: '2024-06-15' },
      top_products: [{ product_id: 2, product_name: 'Producto B', units_sold: 10, revenue: 1000.0 }],
    })

    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const startDateInput = screen.getByLabelText(/start date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    const endDateInput = screen.getByLabelText(/end date/i) || screen.getByPlaceholderText('YYYY-MM-DD')

    if (startDateInput) fireEvent.change(startDateInput, { target: { value: '2024-06-15' } })
    if (endDateInput) fireEvent.change(endDateInput, { target: { value: '2024-06-15' } })

    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalledWith({
        start_date: '2024-06-15',
        end_date: '2024-06-15',
      })
    })
  })

  it('renders form with start_date and end_date inputs and submit button', () => {
    const mockGenerateReport = vi.fn()
    render(<SalesReportForm onSubmit={mockGenerateReport} loading={false} />)

    const startDateInput = screen.getByLabelText(/start date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    const endDateInput = screen.getByLabelText(/end date/i) || screen.getByPlaceholderText('YYYY-MM-DD')
    const submitButton = screen.getByRole('button', { name: /submit|generate|search/i })

    expect(startDateInput).toBeTruthy()
    expect(endDateInput).toBeTruthy()
    expect(submitButton).toBeTruthy()
  })
})