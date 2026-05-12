import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Product } from '../types'

export function useProducts(page: number = 1, perPage: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/api/products/?page=${page}&per_page=${perPage}`)
        setProducts(response.data)
      } catch (err) {
        setError('Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [page, perPage])

  return { products, total, isLoading, error }
}
