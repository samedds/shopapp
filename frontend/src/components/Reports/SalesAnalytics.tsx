import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Order, Product } from '../../types';

interface SalesAnalyticsProps {
  orders: Order[];
  products: Product[];
}

export function SalesAnalytics({ orders, products }: SalesAnalyticsProps) {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => new Date(order.timestamp).toDateString() === today);
  
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalTransactions = orders.length;
  const todayTransactions = todayOrders.length;
  
  const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
  const todayAverageValue = todayTransactions > 0 ? todaySales / todayTransactions : 0;

  const topSellingProducts = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.entries(topSellingProducts)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Sales Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Today: ${todaySales.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                <p className="text-xs text-gray-500 mt-1">Today: {todayTransactions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Today: ${todayAverageValue.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(topSellingProducts).reduce((sum, p) => sum + p.quantity, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total items sold</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sales data available</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map(([productId, product], index) => (
                <div key={productId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}