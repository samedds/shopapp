import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddToOrder: (product: Product) => void;
}

export function ProductGrid({ 
  products, 
  categories, 
  onEdit, 
  onDelete, 
  onAddToOrder 
}: ProductGridProps) {
  const getCategory = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (product.quantity <= product.minStock) return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    return { text: 'In Stock', color: 'text-emerald-600 bg-emerald-50' };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const category = getCategory(product.category);
        const stockStatus = getStockStatus(product);
        
        return (
          <Card key={product.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Product Image */}
              <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
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
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                
                {product.sku && (
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                )}

                {category && (
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.name}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">${product.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <div>Stock: {product.quantity} {product.unit}</div>
                  <div>Min: {product.minStock} {product.unit}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToOrder(product)}
                    className="flex-1 text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                    className="flex-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(product.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters, or add your first product.
          </p>
        </div>
      )}
    </div>
  );
}