import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'
import { useDashboard } from '../hooks/useDashboard'
import { SalesReportRequest } from '../types/models'

interface SalesReportDialogProps {
  open: boolean
  onClose: () => void
  onGenerate: (req: SalesReportRequest) => void
  loading: boolean
  error: string | null
  lastReport: SalesReportResponse | null
}

interface SalesReportResponse {
  summary: {
    total_sales: number
    total_revenue: number
    period_start: string
    period_end: string
  }
  top_products: Array<{
    product_id: number
    product_name: string
    units_sold: number
    revenue: number
  }>
}

export function SalesReportDialog({ open, onClose, loading, error, lastReport }: SalesReportDialogProps) {
  const { generateSalesReport } = useDashboard()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setLocalError('Both start date and end date are required')
      return
    }

    setLocalError(null)

    try {
      await generateSalesReport({
        start_date: startDate,
        end_date: endDate
      })
    } catch (err: any) {
      setLocalError(err.message)
    }
  }

  const handleClose = () => {
    setStartDate('')
    setEndDate('')
    setLocalError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Generate Sales Report</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        {(error || localError) && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error || localError}
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {lastReport && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography>Total Sales: {lastReport.summary.total_sales}</Typography>
              <Typography>Total Revenue: ${lastReport.summary.total_revenue.toFixed(2)}</Typography>
              <Typography>Period: {lastReport.summary.period_start} to {lastReport.summary.period_end}</Typography>
            </Box>

            {lastReport.top_products.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>Top Products</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Units Sold</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lastReport.top_products.map((product) => (
                      <TableRow key={product.product_id}>
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell align="right">{product.units_sold}</TableCell>
                        <TableCell align="right">${product.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleGenerate} disabled={loading || !startDate || !endDate}>
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  )
}