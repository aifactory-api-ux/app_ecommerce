import { useState } from 'react'
import api from '../../api/axios'
import DateRangePicker from '../../components/admin/DateRangePicker'

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

interface OrderRow {
  order_id: string
  order_date: string
  order_status: string
  customer_email: string
  product_name: string
  product_type: string
  quantity: number
  unit_price: number
  line_total: number
  order_total: number
}

export default function ReportsPage() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>('30days')
  const [dates, setDates] = useState(() => getDefaultDates('30days'))
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

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

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const params = { start_date: dates.start, end_date: dates.end }
      const response = await api.get('/admin/export/csv', {
        params,
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${dates.start}_${dates.end}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export CSV:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {exporting ? 'Exportando...' : '📥'} Exportar CSV
        </button>
      </div>

      <DateRangePicker
        startDate={dates.start}
        endDate={dates.end}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onPresetChange={handlePresetChange}
        selectedPreset={selectedPreset}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center py-12">
          Usa el botón "Exportar CSV" para descargar el reporte completo con todas las ventas
          del período seleccionado.
        </p>
      </div>
    </div>
  )
}