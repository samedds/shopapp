import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Package } from 'lucide-react';
import { Product } from '../../types';
import { Category } from '../../types';

interface StockAlertsProps {
  products: Product[];
}

export function StockAlerts({ products }: StockAlertsProps) {
  const outOfStock = products.filter(p => p.quantity === 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock);

  return (
    <div className="space-y-4">
      {/* Out of Stock */}
      <Card className="bg-white shadow-sm border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Out of Stock ({outOfStock.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {outOfStock.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No products out of stock</p>
          ) : (
            <div className="space-y-2">
              {outOfStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Min Stock: {product.minStock} {product.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-bold">0 {product.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low Stock */}
      <Card className="bg-white shadow-sm border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            Low Stock ({lowStock.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No products with low stock</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Min Stock: {product.minStock} {product.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-600 font-bold">{product.quantity} {product.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Good Message */}
      {outOfStock.length === 0 && lowStock.length === 0 && (
        <Card className="bg-white shadow-sm border-emerald-200">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">All Stock Levels Good!</h3>
            <p className="text-gray-600">
              All products have adequate stock levels. No alerts at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}