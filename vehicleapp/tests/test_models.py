from django.test import TestCase
from .models import Vehicle, Issue, Component

class VehicleModelTest(TestCase):
    def setUp(self):
        self.vehicle = Vehicle.objects.create(name='Car A', model='Model X', year=2020)

    def test_vehicle_str(self):
        self.assertEqual(str(self.vehicle), 'Car A')

class IssueModelTest(TestCase):
    def setUp(self):
        self.vehicle = Vehicle.objects.create(name='Car A', model='Model X', year=2020)
        self.component = Component.objects.create(name='Engine', repair_price=150.00)
        self.issue = Issue.objects.create(vehicle=self.vehicle, description='Engine issue', is_repair=True)
        self.issue.components.add(self.component)

    def test_issue_str(self):
        self.assertEqual(str(self.issue), 'Engine issue')

    def test_issue_components(self):
        self.assertIn(self.component, self.issue.components.all())
