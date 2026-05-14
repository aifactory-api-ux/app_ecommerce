import { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import DashboardSummary from '../components/DashboardSummary'

export default function Dashboard() {
  const { salesSummary, loadingSummary, errorSummary, fetchSalesSummary } = useDashboard()

  useEffect(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const startDate = firstDay.toISOString().split('T')[0]
    const endDate = lastDay.toISOString().split('T')[0]

    fetchSalesSummary(startDate, endDate)
  }, [fetchSalesSummary])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardSummary
        summary={salesSummary}
        loading={loadingSummary}
        error={errorSummary}
      />
    </div>
  )
}