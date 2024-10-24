from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComponentViewSet, VehicleViewSet, IssueViewSet, revenue_summary, PaymentViewSet, process_payment

router = DefaultRouter()
router.register(r'components', ComponentViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'issues', IssueViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/revenue_summary/', revenue_summary, name='revenue_summary'),
    path('api/vehicles/<int:vehicle_id>/issues/', IssueViewSet.as_view({'get': 'get_issues_by_vehicle'}), name='vehicle-issues'),
    path('api/vehicles/<int:vehicle_id>/calculate_payment/', PaymentViewSet.as_view({'get': 'calculate_total'}), name='calculate_payment'),
    path('api/process_payment/', process_payment, name='process_payment'),
]
