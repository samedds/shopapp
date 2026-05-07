from django.contrib import admin
from .models import StockMovement, StockAlert


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['product', 'type', 'quantity', 'reason', 'created_by', 'created_at']
    list_filter = ['type', 'created_at', 'product__category']
    search_fields = ['product__name', 'reason', 'reference']
    readonly_fields = ['id', 'created_at']
    
    fieldsets = (
        ('Movement Details', {
            'fields': ('product', 'type', 'quantity', 'reason', 'reference')
        }),
        ('System Information', {
            'fields': ('created_by', 'created_at', 'id'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ['product', 'alert_type', 'message', 'is_resolved', 'created_at']
    list_filter = ['alert_type', 'is_resolved', 'created_at']
    search_fields = ['product__name', 'message']
    readonly_fields = ['id', 'created_at', 'resolved_at']
    
    actions = ['mark_as_resolved']
    
    def mark_as_resolved(self, request, queryset):
        queryset.update(is_resolved=True, resolved_at=timezone.now())
    mark_as_resolved.short_description = "Mark selected alerts as resolved"