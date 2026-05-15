import { useState } from 'react'
import TopProductsTable from '../components/TopProductsTable'
import { useTopProducts } from '../hooks/useDashboard'

export default function DashboardPage() {
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-01-31')
  const [limit, setLimit] = useState(5)

  const { products, loading, error, refetch } = useTopProducts(startDate, endDate, limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
              min="1"
              max="100"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <TopProductsTable products={products || []} loading={loading} error={error ? error.message : null} />
    </div>
  )
}