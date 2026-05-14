import { TopProduct } from '../types/models'

interface TopProductsTableProps {
  products: TopProduct[] | null
  loading?: boolean
  error?: string | null
}

export function TopProductsTable({ products, loading, error }: TopProductsTableProps) {
  if (loading) {
    return <div data-testid="loading">Loading...</div>
  }

  if (error) {
    return <div data-testid="error">{error}</div>
  }

  if (!products || products.length === 0) {
    return <div data-testid="empty">No products available</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Units Sold</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.product_id}>
            <td>{product.product_id}</td>
            <td>{product.product_name}</td>
            <td>{product.units_sold}</td>
            <td>{product.revenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}