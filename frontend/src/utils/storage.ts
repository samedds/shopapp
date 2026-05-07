import { Product, StockMovement, Order, Category } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'supermarket_products',
  STOCK_MOVEMENTS: 'supermarket_stock_movements',
  ORDERS: 'supermarket_orders',
  CATEGORIES: 'supermarket_categories',
} as const;

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'dairy', name: 'Dairy', color: 'bg-blue-100 text-blue-800' },
  { id: 'produce', name: 'Produce', color: 'bg-green-100 text-green-800' },
  { id: 'beverages', name: 'Beverages', color: 'bg-purple-100 text-purple-800' },
  { id: 'bakery', name: 'Bakery', color: 'bg-amber-100 text-amber-800' },
  { id: 'meat', name: 'Meat & Seafood', color: 'bg-red-100 text-red-800' },
  { id: 'frozen', name: 'Frozen Foods', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'pantry', name: 'Pantry', color: 'bg-orange-100 text-orange-800' },
  { id: 'snacks', name: 'Snacks', color: 'bg-pink-100 text-pink-800' },
  { id: 'household', name: 'Household', color: 'bg-gray-100 text-gray-800' },
  { id: 'personal', name: 'Personal Care', color: 'bg-indigo-100 text-indigo-800' },
];

// Products
export const loadProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// Stock Movements
export const loadStockMovements = (): StockMovement[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading stock movements:', error);
    return [];
  }
};

export const saveStockMovements = (movements: StockMovement[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(movements));
  } catch (error) {
    console.error('Error saving stock movements:', error);
  }
};

// Orders
export const loadOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

export const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

// Categories
export const loadCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (stored) {
      return JSON.parse(stored);
    }
    // If no categories stored, use defaults and save them
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error loading categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};