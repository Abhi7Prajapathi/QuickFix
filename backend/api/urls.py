from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkerViewSet, ReviewViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'workers', WorkerViewSet, basename='worker')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
