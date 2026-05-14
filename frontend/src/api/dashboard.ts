import axios from 'axios';
import { SalesSummary, TopProductsResponse } from '../types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:23010';

export const fetchSalesSummary = async (
  start_date: string,
  end_date: string
): Promise<SalesSummary> => {
  if (!start_date) {
    throw new Error('Missing required parameter: start_date');
  }
  if (!end_date) {
    throw new Error('Missing required parameter: end_date');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start_date)) {
    throw new Error('Invalid date format for start_date');
  }
  if (!dateRegex.test(end_date)) {
    throw new Error('Invalid date format for end_date');
  }

  try {
    const response = await axios.get<SalesSummary>(
      `${API_BASE_URL}/api/dashboard/sales-summary`,
      {
        params: { start_date, end_date },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Bad Request');
      }
      if (error.response.status === 500) {
        throw new Error('Internal Server Error');
      }
      throw new Error(error.response.data?.detail || 'Request failed');
    }
    throw error;
  }
};

export const fetchTopProducts = async (
  start_date: string,
  end_date: string,
  limit?: number
): Promise<TopProductsResponse> => {
  if (!start_date) {
    throw new Error('Missing required parameter: start_date');
  }
  if (!end_date) {
    throw new Error('Missing required parameter: end_date');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start_date)) {
    throw new Error('Invalid date format for start_date');
  }
  if (!dateRegex.test(end_date)) {
    throw new Error('Invalid date format for end_date');
  }
  if (limit !== undefined && limit <= 0) {
    throw new Error('Invalid limit: must be greater than 0');
  }

  try {
    const response = await axios.get<TopProductsResponse>(
      `${API_BASE_URL}/api/dashboard/top-products`,
      {
        params: { start_date, end_date, limit },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Bad Request');
      }
      if (error.response.status === 422) {
        throw new Error('Validation error');
      }
      if (error.response.status === 500) {
        throw new Error('Internal Server Error');
      }
      throw new Error(error.response.data?.detail || 'Request failed');
    }
    throw error;
  }
};