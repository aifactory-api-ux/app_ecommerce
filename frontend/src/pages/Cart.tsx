import { useCart } from '../hooks/useCart'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, isLoading, updateItem, removeItem, clearCart } = useCart()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/products" className="text-indigo-600 hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Product ID: {item.product_id}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Link
              to="/checkout"
              className="flex-1 bg-indigo-600 text-white py-3 text-center rounded-md hover:bg-indigo-700"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              className="text-red-600 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}
