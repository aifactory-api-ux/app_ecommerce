import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/reports', label: 'Reportes', icon: '📈' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-indigo-400">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span>🏠</span>
            <span>Volver al sitio</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-2"
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}