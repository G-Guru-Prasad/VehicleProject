# views.py
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .models import Component, Vehicle, Issue, Payment
from .serializers import ComponentSerializer, VehicleSerializer, IssueSerializer
from datetime import date, datetime
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Sum

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

    def perform_create(self, serializer):
        serializer.save()
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def create(self, request, *args, **kwargs):
        vehicle_id = request.data.get('vehicle')

        # Check if the vehicle exists
        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({"detail": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch components from the vehicle
        components = vehicle.components.all()

        if not components.exists():
            return Response({"detail": "No components found for this vehicle."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the issue and associate the components from the vehicle
        issue_data = {
            'vehicle': vehicle.id,  # Pass the vehicle ID to serializer
            'description': request.data.get('description'),
            'is_repair': request.data.get('is_repair', True),
            'components':[component.id for component in components]
        }

        serializer = self.get_serializer(data=issue_data)
        if serializer.is_valid():
            issue = serializer.save()
            issue.components.set(components)  # Assign the vehicle components to the issue
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Debugging: Print errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_issues_by_vehicle(self, request, vehicle_id=None):
        if vehicle_id is not None:
            issues = self.queryset.filter(vehicle_id=vehicle_id)
            serializer = self.get_serializer(issues, many=True)
            return Response(serializer.data)
        return Response({"detail": "Vehicle ID is required."}, status=status.HTTP_400_BAD_REQUEST)




class PaymentViewSet(viewsets.ViewSet):
    def calculate_total(self, request, vehicle_id=None):
        if vehicle_id is None:
            return Response({"detail": "Vehicle ID is required."}, status=400)

        # Fetch issues for the vehicle
        issues = Issue.objects.filter(vehicle_id=vehicle_id)
        total_price = 0

        for issue in issues:
            if issue.is_repair:
                # Assuming the repair price is associated with the component related to the issue
                for component in issue.components.all():  # Assuming you have a way to get component from issue
                    total_price += component.repair_price

        return Response({"total_price": total_price})



@api_view(['GET'])
def revenue_summary(request):
    today = datetime.now().date()
    current_month = today.month
    current_year = today.year

    daily_revenue = Payment.objects.filter(timestamp__date=today).aggregate(Sum('amount'))['amount__sum'] or 0
    monthly_revenue = Payment.objects.filter(timestamp__year=current_year, timestamp__month=current_month).aggregate(Sum('amount'))['amount__sum'] or 0
    yearly_revenue = Payment.objects.filter(timestamp__year=current_year).aggregate(Sum('amount'))['amount__sum'] or 0

    return Response({
        "daily_revenue": daily_revenue,
        "monthly_revenue": monthly_revenue,
        "yearly_revenue": yearly_revenue
    })


    from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from .models import Payment, Vehicle
from vehicleapp.models import Issue

@api_view(['POST'])
def process_payment(request):
    user = request.user
    vehicle_id = request.data.get('vehicle_id')

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)

    # Calculate the total price based on issues for the vehicle
    issues = Issue.objects.filter(vehicle=vehicle, is_repair=True)
    total_price = 0
    for issue in issues:
        total_price += sum(component.repair_price for component in issue.components.all())

    # Create a Payment entry
    try:
        payment = Payment.objects.create(amount=total_price, timestamp=datetime.now())
    except Exception as e:
        print('Unable to process payment')
        return Response({"message": "Unable to process payment"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Payment processed successfully", "total_price": total_price}, status=status.HTTP_201_CREATED)
