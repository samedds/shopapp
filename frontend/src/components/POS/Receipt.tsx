import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Printer, X, DollarSign, CreditCard } from 'lucide-react';
import { Order } from '../../types';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
  onPrint: () => void;
}

export function ReceiptModal({ order, onClose, onPrint }: ReceiptModalProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Receipt
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Supermarket POS</h2>
            <p className="text-sm text-gray-600">Thank you for your purchase!</p>
            <p className="text-xs text-gray-500 mt-1">Order #{order.id}</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date & Time:</p>
              <p className="font-medium">{formatDate(order.timestamp)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Items:</p>
              <div className="space-y-2 border-b pb-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-emerald-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {getPaymentIcon(order.paymentMethod)}
              <span className="text-sm font-medium capitalize">
                Payment: {order.paymentMethod}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={onPrint}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}