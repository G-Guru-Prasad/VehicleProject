from django.contrib import admin
from .models import Vehicle, Issue, Component, Payment

# Register your models here.
# for checking the data in admin login
admin.site.register(Vehicle)
admin.site.register(Issue)
admin.site.register(Component)
admin.site.register(Payment)