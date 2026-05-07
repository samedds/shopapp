from django.contrib import admin
from .models import Product, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'quantity', 'price', 'stock_status', 'supplier', 'is_active']
    list_filter = ['category', 'supplier', 'is_active', 'created_at']
    search_fields = ['name', 'sku', 'supplier']
    list_editable = ['quantity', 'price', 'is_active']
    readonly_fields = ['id', 'created_at', 'updated_at', 'total_value', 'profit_margin']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'sku', 'supplier', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'cost', 'total_value', 'profit_margin')
        }),
        ('Inventory Management', {
            'fields': ('quantity', 'min_stock', 'unit', 'is_active')
        }),
        ('Media', {
            'fields': ('photo',)
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def stock_status(self, obj):
        return obj.stock_status
    
    stock_status.short_description = 'Stock Status'
    
    def total_value(self, obj):
        return f"${obj.total_value:.2f}"
    
    total_value.short_description = 'Total Value'
    
    def profit_margin(self, obj):
        return f"{obj.profit_margin:.1f}%"
    
    profit_margin.short_description = 'Profit Margin'