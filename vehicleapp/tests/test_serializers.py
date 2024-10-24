from rest_framework.exceptions import ValidationError
from django.test import TestCase
from .models import Vehicle, Issue
from .serializers import VehicleSerializer, IssueSerializer

class VehicleSerializerTest(TestCase):
    def test_vehicle_serializer_valid(self):
        vehicle_data = {'name': 'Car C', 'model': 'Model Z', 'year': 2022}
        serializer = VehicleSerializer(data=vehicle_data)
        self.assertTrue(serializer.is_valid())

    def test_vehicle_serializer_invalid(self):
        vehicle_data = {'name': '', 'model': 'Model Z', 'year': 2022}  # Invalid data
        serializer = VehicleSerializer(data=vehicle_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

class IssueSerializerTest(TestCase):
    def test_issue_serializer_valid(self):
        vehicle = Vehicle.objects.create(name='Car A', model='Model X', year=2020)
        issue_data = {'vehicle': vehicle.id, 'description': 'Tire issue', 'is_repair': False}
        serializer = IssueSerializer(data=issue_data)
        self.assertTrue(serializer.is_valid())

    def test_issue_serializer_invalid(self):
        issue_data = {'vehicle': None, 'description': 'Tire issue', 'is_repair': False}  # Invalid data
        serializer = IssueSerializer(data=issue_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('vehicle', serializer.errors)
