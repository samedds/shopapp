import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Receipt, Clock, DollarSign } from 'lucide-react';
import { Order } from '../../types';

interface TransactionListProps {
  transactions: Order[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const recentTransactions = transactions.slice(0, 10).reverse();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order #{transaction.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{formatTime(transaction.timestamp)}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                      {transaction.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${transaction.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{transaction.items.length} items</p>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}