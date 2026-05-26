import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            E-Commerce
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-indigo-600">
              Products
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-indigo-600">
              Cart
            </Link>
            {isAuthenticated ? (
              <>
                {user?.is_admin && (
                  <Link to="/admin" className="text-indigo-600 font-medium hover:text-indigo-700">
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="text-gray-600 hover:text-indigo-600">
                  Orders
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-indigo-600">
                  {user?.email}
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
