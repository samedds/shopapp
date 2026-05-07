from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import StockMovement, StockAlert
from .serializers import StockMovementSerializer, StockAlertSerializer
from inventory.models import Product


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'type', 'created_by']
    search_fields = ['product__name', 'product__sku', 'reason', 'reference']
    ordering_fields = ['created_at', 'quantity']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's stock movements"""
        today = timezone.now().date()
        movements = StockMovement.objects.filter(
            created_at__date=today
        ).select_related('product', 'created_by')
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get stock movement statistics"""
        today = timezone.now().date()
        today_movements = StockMovement.objects.filter(created_at__date=today)
        
        stats = {
            'movements_today': today_movements.count(),
            'stock_in_today': today_movements.filter(type='in').aggregate(
                total=Sum('quantity')
            )['total'] or 0,
            'stock_out_today': today_movements.filter(type='out').aggregate(
                total=Sum('quantity')
            )['total'] or 0,
            'total_movements': StockMovement.objects.count(),
        }
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent stock movements (last 10)"""
        movements = StockMovement.objects.select_related(
            'product', 'created_by'
        ).order_by('-created_at')[:10]
        serializer = self.get_serializer(movements, many=True)
        return Response(serializer.data)


class StockAlertViewSet(viewsets.ModelViewSet):
    queryset = StockAlert.objects.all()
    serializer_class = StockAlertSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['product', 'alert_type', 'is_resolved']
    search_fields = ['product__name', 'message']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve a stock alert"""
        alert = self.get_object()
        alert.is_resolved = True
        alert.resolved_at = timezone.now()
        alert.resolved_by = request.user
        alert.save()
        return Response({'status': 'resolved'})
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active (unresolved) stock alerts"""
        alerts = StockAlert.objects.filter(is_resolved=False).select_related('product')
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def generate_alerts(self, request):
        """Generate stock alerts for low/out of stock products"""
        alerts_created = 0
        
        # Out of stock alerts
        out_of_stock = Product.objects.filter(quantity=0)
        for product in out_of_stock:
            alert, created = StockAlert.objects.get_or_create(
                product=product,
                alert_type='out',
                is_resolved=False,
                defaults={'message': f'Product "{product.name}" is out of stock'}
            )
            if created:
                alerts_created += 1
        
        # Low stock alerts
        low_stock = Product.objects.filter(
            quantity__gt=0, quantity__lte=models.F('min_stock')
        )
        for product in low_stock:
            alert, created = StockAlert.objects.get_or_create(
                product=product,
                alert_type='low',
                is_resolved=False,
                defaults={'message': f'Product "{product.name}" has low stock ({product.quantity} remaining)'}
            )
            if created:
                alerts_created += 1
        
        return Response({'alerts_created': alerts_created})