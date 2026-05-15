import { useState } from 'react'
import { SalesReportResponse, SalesReportRequest } from '../types/models'

interface ReportGeneratorProps {
  onGenerate: (data: SalesReportRequest) => void
  loading: boolean
  error: string | null
  report?: SalesReportResponse
}

export function ReportGenerator({ onGenerate, loading, error, report }: ReportGeneratorProps) {
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!start_date || !end_date) {
      setValidationError('start_date and end_date are required')
      return
    }

    onGenerate({ start_date, end_date })
  }

  return (
    <div className="report-generator">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
        </div>
        {validationError && <div className="error">{validationError}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {report && (
        <div className="report-data">
          <h3>Sales Report</h3>
          <p>Total Sales: {report.total_sales}</p>
          <p>Total Revenue: {report.total_revenue}</p>
          <h4>Top Products</h4>
          {report.top_products.length === 0 ? (
            <p>No products available</p>
          ) : (
            <ul>
              {report.top_products.map((product) => (
                <li key={product.product_id}>
                  {product.product_name} ({product.units_sold} units, {product.revenue} revenue)
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ReportGenerator