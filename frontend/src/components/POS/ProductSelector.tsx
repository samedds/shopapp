import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Plus, Package } from 'lucide-react';
import { Product } from '../../types';
import { useState } from 'react';

interface ProductSelectorProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductSelector({ products, onAddToCart }: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inStockProducts = filteredProducts.filter(product => product.quantity > 0);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Select Products
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {inStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">
                  ${product.price} • {product.quantity} {product.unit} in stock
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => onAddToCart(product)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {inStockProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">
              {products.length === 0 
                ? "No products available"
                : searchTerm 
                  ? "No products match your search"
                  : "No products in stock"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}