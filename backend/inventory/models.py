import uuid
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=50, help_text="Tailwind CSS class, e.g., 'bg-emerald-100 text-emerald-800'")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    unit = models.CharField(max_length=20, help_text="e.g., 'kg', 'pcs', 'liters'")
    quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    min_stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    supplier = models.CharField(max_length=200, blank=True)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    photo = models.TextField(blank=True, help_text="Base64 encoded image")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['sku']),
            models.Index(fields=['category']),
            models.Index(fields=['supplier']),
        ]
    
    @property
    def is_low_stock(self):
        return 0 < self.quantity <= self.min_stock
    
    @property
    def is_out_of_stock(self):
        return self.quantity == 0
    
    @property
    def stock_status(self):
        if self.is_out_of_stock:
            return "Out of Stock"
        elif self.is_low_stock:
            return "Low Stock"
        else:
            return "In Stock"
    
    @property
    def total_value(self):
        return self.quantity * self.price
    
    @property
    def profit_margin(self):
        if self.price > 0:
            return ((self.price - self.cost) / self.price) * 100
        return 0
    
    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"