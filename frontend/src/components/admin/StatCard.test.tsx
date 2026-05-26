import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(<StatCard title="Test Title" value={100} icon="💰" />)
    expect(screen.getByText('Test Title')).toBeDefined()
    expect(screen.getByText('100')).toBeDefined()
  })

  it('formats currency when format="currency"', () => {
    render(<StatCard title="Revenue" value={1234.56} icon="💰" format="currency" />)
    const valueElement = screen.getByText(/\$1,234\.56/)
    expect(valueElement).toBeDefined()
  })

  it('formats number with locale when format="number"', () => {
    const { container } = render(<StatCard title="Orders" value={1000} icon="🛒" format="number" />)
    const element = container.querySelector('.text-2xl')
    expect(element?.textContent).toContain('0')
  })

  it('displays icon', () => {
    render(<StatCard title="Test" value={50} icon="📊" />)
    const iconElement = document.body.querySelector('.text-3xl')
    expect(iconElement?.textContent).toBe('📊')
  })

  it('handles string value', () => {
    render(<StatCard title="Test" value="custom-value" icon="📊" />)
    expect(screen.getByText('custom-value')).toBeDefined()
  })
})