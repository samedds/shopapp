import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Minus, Trash2, CreditCard, DollarSign, Receipt, Package, X, Printer, Image as ImageIcon } from 'lucide-react';
import type  { Product, Order, OrderItem } from '../../types';

interface POSTabsProps {
  products: Product[];
  onOrderComplete: (order: Order) => void;
}

export function POSTabs({ products, onOrderComplete }: POSTabsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'other'>('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Simplified but robust image source handler
  const getImageSrc = (photo: string | null) => {
    if (!photo) return null;
    
    // If it's already a complete data URL
    if (photo.startsWith('data:image/')) {
      return photo;
    }
    
    // If it's a base64 string (common from file uploads)
    if (photo.length > 100 && !photo.includes('http') && !photo.includes('blob:')) {
      // Try to detect if it needs a data URL prefix
      if (!photo.startsWith('data:')) {
        return `data:image/jpeg;base64,${photo}`;
      }
    }
    
    // If it's a regular URL or blob URL
    if (photo.startsWith('http') || photo.startsWith('blob:')) {
      return photo;
    }
    
    return photo;
  };

  // Add to cart with stock validation
  const addToCart = (product: Product, quantity: number = 1) => {
    // Get current stock from the products prop (most up-to-date)
    const currentProduct = products.find(p => p.id === product.id);
    if (!currentProduct || currentProduct.quantity < quantity) {
      alert('Insufficient stock! Only ' + (currentProduct?.quantity || 0) + ' ' + product.unit + ' available.');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        // Check if adding more would exceed stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > currentProduct.quantity) {
          alert('Insufficient stock! Only ' + currentProduct.quantity + ' ' + product.unit + ' available.');
          return prevCart;
        }
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
            : item
        );
      } else {
        return [...prevCart, {
          id: Date.now().toString(),
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
          total: quantity * product.price
        }];
      }
    });
  };

  // Update cart item quantity with stock validation
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    } else {
      // Check stock
      const cartItem = cart.find(item => item.id === itemId);
      const currentProduct = products.find(p => p.id === cartItem?.productId);
      
      if (currentProduct && quantity > currentProduct.quantity) {
        alert('Insufficient stock! Only ' + currentProduct.quantity + ' ' + currentProduct.unit + ' available.');
        return;
      }
      
      setCart(prevCart => prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      ));
    }
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Complete order
  const completeOrder = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // Final stock validation
    for (const item of cart) {
      const currentProduct = products.find(p => p.id === item.productId);
      if (!currentProduct || currentProduct.quantity < item.quantity) {
        alert('Insufficient stock for ' + item.productName + '! Only ' + (currentProduct?.quantity || 0) + ' ' + (currentProduct?.unit || 'units') + ' available.');
        return;
      }
    }

    const order: Order = {
      id: Date.now().toString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      timestamp: Date.now(),
      paymentMethod
    };

    setCompletedOrder(order);
    setShowReceipt(true);
    onOrderComplete(order);
    setCart([]);
  };

  // Print receipt
  const printReceipt = () => {
    if (!receiptRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print receipt');
      return;
    }

    const receiptContent = receiptRef.current.innerHTML;
    const printStyles = `
      <style>
        body { 
          font-family: 'Courier New', monospace; 
          margin: 0; 
          padding: 20px; 
          background: white;
          max-width: 400px;
          margin: 0 auto;
        }
        .receipt-header { 
          text-align: center; 
          border-bottom: 2px dashed #000; 
          padding-bottom: 10px; 
          margin-bottom: 20px;
        }
        .receipt-title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 5px;
        }
        .receipt-subtitle { 
          font-size: 14px; 
          color: #666; 
          margin-bottom: 10px;
        }
        .receipt-date { 
          font-size: 12px; 
          margin-bottom: 10px;
        }
        .receipt-items { 
          margin-bottom: 20px; 
        }
        .receipt-item { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 8px;
          font-size: 12px;
        }
        .receipt-item-name { 
          flex: 1; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
        }
        .receipt-item-details { 
          font-size: 10px; 
          color: #666; 
          margin-left: 10px;
        }
        .receipt-totals { 
          border-top: 2px dashed #000; 
          padding-top: 10px; 
          margin-top: 20px;
        }
        .receipt-total { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 5px;
          font-size: 12px;
        }
        .receipt-grand-total { 
          display: flex; 
          justify-content: space-between; 
          font-weight: bold; 
          font-size: 16px;
          margin-top: 10px;
        }
        .receipt-footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 2px dashed #000;
          font-size: 12px;
        }
        .receipt-thank { 
          font-size: 16px; 
          font-weight: bold; 
          margin-bottom: 10px;
        }
        @media print {
          body { margin: 0; padding: 10px; }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          ${printStyles}
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Format date for receipt
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Filter */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid - FOCUSED ON THUMBNAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            const imageSrc = getImageSrc(product.photo);
            
            return (
              <Card 
                key={product.id} 
                className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
              >
                {/* PRODUCT THUMBNAIL - LARGE AND PROMINENT */}
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  {imageSrc ? (
                    <img 
                      src={imageSrc} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Hide broken image and show fallback
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <svg class="h-16 w-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span class="text-xs text-gray-500">No Image</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  )}
                  
                  {/* Stock Status Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    product.quantity > 0 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.quantity > 0 ? `${product.quantity} ${product.unit}` : 'Out of Stock'}
                  </div>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.quantity === 0}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500">{product.sku}</p>
                      <p className="text-xs text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded mt-1">
                        {product.category}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-2xl font-bold text-emerald-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cart Section */}
      <div className="space-y-4">
        <Card className="bg-white shadow-sm sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Shopping Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items with THUMBNAILS */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                cart.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  const imageSrc = product ? getImageSrc(product.photo) : null;
                  
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {/* PRODUCT THUMBNAIL IN CART */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-300">
                        {imageSrc ? (
                          <img 
                            src={imageSrc} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        <p className="text-xs text-emerald-600">Stock: {product?.quantity || 0} {product?.unit || 'units'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'other') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </div>
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={completeOrder}
                disabled={cart.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                Complete Order
              </Button>
              
              {completedOrder && (
                <Button
                  onClick={() => setShowReceipt(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  View Last Receipt
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Modal */}
      {showReceipt && completedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-md w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Order Receipt
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReceipt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div ref={receiptRef} className="receipt-content">
                <div className="receipt-header">
                  <div className="receipt-title">SUPERMARKET POS</div>
                  <div className="receipt-subtitle">123 Main Street, City</div>
                  <div className="receipt-subtitle">Tel: (555) 123-4567</div>
                  <div className="receipt-date">{formatDate(completedOrder.timestamp)}</div>
                </div>

                <div className="receipt-items">
                  {completedOrder.items.map(item => (
                    <div key={item.id} className="receipt-item">
                      <div>
                        <div className="receipt-item-name">{item.productName}</div>
                        <div className="receipt-item-details">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div>${item.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="receipt-totals">
                  <div className="receipt-total">
                    <span>Subtotal:</span>
                    <span>${completedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="receipt-total">
                    <span>Tax (8%):</span>
                    <span>${completedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="receipt-total">
                    <span>Payment:</span>
                    <span>{completedOrder.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="receipt-grand-total">
                    <span>TOTAL:</span>
                    <span>${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="receipt-footer">
                  <div className="receipt-thank">THANK YOU!</div>
                  <div>Please come again</div>
                  <div className="mt-2">Order ID: #{completedOrder.id}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={printReceipt}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReceipt(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}