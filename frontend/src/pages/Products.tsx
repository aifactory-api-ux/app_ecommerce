import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-gray-500 text-center py-10">No products available</p>
      )}
    </div>
  )
}
