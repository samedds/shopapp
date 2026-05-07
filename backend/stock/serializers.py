from rest_framework import serializers
from .models import StockMovement, StockAlert
from inventory.serializers import ProductListSerializer


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'created_by']
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value
    
    def validate(self, data):
        product = data.get('product')
        movement_type = data.get('type')
        quantity = data.get('quantity')
        
        if movement_type == 'out' and product.quantity < quantity:
            raise serializers.ValidationError(
                f"Insufficient stock. Available: {product.quantity}, Requested: {quantity}"
            )
        
        return data


class StockAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    
    class Meta:
        model = StockAlert
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'resolved_at', 'resolved_by']