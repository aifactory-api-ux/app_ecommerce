import { ProductStat } from '../types/models'

interface TopProductsTableProps {
  products: ProductStat[]
  loading: boolean
  error: string | null
}

export default function TopProductsTable({ products, loading, error }: TopProductsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Top Products</h2>
      {products.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No products found</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Product</th>
              <th className="text-right py-2 px-4">Units Sold</th>
              <th className="text-right py-2 px-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id} className="border-b last:border-b-0">
                <td className="py-3 px-4">{product.product_name}</td>
                <td className="text-right py-3 px-4">{product.units_sold}</td>
                <td className="text-right py-3 px-4">${product.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}