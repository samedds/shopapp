from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum, Q, Count
from .models import Product, Category
from .serializers import ProductSerializer, ProductListSerializer, CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'supplier', 'is_active']
    search_fields = ['name', 'sku', 'supplier', 'description']
    ordering_fields = ['name', 'price', 'quantity', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.select_related('category')
        
        # Filter by stock status
        stock_status = self.request.query_params.get('stock_status')
        if stock_status == 'low':
            queryset = queryset.filter(quantity__gt=0, quantity__lte=models.F('min_stock'))
        elif stock_status == 'out':
            queryset = queryset.filter(quantity=0)
        elif stock_status == 'in':
            queryset = queryset.filter(quantity__gt=models.F('min_stock'))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get inventory statistics"""
        stats = {
            'total_products': Product.objects.count(),
            'total_value': Product.objects.aggregate(
                total=Sum(models.F('quantity') * models.F('price')
            ))['total'] or 0,
            'low_stock_count': Product.objects.filter(
                quantity__gt=0, quantity__lte=models.F('min_stock')
            ).count(),
            'out_of_stock_count': Product.objects.filter(quantity=0).count(),
            'active_products': Product.objects.filter(is_active=True).count(),
        }
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def add_to_order(self, request, pk=None):
        """Add product to temporary order (session-based)"""
        product = self.get_object()
        quantity = request.data.get('quantity', 1)
        
        if product.quantity < quantity:
            return Response(
                {'error': 'Insufficient stock'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # This would typically integrate with an order system
        return Response({
            'status': 'added to order',
            'product': product.name,
            'quantity': quantity
        })
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced product search"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Search query required'}, status=400)
        
        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(sku__icontains=query) |
            Q(supplier__icontains=query) |
            Q(description__icontains=query)
        ).select_related('category')
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get all products in this category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)