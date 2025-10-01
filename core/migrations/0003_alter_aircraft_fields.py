# Generated manually to widen aircraft metadata fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_airport_resources_and_data"),
    ]

    operations = [
        migrations.AlterField(
            model_name="aircraft",
            name="type",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AlterField(
            model_name="aircraft",
            name="airline",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name="aircraft",
            name="country",
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
