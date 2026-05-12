import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { Product } from '../types'
import { useCart } from '../hooks/useCart'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${slug}`)
        setProduct(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <span className="text-sm px-2 py-1 bg-gray-100 rounded">{product.product_type}</span>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-3xl font-bold text-indigo-600 mt-6">${product.price}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
