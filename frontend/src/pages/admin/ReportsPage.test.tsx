import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReportsPage from './ReportsPage'

describe('ReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title "Reportes"', () => {
    render(
      <MemoryRouter>
        <ReportsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Reportes')).toBeDefined()
  })

  it('renders DateRangePicker', () => {
    render(
      <MemoryRouter>
        <ReportsPage />
      </MemoryRouter>
    )

    expect(document.body.querySelector('input[type="date"]')).toBeDefined()
  })

  it('renders Export CSV button', () => {
    render(
      <MemoryRouter>
        <ReportsPage />
      </MemoryRouter>
    )

    const buttons = document.body.querySelectorAll('button')
    const exportButton = Array.from(buttons).find(b => b.textContent?.includes('Exportar'))
    expect(exportButton).toBeDefined()
  })
})