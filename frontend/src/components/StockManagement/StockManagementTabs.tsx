import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { TrendingUp, TrendingDown, AlertCircle, Check } from 'lucide-react';
import type { Product, StockMovement } from '../../types';

interface StockManagementTabsProps {
  products: Product[];
  stockMovements: StockMovement[];
  onStockMovement: (movement: StockMovement) => void;
}

export function StockManagementTabs({ products, stockMovements, onStockMovement }: StockManagementTabsProps) {
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || !reason) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const movement: StockMovement = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      quantity: parseInt(quantity),
      type: movementType,
      reason,
      timestamp: Date.now()
    };

    onStockMovement(movement);
    
    // Reset form
    setSelectedProduct('');
    setQuantity('');
    setReason('');
  };

  const outOfStock = products.filter(p => p.quantity === 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>

      {/* Stock Movement Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {movementType === 'in' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            Log Stock Movement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Product *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.quantity} {product.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Movement Type *</Label>
                <Select value={movementType} onValueChange={(value: 'in' | 'out') => setMovementType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Supplier delivery, Customer return, Damage, etc."
                  required
                />
              </div>
            </div>
            <Button type="submit">
              <Check className="h-4 w-4 mr-2" />
              Log Movement
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out of Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Out of Stock ({outOfStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStock.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No products out of stock</p>
            ) : (
              <div className="space-y-3">
                {outOfStock.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Min Stock: {product.minStock} {product.unit}</p>
                    </div>
                    <span className="text-red-600 font-medium">0 {product.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Low Stock ({lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No products with low stock</p>
            ) : (
              <div className="space-y-3">
                {lowStock.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Min Stock: {product.minStock} {product.unit}</p>
                    </div>
                    <span className="text-amber-600 font-medium">{product.quantity} {product.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stockMovements.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No stock movements yet</p>
            ) : (
              stockMovements.slice(-10).reverse().map(movement => (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${movement.type === 'in' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium">{movement.productName}</p>
                      <p className="text-sm text-gray-500">{movement.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${movement.type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(movement.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}