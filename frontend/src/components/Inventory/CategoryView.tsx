import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Trash2, Plus, Package } from 'lucide-react';
import { Product, Category } from '../../types';

interface CategoryViewProps {
  products: Product[];
  categories: Category[];
  onProductEdit: (product: Product) => void;
  onProductDelete: (productId: string) => void;
  onAddToOrder: (product: Product) => void;
}

export function CategoryView({ 
  products, 
  categories, 
  onProductEdit, 
  onProductDelete, 
  onAddToOrder 
}: CategoryViewProps) {
  // Group products by category
  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(product => product.category === category.id)
  })).filter(group => group.products.length > 0);

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (product.quantity <= product.minStock) return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    return { text: 'In Stock', color: 'text-emerald-600 bg-emerald-50' };
  };

  return (
    <div className="space-y-6">
      {productsByCategory.map(({ category, products: categoryProducts }) => (
        <Card key={category.id} className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                {category.name}
              </div>
              <span className="text-gray-500 text-sm font-normal">
                ({categoryProducts.length} products)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      {product.photo ? (
                        <img
                          src={product.photo}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {product.sku && `SKU: ${product.sku} • `}
                          {product.unit}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium">${product.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <div className="font-semibold">{product.quantity}</div>
                        <div className="text-xs text-gray-500">in stock</div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddToOrder(product)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onProductEdit(product)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onProductDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {productsByCategory.length === 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {products.length === 0 
                ? "Start by adding your first product to the inventory."
                : "No products match your current filters."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}