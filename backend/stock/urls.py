from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StockMovementViewSet, StockAlertViewSet

router = DefaultRouter()
router.register(r'movements', StockMovementViewSet)
router.register(r'alerts', StockAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]