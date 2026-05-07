import { Product, StockMovement, Category, Order } from '../types';

interface AppData {
  products: Product[];
  stockMovements: StockMovement[];
  categories: Category[];
  orders: Order[];
}

export const saveToLocalStorage = (data: AppData) => {
  try {
    localStorage.setItem('supermarket-data', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): AppData | null => {
  try {
    const data = localStorage.getItem('supermarket-data');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};