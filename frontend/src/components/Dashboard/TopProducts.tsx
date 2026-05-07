import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PackageOpen } from 'lucide-react';
import { StockMovement } from '../../types';

interface TopProductsProps {
  movements: StockMovement[];
}

export function TopProducts({ movements }: TopProductsProps) {
  const today = new Date().toDateString();
  const todayMovements = movements.filter(m => 
    new Date(m.timestamp).toDateString() === today
  );

  // Calculate total movement per product
  const productMovements = todayMovements.reduce((acc, movement) => {
    if (!acc[movement.productId]) {
      acc[movement.productId] = {
        name: movement.productName,
        total: 0
      };
    }
    acc[movement.productId].total += movement.quantity;
    return acc;
  }, {} as Record<string, { name: string; total: number }>);

  // Sort and get top 3
  const topProducts = Object.entries(productMovements)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 3);

  const maxMovement = Math.max(...topProducts.map(([, { total }]) => total), 1);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageOpen className="h-5 w-5" />
          Top Products Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No movements today</p>
        ) : (
          <div className="space-y-4">
            {topProducts.map(([productId, { name, total }], index) => (
              <div key={productId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <span className="text-sm font-semibold">{total} units</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(total / maxMovement) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}