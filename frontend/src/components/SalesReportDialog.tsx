import { SalesReportResponse } from '../types/models'
import { X } from 'lucide-react'

interface SalesReportDialogProps {
  open: boolean
  onClose: () => void
  report: SalesReportResponse | null
  loading: boolean
  error?: string | null
}

export default function SalesReportDialog({
  open,
  onClose,
  report,
  loading,
  error
}: SalesReportDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Generando reporte...</span>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && report && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Reporte de Ventas</h2>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Resumen</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Ventas</p>
                  <p className="text-2xl font-bold text-blue-600">{report.summary.total_sales}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${report.summary.total_revenue.toLocaleString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Inicio</p>
                  <p className="text-lg">{report.summary.period_start}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha Fin</p>
                  <p className="text-lg">{report.summary.period_end}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Productos Más Vendidos</h3>
              {report.top_products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No se vendieron productos en este periodo</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">ID</th>
                        <th className="text-left py-2 px-3">Producto</th>
                        <th className="text-right py-2 px-3">Unidades</th>
                        <th className="text-right py-2 px-3">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.top_products.map((product, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">{product.product_id}</td>
                          <td className="py-2 px-3">{product.product_name}</td>
                          <td className="py-2 px-3 text-right">{product.units_sold}</td>
                          <td className="py-2 px-3 text-right">
                            ${product.revenue.toLocaleString('es-CO')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}