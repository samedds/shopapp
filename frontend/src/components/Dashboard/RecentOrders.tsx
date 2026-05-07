import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tag } from 'lucide-react';
import { StockMovement } from '../../types';

interface RecentOrdersProps {
  movements: StockMovement[];
}

export function RecentOrders({ movements }: RecentOrdersProps) {
  const recentMovements = movements
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Recent Stock Movements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentMovements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent movements</p>
        ) : (
          <div className="space-y-3">
            {recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{movement.productName}</p>
                  <p className="text-sm text-gray-500">{movement.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    movement.type === 'in' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {movement.type.toUpperCase()}
                  </span>
                  <span className="font-semibold">{movement.quantity}</span>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(movement.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}