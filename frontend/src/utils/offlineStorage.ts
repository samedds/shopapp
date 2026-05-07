import type  { Product, StockMovement, Order, Category } from '../types';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'supermarket_products',
  STOCK_MOVEMENTS: 'supermarket_stock_movements',
  ORDERS: 'supermarket_orders',
  CATEGORIES: 'supermarket_categories',
  PENDING_SYNC: 'supermarket_pending_sync',
  LAST_SYNC: 'supermarket_last_sync'
};

// Default categories
const defaultCategories: Category[] = [
  { id: 'dairy', name: 'Dairy', color: 'bg-blue-100 text-blue-800' },
  { id: 'produce', name: 'Produce', color: 'bg-green-100 text-green-800' },
  { id: 'beverage', name: 'Beverage', color: 'bg-purple-100 text-purple-800' },
  { id: 'bakery', name: 'Bakery', color: 'bg-amber-100 text-amber-800' },
  { id: 'meat', name: 'Meat', color: 'bg-red-100 text-red-800' },
  { id: 'frozen', name: 'Frozen', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'pantry', name: 'Pantry', color: 'bg-gray-100 text-gray-800' },
];

// Product storage
export const productStorage = {
  load: (): Product[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  },

  save: (products: Product[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }
};

// Category storage
export const categoryStorage = {
  load: (): Category[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : defaultCategories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return defaultCategories;
    }
  },

  save: (categories: Category[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }
};

// Stock movement storage
export const stockMovementStorage = {
  load: (): StockMovement[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading stock movements:', error);
      return [];
    }
  },

  save: (movements: StockMovement[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(movements));
    } catch (error) {
      console.error('Error saving stock movements:', error);
    }
  }
};

// Order storage
export const orderStorage = {
  load: (): Order[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  },

  save: (orders: Order[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }
};

// Sync storage
export const syncStorage = {
  loadPendingSync: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading pending sync:', error);
      return [];
    }
  },

  savePendingSync: (pendingSync: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pendingSync));
    } catch (error) {
      console.error('Error saving pending sync:', error);
    }
  },

  addPendingSync: (type: string, action: string, data: any) => {
    const pendingSync = syncStorage.loadPendingSync();
    pendingSync.push({
      id: Date.now().toString(),
      type,
      action,
      data,
      timestamp: Date.now()
    });
    syncStorage.savePendingSync(pendingSync);
  },

  clearPendingSync: () => {
    localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
  },

  getLastSync: (): number | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return data ? parseInt(data) : null;
    } catch (error) {
      console.error('Error loading last sync:', error);
      return null;
    }
  },

  setLastSync: (timestamp: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('Error saving last sync:', error);
    }
  }
};

// Initialize default data
export const initializeDefaultData = () => {
  const products = productStorage.load();
  const movements = stockMovementStorage.load();
  const orders = orderStorage.load();
  const categories = categoryStorage.load();

  // If no products exist, create some sample data
  if (products.length === 0) {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Milk',
        quantity: 50,
        price: 3.99,
        category: 'dairy',
        unit: 'liters',
        minStock: 10,
        supplier: 'Dairy Farm Co.',
        sku: 'MILK001',
        cost: 2.50,
        photo: null
      },
      {
        id: '2',
        name: 'Bread',
        quantity: 30,
        price: 2.49,
        category: 'bakery',
        unit: 'pcs',
        minStock: 5,
        supplier: 'Local Bakery',
        sku: 'BREAD001',
        cost: 1.20,
        photo: null
      },
      {
        id: '3',
        name: 'Apples',
        quantity: 100,
        price: 4.99,
        category: 'produce',
        unit: 'kg',
        minStock: 20,
        supplier: 'Fresh Farms',
        sku: 'APPLE001',
        cost: 3.00,
        photo: null
      }
    ];
    productStorage.save(sampleProducts);
    return { products: sampleProducts, movements, orders, categories };
  }

  return { products, movements, orders, categories };
};