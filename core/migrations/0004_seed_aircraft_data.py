from django.db import migrations


def seed_aircraft(apps, schema_editor):
    Aircraft = apps.get_model("core", "Aircraft")
    sample_fleet = [
        {
            "registration": "G-EZTH",
            "type": "Airbus A320-214",
            "airline": "easyJet Airline Company Limited",
            "country": "United Kingdom",
        },
        {
            "registration": "G-UZHA",
            "type": "Airbus A321-251NX",
            "airline": "easyJet UK",
            "country": "United Kingdom",
        },
        {
            "registration": "G-XLEL",
            "type": "Airbus A350-1041",
            "airline": "British Airways",
            "country": "United Kingdom",
        },
        {
            "registration": "G-VNEW",
            "type": "Airbus A350-1041",
            "airline": "Virgin Atlantic Airways",
            "country": "United Kingdom",
        },
        {
            "registration": "G-TTNA",
            "type": "Airbus A320-251N",
            "airline": "British Airways",
            "country": "United Kingdom",
        },
        {
            "registration": "G-NEOS",
            "type": "Airbus A321-251NX",
            "airline": "British Airways",
            "country": "United Kingdom",
        },
        {
            "registration": "G-DFOG",
            "type": "De Havilland Canada DHC-8-402",
            "airline": "Loganair",
            "country": "United Kingdom",
        },
        {
            "registration": "G-PRPK",
            "type": "Embraer ERJ-190-200LR",
            "airline": "BA Cityflyer",
            "country": "United Kingdom",
        },
        {
            "registration": "G-FBJF",
            "type": "Embraer ERJ-170-100LR",
            "airline": "Flybe",
            "country": "United Kingdom",
        },
        {
            "registration": "EI-DVM",
            "type": "Boeing 737-8AS",
            "airline": "Ryanair",
            "country": "Ireland",
        },
        {
            "registration": "EI-EVK",
            "type": "Boeing 737-8AS",
            "airline": "Ryanair",
            "country": "Ireland",
        },
        {
            "registration": "EI-LRA",
            "type": "Airbus A321-253NX",
            "airline": "Aer Lingus",
            "country": "Ireland",
        },
        {
            "registration": "OY-KAT",
            "type": "Airbus A320-251N",
            "airline": "SAS Scandinavian Airlines",
            "country": "Denmark",
        },
        {
            "registration": "D-AIJB",
            "type": "Airbus A320-214",
            "airline": "Lufthansa",
            "country": "Germany",
        },
        {
            "registration": "F-HSUN",
            "type": "Airbus A321-271NX",
            "airline": "Sunshine Air",
            "country": "France",
        },
        {
            "registration": "N12345",
            "type": "Boeing 737-8H4",
            "airline": "Southwest Airlines",
            "country": "United States",
        },
        {
            "registration": "N29975",
            "type": "Boeing 737-924ER",
            "airline": "United Airlines",
            "country": "United States",
        },
        {
            "registration": "C-FIVS",
            "type": "Boeing 777-333ER",
            "airline": "Air Canada",
            "country": "Canada",
        },
        {
            "registration": "JA873A",
            "type": "Boeing 787-9",
            "airline": "All Nippon Airways",
            "country": "Japan",
        },
        {
            "registration": "VH-ZND",
            "type": "Airbus A321-271NX",
            "airline": "Qantas Airways",
            "country": "Australia",
        },
    ]

    for entry in sample_fleet:
        Aircraft.objects.update_or_create(
            registration=entry["registration"], defaults=entry
        )


def unseed_aircraft(apps, schema_editor):
    Aircraft = apps.get_model("core", "Aircraft")
    registrations = [
        "G-EZTH",
        "G-UZHA",
        "G-XLEL",
        "G-VNEW",
        "G-TTNA",
        "G-NEOS",
        "G-DFOG",
        "G-PRPK",
        "G-FBJF",
        "EI-DVM",
        "EI-EVK",
        "EI-LRA",
        "OY-KAT",
        "D-AIJB",
        "F-HSUN",
        "N12345",
        "N29975",
        "C-FIVS",
        "JA873A",
        "VH-ZND",
    ]
    Aircraft.objects.filter(registration__in=registrations).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_alter_aircraft_fields"),
    ]

    operations = [
        migrations.RunPython(seed_aircraft, unseed_aircraft),
    ]
