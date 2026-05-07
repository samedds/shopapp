export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  unit: string;
  minStock: number;
  supplier: string;
  sku: string;
  cost: number;
  photo: string | null;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  timestamp: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: number;
  paymentMethod: 'cash' | 'card' | 'other';
}