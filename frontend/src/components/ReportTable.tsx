import { SalesReportResponse } from '../types/models'

interface ReportTableProps {
  report: SalesReportResponse | null
  loading: boolean
}

export default function ReportTable({ report, loading }: ReportTableProps) {
  if (loading) {
    return <div>Loading...</div>
  }

  if (!report) {
    return <div>No report data</div>
  }

  const { summary, top_products } = report

  return (
    <div>
      <div>
        <h3>Summary</h3>
        <p>Total Sales: {summary.total_sales}</p>
        <p>Total Revenue: {summary.total_revenue.toFixed(2)}</p>
        <p>Period: {summary.period_start} to {summary.period_end}</p>
      </div>

      <div>
        <h3>Top Products</h3>
        {top_products.length === 0 ? (
          <p>No products found</p>
        ) : (
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
              {top_products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.units_sold}</td>
                  <td>{product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}