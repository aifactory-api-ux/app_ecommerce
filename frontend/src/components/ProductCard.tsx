import { Link } from 'react-router-dom'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description || 'No description available'}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-indigo-600">${product.price}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">{product.product_type}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
