import { useState } from 'react'

type Preset = 'today' | '7days' | '30days' | 'year'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onPresetChange: (preset: Preset) => void
  selectedPreset: Preset | null
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPresetChange,
  selectedPreset,
}: DateRangePickerProps) {
  const presets: { label: string; value: Preset }[] = [
    { label: 'Hoy', value: 'today' },
    { label: '7 días', value: '7days' },
    { label: '30 días', value: '30days' },
    { label: 'Este año', value: 'year' },
  ]

  const getDateForPreset = (preset: Preset): { start: string; end: string } => {
    const today = new Date()
    const end = today.toISOString().split('T')[0]
    let start: string

    switch (preset) {
      case 'today':
        start = end
        break
      case '7days':
        start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]
        break
      case '30days':
        start = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0]
        break
      case 'year':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]
        break
      default:
        start = end
    }

    return { start, end }
  }

  const handlePresetClick = (preset: Preset) => {
    onPresetChange(preset)
    const { start, end } = getDateForPreset(preset)
    onStartDateChange(start)
    onEndDateChange(end)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Desde:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              onStartDateChange(e.target.value)
              onPresetChange(null)
            }}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Hasta:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              onEndDateChange(e.target.value)
              onPresetChange(null)
            }}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 border-l pl-4">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className={`px-3 py-2 text-sm rounded transition-colors ${
                selectedPreset === preset.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}