# models.py
from django.db import models

class Component(models.Model):
    name = models.CharField(max_length=255)
    repair_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_new = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    name = models.CharField(max_length=255)
    components = models.ManyToManyField(Component)
    
    def __str__(self):
        return self.name

class Issue(models.Model):
    vehicle = models.ForeignKey(Vehicle, related_name='issues', on_delete=models.CASCADE)
    description = models.TextField()
    is_repair = models.BooleanField(default=True)
    components = models.ManyToManyField(Component)

    def __str__(self):
        return self.description


class Payment(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)