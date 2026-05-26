import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DateRangePicker from './DateRangePicker'

describe('DateRangePicker', () => {
  const defaultProps = {
    startDate: '2026-05-01',
    endDate: '2026-05-26',
    onStartDateChange: vi.fn(),
    onEndDateChange: vi.fn(),
    onPresetChange: vi.fn(),
    selectedPreset: null as string | null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders date inputs', () => {
    render(<DateRangePicker {...defaultProps} />)
    const inputs = document.body.querySelectorAll('input[type="date"]')
    expect(inputs.length).toBe(2)
  })

  it('renders preset buttons', () => {
    render(<DateRangePicker {...defaultProps} />)
    expect(screen.getByText('Hoy')).toBeDefined()
    expect(screen.getByText('7 días')).toBeDefined()
    expect(screen.getByText('30 días')).toBeDefined()
    expect(screen.getByText('Este año')).toBeDefined()
  })

  it('calls onStartDateChange when start date changes', () => {
    render(<DateRangePicker {...defaultProps} />)
    const startInput = document.body.querySelectorAll('input[type="date"]')[0]
    fireEvent.change(startInput, { target: { value: '2026-05-15' } })
    expect(defaultProps.onStartDateChange).toHaveBeenCalledWith('2026-05-15')
  })

  it('calls onEndDateChange when end date changes', () => {
    render(<DateRangePicker {...defaultProps} />)
    const endInput = document.body.querySelectorAll('input[type="date"]')[1]
    fireEvent.change(endInput, { target: { value: '2026-05-20' } })
    expect(defaultProps.onEndDateChange).toHaveBeenCalledWith('2026-05-20')
  })

  it('calls onPresetChange with correct preset on button click', () => {
    render(<DateRangePicker {...defaultProps} />)
    fireEvent.click(screen.getByText('7 días'))
    expect(defaultProps.onPresetChange).toHaveBeenCalledWith('7days')
  })

  it('calls onStartDateChange and onEndDateChange with dates for today preset', () => {
    render(<DateRangePicker {...defaultProps} />)
    fireEvent.click(screen.getByText('Hoy'))
    expect(defaultProps.onStartDateChange).toHaveBeenCalled()
    expect(defaultProps.onEndDateChange).toHaveBeenCalled()
  })

  it('calls onStartDateChange and onEndDateChange with dates for 7days preset', () => {
    render(<DateRangePicker {...defaultProps} />)
    fireEvent.click(screen.getByText('7 días'))
    expect(defaultProps.onStartDateChange).toHaveBeenCalled()
    expect(defaultProps.onEndDateChange).toHaveBeenCalled()
  })

  it('calls onStartDateChange and onEndDateChange with dates for 30days preset', () => {
    render(<DateRangePicker {...defaultProps} />)
    fireEvent.click(screen.getByText('30 días'))
    expect(defaultProps.onStartDateChange).toHaveBeenCalled()
    expect(defaultProps.onEndDateChange).toHaveBeenCalled()
  })

  it('calls onStartDateChange and onEndDateChange with dates for year preset', () => {
    render(<DateRangePicker {...defaultProps} />)
    fireEvent.click(screen.getByText('Este año'))
    expect(defaultProps.onStartDateChange).toHaveBeenCalled()
    expect(defaultProps.onEndDateChange).toHaveBeenCalled()
  })

  it('calls onPresetChange with null when manual date input changes', () => {
    render(<DateRangePicker {...defaultProps} />)
    const startInput = document.body.querySelectorAll('input[type="date"]')[0]
    fireEvent.change(startInput, { target: { value: '2026-05-10' } })
    expect(defaultProps.onPresetChange).toHaveBeenCalledWith(null)
  })
})