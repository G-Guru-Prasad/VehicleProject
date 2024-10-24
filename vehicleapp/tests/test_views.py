from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Vehicle, Issue

class VehicleTests(APITestCase):
    def setUp(self):
        self.vehicle = Vehicle.objects.create(name='Car A', model='Model X', year=2020)

    def test_create_vehicle(self):
        url = reverse('vehicle-list')  # Adjust the URL name as needed
        data = {'name': 'Car B', 'model': 'Model Y', 'year': 2021}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicle.objects.count(), 2)

    def test_list_vehicles(self):
        url = reverse('vehicle-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class IssueTests(APITestCase):
    def setUp(self):
        self.vehicle = Vehicle.objects.create(name='Car A', model='Model X', year=2020)
        self.issue = Issue.objects.create(vehicle=self.vehicle, description='Engine issue', is_repair=True)

    def test_create_issue(self):
        url = reverse('issue-list')  # Adjust the URL name as needed
        data = {'vehicle': self.vehicle.id, 'description': 'Brake issue', 'is_repair': True}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Issue.objects.count(), 2)

    def test_calculate_payment(self):
        url = reverse('calculate-payment', kwargs={'id': self.vehicle.id})  # Adjust the URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_price', response.data)
