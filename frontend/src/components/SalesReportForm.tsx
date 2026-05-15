import { useState } from 'react'
import { SalesReportRequest } from '../types/models'

interface SalesReportFormProps {
  onSubmit: (params: SalesReportRequest) => void
  loading: boolean
}

export default function SalesReportForm({ onSubmit, loading }: SalesReportFormProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!startDate) {
      setError('start_date is required')
      return
    }

    if (!endDate) {
      setError('end_date is required')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('start_date must be before or equal to end_date')
      return
    }

    onSubmit({ start_date: startDate, end_date: endDate })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="start_date">Start Date (YYYY-MM-DD)</label>
        <input
          id="start_date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="end_date">End Date (YYYY-MM-DD)</label>
        <input
          id="end_date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Generate Report'}
      </button>
    </form>
  )
}