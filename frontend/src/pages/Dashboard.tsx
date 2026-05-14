import { useDashboard } from '../hooks/useDashboard'
import { TopProductsTable } from '../components/TopProductsTable'

export default function Dashboard() {
  const { topProducts, topProductsLoading, topProductsError, fetchTopProducts } = useDashboard({
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    limit: 5,
  })

  return (
    <div>
      <h1>Dashboard</h1>
      <TopProductsTable products={topProducts} loading={topProductsLoading} error={topProductsError} />
    </div>
  )
}