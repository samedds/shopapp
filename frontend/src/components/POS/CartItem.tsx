import { Button } from '../ui/button';
import { Plus, Minus, Trash2, Package } from 'lucide-react';
import { OrderItem, Product } from '../../types';

interface CartItemProps {
  item: OrderItem;
  product?: Product;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, product, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Product Thumbnail */}
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {product?.photo ? (
          <img 
            src={product.photo} 
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRemove(item.id)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="text-right min-w-fit">
        <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
      </div>
    </div>
  );
}