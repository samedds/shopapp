import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Download, Printer, Calendar, TrendingUp, DollarSign, Package, BarChart3, PieChart } from 'lucide-react';
import type { Product, StockMovement, Order } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ReportsProps {
  products: Product[];
  stockMovements: StockMovement[];
  orders: Order[];
}

export function Reports({ products, stockMovements, orders }: ReportsProps) {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('7days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate date range
  useEffect(() => {
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    setEndDate(end);

    let start = new Date();
    switch (dateRange) {
      case '7days':
        start.setDate(now.getDate() - 7);
        break;
      case '30days':
        start.setDate(now.getDate() - 30);
        break;
      case '90days':
        start.setDate(now.getDate() - 90);
        break;
      case '1year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setDate(now.getDate() - 7);
    }
    setStartDate(start.toISOString().split('T')[0]);
  }, [dateRange]);

  // Filter data by date range
  const filteredMovements = stockMovements.filter(m => {
    const movementDate = new Date(m.timestamp);
    return movementDate >= new Date(startDate) && movementDate <= new Date(endDate + 'T23:59:59');
  });

  const filteredOrders = orders.filter(o => {
    const orderDate = new Date(o.timestamp);
    return orderDate >= new Date(startDate) && orderDate <= new Date(endDate + 'T23:59:59');
  });

  // Generate inventory report data
  const getInventoryReport = () => {
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const totalCost = products.reduce((sum, p) => sum + (p.quantity * p.cost), 0);
    const totalProfit = totalValue - totalCost;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;

    return {
      totalProducts: products.length,
      totalValue,
      totalCost,
      totalProfit,
      outOfStock,
      lowStock,
      inStock: products.length - outOfStock - lowStock
    };
  };

  // Generate sales report data
  const getSalesReport = () => {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalTax = filteredOrders.reduce((sum, o) => sum + o.tax, 0);
    const netRevenue = totalRevenue - totalTax;
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Sales by day
    const salesByDay = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0 };
      }
      acc[date].revenue += order.total;
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, { date: string; revenue: number; orders: number }>);

    return {
      totalRevenue,
      totalTax,
      netRevenue,
      totalOrders,
      avgOrderValue,
      salesByDay: Object.values(salesByDay).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  };

  // Generate stock movement report
  const getStockMovementReport = () => {
    const stockIn = filteredMovements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
    const stockOut = filteredMovements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0);
    const netMovement = stockIn - stockOut;

    // Movement by product
    const movementByProduct = filteredMovements.reduce((acc, movement) => {
      if (!acc[movement.productId]) {
        acc[movement.productId] = {
          productName: movement.productName,
          in: 0,
          out: 0
        };
      }
      if (movement.type === 'in') {
        acc[movement.productId].in += movement.quantity;
      } else {
        acc[movement.productId].out += movement.quantity;
      }
      return acc;
    }, {} as Record<string, { productName: string; in: number; out: number }>);

    return {
      stockIn,
      stockOut,
      netMovement,
      movementByProduct: Object.values(movementByProduct).sort((a, b) => (b.in + b.out) - (a.in + a.out)).slice(0, 10)
    };
  };

  const inventoryReport = getInventoryReport();
  const salesReport = getSalesReport();
  const stockMovementReport = getStockMovementReport();

  // Export to Excel function
  const exportToExcel = () => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'inventory':
        filename = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
        csvContent = 'Product Name,SKU,Category,Quantity,Unit,Price,Cost,Total Value,Min Stock,Status\n';
        products.forEach(product => {
          const status = product.quantity === 0 ? 'Out of Stock' : 
                        product.quantity <= product.minStock ? 'Low Stock' : 'In Stock';
          csvContent += `"${product.name}","${product.sku}","${product.category}",${product.quantity},"${product.unit}",${product.price},${product.cost},${product.quantity * product.price},${product.minStock},"${status}"\n`;
        });
        break;

      case 'sales':
        filename = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
        csvContent = 'Order ID,Date,Items Count,Subtotal,Tax,Total\n';
        filteredOrders.forEach(order => {
          csvContent += `"${order.id}","${new Date(order.timestamp).toLocaleString()}",${order.items.length},${order.subtotal},${order.tax},${order.total}\n`;
        });
        break;

      case 'stock':
        filename = `stock_movement_report_${new Date().toISOString().split('T')[0]}.csv`;
        csvContent = 'Date,Product Name,Type,Quantity,Reason\n';
        filteredMovements.forEach(movement => {
          csvContent += `"${new Date(movement.timestamp).toLocaleString()}","${movement.productName}","${movement.type}",${movement.quantity},"${movement.reason}"\n`;
        });
        break;
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Pie chart colors
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="stock">Stock Movement Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {reportType === 'inventory' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryReport.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${inventoryReport.totalValue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${inventoryReport.totalProfit.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Stock Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryReport.outOfStock + inventoryReport.lowStock}</div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Status Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Stock Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'In Stock', value: inventoryReport.inStock },
                        { name: 'Low Stock', value: inventoryReport.lowStock },
                        { name: 'Out of Stock', value: inventoryReport.outOfStock }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'In Stock', value: inventoryReport.inStock },
                        { name: 'Low Stock', value: inventoryReport.lowStock },
                        { name: 'Out of Stock', value: inventoryReport.outOfStock }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products by Value */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
                    .slice(0, 5)
                    .map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <span className="font-medium">${(product.quantity * product.price).toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {reportType === 'sales' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesReport.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesReport.totalOrders}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Avg Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesReport.avgOrderValue.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Net Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${salesReport.netRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesReport.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {reportType === 'stock' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Stock In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockMovementReport.stockIn}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 rotate-180" />
                  Stock Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockMovementReport.stockOut}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Net Movement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockMovementReport.netMovement > 0 ? '+' : ''}{stockMovementReport.netMovement}</div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products by Movement */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockMovementReport.movementByProduct.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.productName}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="text-emerald-600">In: {product.in}</span>
                        <span className="text-red-600">Out: {product.out}</span>
                      </div>
                    </div>
                    <span className="font-medium">{product.in + product.out} total</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}