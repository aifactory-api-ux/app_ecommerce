import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminLayout from './AdminLayout'

const mockUser = {
  id: '1',
  email: 'admin@test.com',
  full_name: 'Admin User',
  is_active: true,
  is_verified: true,
  is_admin: true,
  created_at: '2026-01-01',
}

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: vi.fn(),
  }),
}))

describe('AdminLayout', () => {
  it('renders navigation items', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>
    )
    expect(screen.queryByText('Dashboard')).toBeTruthy()
  })

  it('renders user email', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>
    )
    expect(screen.queryByText('admin@test.com')).toBeTruthy()
  })

  it('renders Admin Panel title', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>
    )
    expect(screen.queryByText('Admin Panel')).toBeTruthy()
  })
})