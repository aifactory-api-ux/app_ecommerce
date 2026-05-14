import { useState, useCallback } from 'react';
import { fetchSalesSummary, fetchTopProducts } from '../api/dashboard';
import { SalesSummary, TopProduct, TopProductsResponse } from '../types/models';

interface UseDashboardReturn {
  salesSummary: SalesSummary | null;
  topProducts: TopProduct[];
  salesReport: any | null;
  loadingSummary: boolean;
  loadingTopProducts: boolean;
  loadingReport: boolean;
  errorSummary: string | null;
  errorTopProducts: string | null;
  errorReport: string | null;
  fetchSalesSummary: (startDate: string, endDate: string) => Promise<void>;
  fetchTopProducts: (startDate: string, endDate: string, limit?: number) => Promise<void>;
  generateSalesReport: (startDate: string, endDate: string) => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesReport, setSalesReport] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTopProducts, setLoadingTopProducts] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [errorTopProducts, setErrorTopProducts] = useState<string | null>(null);
  const [errorReport, setErrorReport] = useState<string | null>(null);

  const fetchSalesSummaryFn = useCallback(async (startDate: string, endDate: string) => {
    setErrorSummary(null);
    setLoadingSummary(true);
    try {
      const result = await fetchSalesSummary(startDate, endDate);
      setSalesSummary(result);
    } catch (error: any) {
      setErrorSummary(error.message || 'An error occurred');
      setSalesSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const fetchTopProductsFn = useCallback(async (startDate: string, endDate: string, limit?: number) => {
    setErrorTopProducts(null);
    setLoadingTopProducts(true);
    try {
      const result = await fetchTopProducts(startDate, endDate, limit);
      setTopProducts(result.products);
    } catch (error: any) {
      setErrorTopProducts(error.message || 'An error occurred');
      setTopProducts([]);
    } finally {
      setLoadingTopProducts(false);
    }
  }, []);

  const generateSalesReport = useCallback(async (startDate: string, endDate: string) => {
    setErrorReport(null);
    setLoadingReport(true);
    try {
      setSalesReport(null);
    } catch (error: any) {
      setErrorReport(error.message || 'An error occurred');
      setSalesReport(null);
    } finally {
      setLoadingReport(false);
    }
  }, []);

  return {
    salesSummary,
    topProducts,
    salesReport,
    loadingSummary,
    loadingTopProducts,
    loadingReport,
    errorSummary,
    errorTopProducts,
    errorReport,
    fetchSalesSummary: fetchSalesSummaryFn,
    fetchTopProducts: fetchTopProductsFn,
    generateSalesReport,
  };
}