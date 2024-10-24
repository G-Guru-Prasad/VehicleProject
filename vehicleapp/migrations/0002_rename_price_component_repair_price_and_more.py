# Generated by Django 5.1.2 on 2024-10-24 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicleapp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='component',
            old_name='price',
            new_name='repair_price',
        ),
        migrations.RenameField(
            model_name='vehicle',
            old_name='make',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='issue',
            name='component',
        ),
        migrations.RemoveField(
            model_name='issue',
            name='resolved',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='model',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='year',
        ),
        migrations.AddField(
            model_name='issue',
            name='is_repair',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='components',
            field=models.ManyToManyField(to='vehicleapp.component'),
        ),
        migrations.DeleteModel(
            name='Repair',
        ),
    ]