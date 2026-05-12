import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { Order } from '../types'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/orders/${id}`)
        setOrder(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (!order) return <div>Order not found</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order #{order.id.slice(0, 8)}</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="font-medium text-gray-500">Status</h2>
          <p className="text-lg">{order.status}</p>
        </div>
        <div>
          <h2 className="font-medium text-gray-500">Total</h2>
          <p className="text-2xl font-bold">${order.total_amount}</p>
        </div>
        <div>
          <h2 className="font-medium text-gray-500 mb-2">Items</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="border rounded p-3">
                <p>Product ID: {item.product_id}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Unit Price: ${item.unit_price}</p>
                {item.license_key && (
                  <div className="mt-2 p-2 bg-green-50 rounded">
                    <p className="text-sm text-green-700">License: {item.license_key}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
