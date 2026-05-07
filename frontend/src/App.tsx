"use client";

import React, { useState,useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Coffee, 
  ChefHat, 
  User, 
  Settings,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Check,
  Edit,
  Trash2, Menu, X, Package, BarChart3, AlertCircle, Users, Tag, FileText } from 'lucide-react';

import { Dashboard } from './components/Dashboard/Dashboard';
import { InventoryTabs } from './components/Inventory/InventoryTabs';
import { StockManagementTabs } from './components/StockManagement/StockManagementTabs';
import { POSTabs } from './components/POS/POSTabs';
import { Reports } from './components/Reports/Reports';
import { SyncStatusIndicator } from './components/SyncStatus';
import type { Product, StockMovement, Order, Category } from './types';
import { 
  productStorage, 
  stockMovementStorage, 
  orderStorage,
  categoryStorage,
  initializeDefaultData
} from './utils/offlineStorage';

type TabType = 'dashboard' | 'inventory' | 'stock' | 'pos' | 'reports';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize app and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize default data
        const data = initializeDefaultData();
        setProducts(data.products);
        setStockMovements(data.movements);
        setOrders(data.orders);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      productStorage.save(products);
    }
  }, [products]);

  useEffect(() => {
    if (stockMovements.length > 0) {
      stockMovementStorage.save(stockMovements);
    }
  }, [stockMovements]);

  useEffect(() => {
    if (orders.length > 0) {
      orderStorage.save(orders);
    }
  }, [orders]);

  useEffect(() => {
    if (categories.length > 0) {
      categoryStorage.save(categories);
    }
  }, [categories]);

  // Add to pending syncs for auto-sync
  const addToPendingSyncs = (type: string, action: string, data: any) => {
    try {
      const pendingSyncs = JSON.parse(localStorage.getItem('pending_syncs') || '[]');
      pendingSyncs.push({
        id: Date.now().toString(),
        type,
        action,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pending_syncs', JSON.stringify(pendingSyncs));
    } catch (error) {
      console.error('Error adding to pending syncs:', error);
    }
  };

  // Handle product changes
  const handleProductChange = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    
    // Add to sync queue
    updatedProducts.forEach(product => {
      const original = products.find(p => p.id === product.id);
      if (!original) {
        addToPendingSyncs('product', 'create', product);
      } else if (JSON.stringify(original) !== JSON.stringify(product)) {
        addToPendingSyncs('product', 'update', product);
      }
    });
  };

  // Handle category changes
  const handleCategoryChange = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    
    // Add to sync queue
    updatedCategories.forEach(category => {
      const original = categories.find(c => c.id === category.id);
      if (!original) {
        addToPendingSyncs('category', 'create', category);
      }
    });
  };

  // Handle stock movement
  const handleStockMovement = (movement: StockMovement) => {
    // Add movement to list
    setStockMovements(prev => [...prev, movement]);
    
    // Update product quantities
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        if (product.id === movement.productId) {
          const quantityChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
          const newQuantity = Math.max(0, product.quantity + quantityChange);
          
          const updatedProduct = {
            ...product,
            quantity: newQuantity
          };
          
          addToPendingSyncs('product', 'update', updatedProduct);
          return updatedProduct;
        }
        return product;
      });
    });
    
    // Add movement to sync queue
    addToPendingSyncs('stock_movement', 'create', movement);
  };

  // Handle order
  const handleOrder = (order: Order) => {
    // Add order to list
    setOrders(prev => [...prev, order]);
    
    // Update product quantities
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        const orderItem = order.items.find(item => item.productId === product.id);
        if (orderItem) {
          const newQuantity = Math.max(0, product.quantity - orderItem.quantity);
          
          const updatedProduct = {
            ...product,
            quantity: newQuantity
          };
          
          addToPendingSyncs('product', 'update', updatedProduct);
          return updatedProduct;
        }
        return product;
      });
    });
    
    // Add order to sync queue
    addToPendingSyncs('order', 'create', order);
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'inventory' as TabType, label: 'Inventory', icon: Package },
    { id: 'stock' as TabType, label: 'Stock', icon: TrendingUp },
    { id: 'pos' as TabType, label: 'POS', icon: ShoppingCart },
    { id: 'reports' as TabType, label: 'Reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="ml-4 text-xl font-bold text-gray-900">Supermarket Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <SyncStatusIndicator />
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white w-64 h-full shadow-lg">
              <div className="p-4 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="mb-4"
                >
                  <X className="h-6 w-6" />
                </Button>
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                products={products}
                stockMovements={stockMovements}
                orders={orders}
              />
            )}
            {activeTab === 'inventory' && (
              <InventoryTabs 
                products={products}
                categories={categories}
                onProductsChange={handleProductChange}
                onCategoriesChange={handleCategoryChange}
              />
            )}
            {activeTab === 'stock' && (
              <StockManagementTabs 
                products={products}
                stockMovements={stockMovements}
                onStockMovement={handleStockMovement}
              />
            )}
            {activeTab === 'pos' && (
              <POSTabs 
                products={products}
                onOrderComplete={handleOrder}
              />
            )}
            {activeTab === 'reports' && (
              <Reports 
                products={products}
                stockMovements={stockMovements}
                orders={orders}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}