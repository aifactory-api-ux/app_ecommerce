import { useState } from 'react'
import { useAdminStats } from '../../hooks/useAdminStats'
import StatCard from '../../components/admin/StatCard'
import DateRangePicker from '../../components/admin/DateRangePicker'
import SalesChart from '../../components/admin/SalesChart'
import TopProductsChart from '../../components/admin/TopProductsChart'

type Preset = 'today' | '7days' | '30days' | 'year'

function getDefaultDates(preset: Preset): { start: string; end: string } {
  const today = new Date()
  const end = today.toISOString().split('T')[0]

  switch (preset) {
    case 'today':
      return { start: end, end }
    case '7days':
      return {
        start: new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }
    case '30days':
      return {
        start: new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }
    case 'year':
      return {
        start: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }
    default:
      return { start: end, end }
  }
}

export default function AdminDashboard() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>('30days')
  const [dates, setDates] = useState(() => getDefaultDates('30days'))

  const { summary, topProducts, salesHistory, loading, error } = useAdminStats(
    dates.start,
    dates.end
  )

  const handleStartDateChange = (date: string) => {
    setDates((d) => ({ ...d, start: date }))
  }

  const handleEndDateChange = (date: string) => {
    setDates((d) => ({ ...d, end: date }))
  }

  const handlePresetChange = (preset: Preset | null) => {
    if (preset) {
      setSelectedPreset(preset)
      const newDates = getDefaultDates(preset)
      setDates(newDates)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <DateRangePicker
        startDate={dates.start}
        endDate={dates.end}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onPresetChange={handlePresetChange}
        selectedPreset={selectedPreset}
      />

      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Cargando estadísticas...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Ventas Totales"
              value={summary.total_orders}
              icon="🛒"
              format="number"
            />
            <StatCard
              title="Ingresos Totales"
              value={summary.total_revenue}
              icon="💰"
              format="currency"
            />
            <StatCard
              title="Productos Vendidos"
              value={summary.total_products_sold}
              icon="📦"
              format="number"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={salesHistory} />
            <TopProductsChart data={topProducts} />
          </div>
        </>
      )}
    </div>
  )
}