import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';
import { Product } from '../../types';
import { categories } from '../../utils/categories';
import { ProductForm } from './ProductForm';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddToOrder: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete, onAddToOrder }: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const category = categories.find(c => c.id === product.category);

  const getStockStatus = () => {
    if (product.quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (product.quantity <= product.minStock) return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    return { text: 'In Stock', color: 'text-emerald-600 bg-emerald-50' };
  };

  const stockStatus = getStockStatus();
  const stockPercentage = product.minStock > 0 ? (product.quantity / product.minStock) * 100 : 100;

  if (isEditing) {
    return (
      <ProductForm
        product={product}
        onSave={(updatedProduct) => {
          onEdit(updatedProduct);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.photo ? (
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            {product.sku && (
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            )}
            {category && (
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${category.color} mt-1`}>
                {category.name}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Stock: {product.quantity} {product.unit}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  product.quantity === 0 ? 'bg-red-500' :
                  product.quantity <= product.minStock ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Price Info */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price: ${product.price.toFixed(2)}</span>
            <span className="text-gray-600">Min: {product.minStock} {product.unit}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onAddToOrder(product)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}