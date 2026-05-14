import { SalesSummary } from '../types/models';

interface DashboardSummaryProps {
  summary: SalesSummary | null;
  loading: boolean;
  error: string | null;
}

export default function DashboardSummary({ summary, loading, error }: DashboardSummaryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Sales Summary</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">{summary.total_sales}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">${summary.total_revenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Period</p>
          <p className="text-lg">
            {summary.period_start} to {summary.period_end}
          </p>
        </div>
      </div>
    </div>
  );
}