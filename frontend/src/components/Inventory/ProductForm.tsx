import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Upload, X, Check } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  categories: Category[];
}

export function ProductForm({ product, onSave, onCancel, categories }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    quantity: 0,
    price: 0,
    category: '',
    unit: 'pcs',
    minStock: 0,
    supplier: '',
    sku: '',
    cost: 0,
    photo: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.cost || formData.cost <= 0) newErrors.cost = 'Cost must be greater than 0';
    if (!formData.unit?.trim()) newErrors.unit = 'Unit is required';
    if (formData.quantity === undefined || formData.quantity < 0) newErrors.quantity = 'Quantity must be 0 or greater';
    if (formData.minStock === undefined || formData.minStock < 0) newErrors.minStock = 'Min stock must be 0 or greater';
    if (!formData.supplier?.trim()) newErrors.supplier = 'Supplier is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const productData: Product = {
        id: product?.id || Date.now().toString(),
        name: formData.name!,
        quantity: formData.quantity!,
        price: formData.price!,
        category: formData.category!,
        unit: formData.unit!,
        minStock: formData.minStock!,
        supplier: formData.supplier!,
        sku: formData.sku || '',
        cost: formData.cost!,
        photo: formData.photo || null
      };
      onSave(productData);
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="cost">Cost ($) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost || ''}
                onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))}
                className={errors.cost ? 'border-red-500' : ''}
              />
              {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
            </div>

            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit || ''}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="e.g., kg, pcs, liters"
                className={errors.unit ? 'border-red-500' : ''}
              />
              {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku || ''}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Stock Keeping Unit"
              />
            </div>

            <div>
              <Label htmlFor="quantity">Current Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity || ''}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <Label htmlFor="minStock">Minimum Stock *</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock || ''}
                onChange={(e) => handleInputChange('minStock', parseInt(e.target.value))}
                className={errors.minStock ? 'border-red-500' : ''}
              />
              {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                value={formData.supplier || ''}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className={errors.supplier ? 'border-red-500' : ''}
              />
              {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="photo">Product Photo</Label>
              <div className="flex items-center gap-4">
                {formData.photo ? (
                  <div className="relative">
                    <img
                      src={formData.photo}
                      alt="Product preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 bg-white"
                      onClick={() => handleInputChange('photo', null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No photo uploaded</p>
                  </div>
                )}
                <div>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.photo ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              <Check className="h-4 w-4 mr-2" />
              {product ? 'Update Product' : 'Add Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}