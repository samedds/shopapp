import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { StockMovement } from '../../types';

interface ActivityListProps {
  movements: StockMovement[];
}

export function ActivityList({ movements }: ActivityListProps) {
  const today = new Date().toDateString();
  const todayMovements = movements
    .filter(m => new Date(m.timestamp).toDateString() === today)
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
          <BarChart3 className="h-5 w-5" />
          Today's Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayMovements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No activity today</p>
        ) : (
          <div className="space-y-3">
            {todayMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {movement.type === 'in' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{movement.productName}</p>
                    <p className="text-sm text-gray-500">{movement.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(movement.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}