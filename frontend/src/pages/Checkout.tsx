import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      await api.post('/api/orders/checkout')
      navigate('/orders')
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          This is a simulated checkout. Click below to complete your order.
        </p>
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Complete Order (Simulated)'}
        </button>
      </div>
    </div>
  )
}
