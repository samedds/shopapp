import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Settings, Package, Edit2, Plus } from 'lucide-react';
import { CategoryManager } from './CategoryManager';
import { Category } from '../../types';

interface CategorySettingsProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  productsCount: number;
}

export function CategorySettings({ categories, onCategoriesChange, productsCount }: CategorySettingsProps) {
  const [showManager, setShowManager] = useState(false);

  const getCategoryProductCount = (categoryId: string) => {
    // This would need to be passed from the parent component
    // For now, returning a placeholder
    return 0;
  };

  if (showManager) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowManager(false)}
          >
            ← Back to Overview
          </Button>
        </div>
        <CategoryManager
          categories={categories}
          onCategoriesChange={onCategoriesChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Category Settings</h3>
        </div>
        <Button
          onClick={() => setShowManager(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  ID: {category.id}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3" />
                  <span>Products: {getCategoryProductCount(category.id)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowManager(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Category
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowManager(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Existing Categories
          </Button>
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">
              Total Categories: <span className="font-semibold">{categories.length}</span>
            </p>
            <p className="text-sm text-gray-600">
              Total Products: <span className="font-semibold">{productsCount}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}