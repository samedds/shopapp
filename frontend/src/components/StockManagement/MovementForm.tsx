import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { TrendingUp, TrendingDown, Check } from 'lucide-react';
import { Product, StockMovement } from '../../types';

interface MovementFormProps {
  products: Product[];
  onLogMovement: (movement: StockMovement) => void;
}

export function MovementForm({ products, onLogMovement }: MovementFormProps) {
  const [formData, setFormData] = useState({
    productId: '',
    type: 'in' as 'in' | 'out',
    quantity: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        const movement: StockMovement = {
          id: Date.now().toString(),
          productId: formData.productId,
          productName: product.name,
          quantity: parseInt(formData.quantity),
          type: formData.type,
          reason: formData.reason,
          timestamp: Date.now()
        };
        onLogMovement(movement);
        setFormData({
          productId: '',
          type: 'in',
          quantity: '',
          reason: ''
        });
      }
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {formData.type === 'in' ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
          Log Stock Movement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product">Product *</Label>
            <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
              <SelectTrigger className={errors.productId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.quantity} {product.unit} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
          </div>

          <div>
            <Label htmlFor="type">Movement Type *</Label>
            <Select value={formData.type} onValueChange={(value: 'in' | 'out') => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Stock In
                  </div>
                </SelectItem>
                <SelectItem value="out">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    Stock Out
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              className={errors.quantity ? 'border-red-500' : ''}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="e.g., Supplier delivery, Customer return, Damage, etc."
              className={errors.reason ? 'border-red-500' : ''}
            />
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Check className="h-4 w-4 mr-2" />
            Log Movement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}