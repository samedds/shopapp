export const validateProduct = (product: any): string[] => {
  const errors: string[] = [];
  
  if (!product.name?.trim()) errors.push('Product name is required');
  if (!product.category) errors.push('Category is required');
  if (!product.price || product.price <= 0) errors.push('Price must be greater than 0');
  if (!product.cost || product.cost <= 0) errors.push('Cost must be greater than 0');
  if (!product.unit?.trim()) errors.push('Unit is required');
  if (product.quantity < 0) errors.push('Quantity cannot be negative');
  if (product.minStock < 0) errors.push('Min stock cannot be negative');
  
  return errors;
};

export const validateStockMovement = (movement: any): string[] => {
  const errors: string[] = [];
  
  if (!movement.productId) errors.push('Product is required');
  if (!movement.type || !['in', 'out'].includes(movement.type)) errors.push('Type is required');
  if (!movement.quantity || movement.quantity <= 0) errors.push('Quantity must be greater than 0');
  if (!movement.reason?.trim()) errors.push('Reason is required');
  
  return errors;
};