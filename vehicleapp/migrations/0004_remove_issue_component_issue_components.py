# Generated by Django 5.1.2 on 2024-10-24 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicleapp', '0003_issue_component'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='issue',
            name='component',
        ),
        migrations.AddField(
            model_name='issue',
            name='components',
            field=models.ManyToManyField(to='vehicleapp.component'),
        ),
    ]
