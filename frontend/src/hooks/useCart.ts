import { useState, useEffect } from 'react'
import api from '../api/axios'
import { CartItem, Product } from '../types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/api/cart/')
      setItems(response.data)
    } catch (err) {
      setError('Failed to fetch cart')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addItem = async (productId: string, quantity: number = 1) => {
    await api.post('/api/cart/items', { product_id: productId, quantity })
    await fetchCart()
  }

  const updateItem = async (itemId: string, quantity: number) => {
    await api.put(`/api/cart/items/${itemId}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (itemId: string) => {
    await api.delete(`/api/cart/items/${itemId}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/api/cart/')
    setItems([])
  }

  return { items, isLoading, error, addItem, updateItem, removeItem, clearCart, refetch: fetchCart }
}
