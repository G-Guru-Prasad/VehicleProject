# serializers.py
from rest_framework import serializers
from .models import Component, Vehicle, Issue

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    components = serializers.PrimaryKeyRelatedField(many=True, queryset=Component.objects.all())

    class Meta:
        model = Vehicle
        fields = ['id', 'name', 'components']

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'
