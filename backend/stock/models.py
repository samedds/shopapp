import uuid
from django.db import models
from django.contrib.auth import get_user_model
from inventory.models import Product

User = get_user_model()


class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    quantity = models.IntegerField()
    type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    reason = models.TextField()
    reference = models.CharField(max_length=100, blank=True, help_text="Invoice number, order ID, etc.")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', 'created_at']),
            models.Index(fields=['type', 'created_at']),
            models.Index(fields=['created_at']),
        ]
    
    def save(self, *args, **kwargs):
        # Update product quantity
        if self.type == 'in':
            self.product.quantity += self.quantity
        else:
            if self.product.quantity < self.quantity:
                raise ValueError("Insufficient stock for this movement")
            self.product.quantity -= self.quantity
        self.product.save()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.get_type_display()}: {self.quantity} {self.product.name}"


class StockAlert(models.Model):
    ALERT_TYPES = [
        ('low', 'Low Stock'),
        ('out', 'Out of Stock'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_alerts')
    alert_type = models.CharField(max_length=3, choices=ALERT_TYPES)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', 'alert_type']),
            models.Index(fields=['is_resolved', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_alert_type_display()}: {self.product.name}"