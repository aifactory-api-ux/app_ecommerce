export interface User {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  is_verified: boolean
  is_admin?: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  product_type: 'software' | 'license' | 'download' | 'subscription'
  file_url: string | null
  is_active: boolean
  stock: number
  created_at: string
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  created_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  license_key: string | null
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  total_amount: number
  payment_method: string | null
  payment_reference: string | null
  created_at: string
  items: OrderItem[]
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface SalesSummary {
  total_orders: number
  total_revenue: number
  total_products_sold: number
}

export interface TopProduct {
  product_name: string
  quantity_sold: number
  revenue: number
}

export interface SalesDataPoint {
  date: string
  orders_count: number
  revenue: number
}
