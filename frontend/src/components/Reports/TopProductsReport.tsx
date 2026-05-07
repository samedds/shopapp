import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, TrendingUp } from 'lucide-react';

interface ProductSales {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

interface TopProductsReportProps {
  products: ProductSales[];
}

export function TopProductsReport({ products }: TopProductsReportProps) {
  const topProducts = products.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.quantity} units
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${product.revenue.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Top seller</span>
                </div>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No sales data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}