import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, ShoppingCart, Package, Receipt, Percent, RotateCcw } from 'lucide-react';

interface ReportStatsProps {
  totalSales: number;
  netSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  totalItemsSold: number;
  taxCollected: number;
  discountsApplied: number;
  refundsAndVoids: number;
}

export function ReportStats({
  totalSales,
  netSales,
  totalTransactions,
  averageOrderValue,
  totalItemsSold,
  taxCollected,
  discountsApplied,
  refundsAndVoids,
}: ReportStatsProps) {
  const stats = [
    {
      title: 'Total Sales (Gross)',
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'Total revenue before deductions',
    },
    {
      title: 'Net Sales',
      value: `$${netSales.toFixed(2)}`,
      icon: Receipt,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      description: 'Revenue after refunds and discounts',
    },
    {
      title: 'Transactions',
      value: totalTransactions.toString(),
      icon: ShoppingCart,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      description: 'Total number of orders',
    },
    {
      title: 'Avg Order Value',
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600',
      description: 'Average revenue per transaction',
    },
    {
      title: 'Items Sold',
      value: totalItemsSold.toString(),
      icon: Package,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      description: 'Total units sold',
    },
    {
      title: 'Tax Collected',
      value: `$${taxCollected.toFixed(2)}`,
      icon: Receipt,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      description: 'Total tax amount collected',
    },
    {
      title: 'Discounts Applied',
      value: `$${discountsApplied.toFixed(2)}`,
      icon: Percent,
      color: 'bg-gradient-to-r from-rose-500 to-pink-600',
      description: 'Total discount amount',
    },
    {
      title: 'Refunds & Voids',
      value: `$${refundsAndVoids.toFixed(2)}`,
      icon: RotateCcw,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      description: 'Total refunded amount',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}