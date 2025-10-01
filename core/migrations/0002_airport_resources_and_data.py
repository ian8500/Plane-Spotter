from decimal import Decimal

from django.db import migrations, models


def load_initial_airport_data(apps, schema_editor):
    Airport = apps.get_model("core", "Airport")
    Frequency = apps.get_model("core", "Frequency")
    SpottingLocation = apps.get_model("core", "SpottingLocation")
    AirportResource = apps.get_model("core", "AirportResource")

    airports = [
        {
            "icao": "EGLL",
            "iata": "LHR",
            "name": "London Heathrow",
            "city": "London",
            "lat": 51.4700,
            "lon": -0.4543,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("128.175"), "description": "Heathrow Automatic Terminal Information Service"},
                {"service": "Ground", "mhz": Decimal("121.900"), "description": "Ground movement for Terminals 2 & 3"},
                {"service": "Tower", "mhz": Decimal("118.500"), "description": "Tower control for northern runway"},
                {"service": "Director", "mhz": Decimal("119.725"), "description": "Heathrow radar director"},
                {"service": "Delivery", "mhz": Decimal("121.975"), "description": "Clearance delivery"},
            ],
            "spots": [
                {
                    "title": "Myrtle Avenue",
                    "description": "Classic approach spot for 27L arrivals with unobstructed views and grass banking.",
                    "lat": 51.4596,
                    "lon": -0.4367,
                    "tips": "Best for afternoon light. Street parking available but respect residents.",
                },
                {
                    "title": "Renaissance Hotel",
                    "description": "Elevated views across the northern runway from the rooftop terrace.",
                    "lat": 51.4781,
                    "lon": -0.4498,
                    "tips": "Day passes available. Long lenses recommended for movements on the southern runway.",
                },
            ],
            "resources": [
                {
                    "title": "Heathrow Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGLL/EGLL_2-1.pdf",
                    "category": "map",
                    "description": "Official AD 2.2 ground movement chart for EGLL.",
                },
                {
                    "title": "Heathrow Spotting Guide",
                    "url": "https://www.airportspotting.com/london-heathrow-spotting-guide/",
                    "category": "guide",
                    "description": "Community maintained guide covering locations, hotels and photography tips.",
                },
            ],
        },
        {
            "icao": "EGKK",
            "iata": "LGW",
            "name": "London Gatwick",
            "city": "London",
            "lat": 51.1537,
            "lon": -0.1821,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("136.525"), "description": "Gatwick automatic weather"},
                {"service": "Ground", "mhz": Decimal("121.800"), "description": "Ground control north and south terminals"},
                {"service": "Tower", "mhz": Decimal("124.225"), "description": "Primary tower frequency"},
                {"service": "Approach", "mhz": Decimal("126.825"), "description": "Gatwick approach radar"},
            ],
            "spots": [
                {
                    "title": "South Terminal Car Park 5",
                    "description": "Multi-storey parking with views over the main runway and stands.",
                    "lat": 51.1566,
                    "lon": -0.1822,
                    "tips": "Upper levels offer the clearest shots. Tripod friendly with minimal glass reflections.",
                },
                {
                    "title": "Lowfield Heath Recreation Ground",
                    "description": "Approach shots for runway 26 arrivals with parkland foreground.",
                    "lat": 51.1487,
                    "lon": -0.2050,
                    "tips": "Morning light is best. Short walk from public parking on Church Road.",
                },
            ],
            "resources": [
                {
                    "title": "Gatwick Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGKK/EGKK_2-1.pdf",
                    "category": "map",
                    "description": "Official parking and taxiway diagram for EGKK.",
                },
                {
                    "title": "Spotting at Gatwick",
                    "url": "https://www.spotterguide.net/planespots/airport/egkk-gatwick/",
                    "category": "guide",
                    "description": "Detailed spotting guide with lens recommendations and sample photos.",
                },
            ],
        },
        {
            "icao": "EGCC",
            "iata": "MAN",
            "name": "Manchester",
            "city": "Manchester",
            "lat": 53.3650,
            "lon": -2.2728,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("118.580"), "description": "Manchester ATIS"},
                {"service": "Ground", "mhz": Decimal("121.850"), "description": "Ground movement control"},
                {"service": "Tower", "mhz": Decimal("118.625"), "description": "Runway 23L/05R operations"},
                {"service": "Approach", "mhz": Decimal("118.575"), "description": "Manchester approach radar"},
            ],
            "spots": [
                {
                    "title": "Runway Visitor Park",
                    "description": "Dedicated viewing park with raised mounds, Concorde exhibit and facilities.",
                    "lat": 53.3534,
                    "lon": -2.2864,
                    "tips": "Entry fee applies. Elevated mounds ideal for 23R/05L movements.",
                },
                {
                    "title": "Southside Viewing Area",
                    "description": "Gravelled area adjacent to runway 23L threshold.",
                    "lat": 53.3389,
                    "lon": -2.2809,
                    "tips": "No facilities. Bring stepladders for fence line shots.",
                },
            ],
            "resources": [
                {
                    "title": "Manchester Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGCC/EGCC_2-1.pdf",
                    "category": "map",
                    "description": "Taxiway layout and stand numbering for Manchester.",
                },
                {
                    "title": "Manchester Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/egcc-manchester/",
                    "category": "guide",
                    "description": "Up-to-date community guide with photography advice.",
                },
            ],
        },
        {
            "icao": "EGSS",
            "iata": "STN",
            "name": "London Stansted",
            "city": "London",
            "lat": 51.8850,
            "lon": 0.2350,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("127.180"), "description": "Stansted weather"},
                {"service": "Ground", "mhz": Decimal("121.650"), "description": "Ground movements"},
                {"service": "Tower", "mhz": Decimal("123.805"), "description": "Runway operations"},
                {"service": "Approach", "mhz": Decimal("120.625"), "description": "Essex radar"},
            ],
            "spots": [
                {
                    "title": "Belmer Road",
                    "description": "Great for 22 arrivals with aircraft passing low over the lane.",
                    "lat": 51.8814,
                    "lon": 0.2247,
                    "tips": "Limited parking. Be mindful of farm traffic and keep clear of private land.",
                },
                {
                    "title": "Long Stay Car Park",
                    "description": "Views of cargo apron and runway holding points from perimeter fencing.",
                    "lat": 51.8786,
                    "lon": 0.2422,
                    "tips": "Free shuttle bus from terminal. Afternoon light favours this position.",
                },
            ],
            "resources": [
                {
                    "title": "Stansted Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGSS/EGSS_2-1.pdf",
                    "category": "map",
                    "description": "Airfield ground chart published by NATS.",
                },
                {
                    "title": "Stansted Spotting Locations",
                    "url": "https://www.spotterguide.net/planespots/airport/egss-london-stansted/",
                    "category": "guide",
                    "description": "Guide with maps, parking suggestions and example shots.",
                },
            ],
        },
        {
            "icao": "EGGW",
            "iata": "LTN",
            "name": "London Luton",
            "city": "Luton",
            "lat": 51.8747,
            "lon": -0.3683,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("132.955"), "description": "Luton ATIS"},
                {"service": "Ground", "mhz": Decimal("121.600"), "description": "Ground control"},
                {"service": "Tower", "mhz": Decimal("132.555"), "description": "Runway and circuit traffic"},
                {"service": "Approach", "mhz": Decimal("129.550"), "description": "Luton approach"},
            ],
            "spots": [
                {
                    "title": "Alyth Road Hill",
                    "description": "Elevated hill giving panoramic views over the airfield.",
                    "lat": 51.8763,
                    "lon": -0.3641,
                    "tips": "Popular at weekends. Bring a stool for shots over the fence.",
                },
                {
                    "title": "Runway 26 Approach Path",
                    "description": "Grass verge near the touchdown zone for runway 26 arrivals.",
                    "lat": 51.8692,
                    "lon": -0.3584,
                    "tips": "Limited parking on Eaton Green Road. Best in afternoon light.",
                },
            ],
            "resources": [
                {
                    "title": "Luton Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGGW/EGGW_2-1.pdf",
                    "category": "map",
                    "description": "Taxiway and stand layout for London Luton.",
                },
                {
                    "title": "Luton Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/eggw-london-luton/",
                    "category": "guide",
                    "description": "Coverage of key vantage points and sample photos.",
                },
            ],
        },
        {
            "icao": "EGBB",
            "iata": "BHX",
            "name": "Birmingham",
            "city": "Birmingham",
            "lat": 52.4539,
            "lon": -1.7480,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("136.050"), "description": "Birmingham ATIS"},
                {"service": "Ground", "mhz": Decimal("121.800"), "description": "Ground movement"},
                {"service": "Tower", "mhz": Decimal("118.300"), "description": "Runway 15/33 operations"},
                {"service": "Approach", "mhz": Decimal("123.800"), "description": "Birmingham radar"},
            ],
            "spots": [
                {
                    "title": "Sheldon Country Park",
                    "description": "Public park with viewing mound adjacent to runway 33 threshold.",
                    "lat": 52.4525,
                    "lon": -1.7608,
                    "tips": "Free parking. Ideal for afternoon departures on 33.",
                },
                {
                    "title": "Multi-Storey Car Park 5",
                    "description": "Top level overlooks apron and main runway.",
                    "lat": 52.4520,
                    "lon": -1.7431,
                    "tips": "Tripod friendly but be mindful of barrier height.",
                },
            ],
            "resources": [
                {
                    "title": "Birmingham Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGBB/EGBB_2-1.pdf",
                    "category": "map",
                    "description": "Ground layout for Birmingham Airport.",
                },
                {
                    "title": "Birmingham Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/egbb-birmingham/",
                    "category": "guide",
                    "description": "Guide to spotting locations including Sheldon Country Park.",
                },
            ],
        },
        {
            "icao": "EGPH",
            "iata": "EDI",
            "name": "Edinburgh",
            "city": "Edinburgh",
            "lat": 55.9486,
            "lon": -3.3641,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("128.955"), "description": "Edinburgh ATIS"},
                {"service": "Ground", "mhz": Decimal("121.700"), "description": "Ground control"},
                {"service": "Tower", "mhz": Decimal("118.700"), "description": "Tower operations"},
                {"service": "Approach", "mhz": Decimal("121.200"), "description": "Scottish approach"},
            ],
            "spots": [
                {
                    "title": "16 Threshold Mound",
                    "description": "Grass mound near runway 16 touchdown zone with excellent arrival views.",
                    "lat": 55.9405,
                    "lon": -3.3523,
                    "tips": "Morning light favours this spot. Limited parking nearby.",
                },
                {
                    "title": "Ingliston Park & Ride",
                    "description": "Raised car park overlooking the cargo apron and runway.",
                    "lat": 55.9392,
                    "lon": -3.3640,
                    "tips": "Parking charges apply. Short walk to the fence line.",
                },
            ],
            "resources": [
                {
                    "title": "Edinburgh Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGPH/EGPH_2-1.pdf",
                    "category": "map",
                    "description": "Official aerodrome chart for EGPH.",
                },
                {
                    "title": "Edinburgh Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/egph-edinburgh/",
                    "category": "guide",
                    "description": "Recommended spots, best light and lens suggestions.",
                },
            ],
        },
        {
            "icao": "EGPF",
            "iata": "GLA",
            "name": "Glasgow",
            "city": "Glasgow",
            "lat": 55.8719,
            "lon": -4.4331,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("123.750"), "description": "Glasgow ATIS"},
                {"service": "Ground", "mhz": Decimal("121.700"), "description": "Ground control"},
                {"service": "Tower", "mhz": Decimal("118.800"), "description": "Tower operations"},
                {"service": "Approach", "mhz": Decimal("119.100"), "description": "Scottish approach"},
            ],
            "spots": [
                {
                    "title": "Mound at 05 Threshold",
                    "description": "Popular earth bank adjacent to runway 05 for arrival shots.",
                    "lat": 55.8693,
                    "lon": -4.4262,
                    "tips": "Parking available at nearby retail park. Afternoon light recommended.",
                },
                {
                    "title": "Long Stay Car Park 2",
                    "description": "Views across the terminal stands and runway from the upper levels.",
                    "lat": 55.8728,
                    "lon": -4.4377,
                    "tips": "Glass panels require careful positioning to avoid reflections.",
                },
            ],
            "resources": [
                {
                    "title": "Glasgow Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGPF/EGPF_2-1.pdf",
                    "category": "map",
                    "description": "Ground chart covering stands and taxiways at Glasgow.",
                },
                {
                    "title": "Glasgow Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/egpf-glasgow/",
                    "category": "guide",
                    "description": "Community maintained spotting tips.",
                },
            ],
        },
        {
            "icao": "EGGD",
            "iata": "BRS",
            "name": "Bristol",
            "city": "Bristol",
            "lat": 51.3827,
            "lon": -2.7191,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("134.575"), "description": "Bristol ATIS"},
                {"service": "Ground", "mhz": Decimal("121.900"), "description": "Ground movement"},
                {"service": "Tower", "mhz": Decimal("133.850"), "description": "Tower control"},
                {"service": "Approach", "mhz": Decimal("136.075"), "description": "Bristol radar"},
            ],
            "spots": [
                {
                    "title": "Aircraft Viewing Area",
                    "description": "Official viewing area next to the silver zone car park with picnic benches.",
                    "lat": 51.3896,
                    "lon": -2.7055,
                    "tips": "Small entry fee. Great for runway 27 arrivals.",
                },
                {
                    "title": "Felton Common",
                    "description": "Open common land providing elevated views over the airfield.",
                    "lat": 51.3725,
                    "lon": -2.7135,
                    "tips": "Best in the morning. Bring waterproof footwear after rain.",
                },
            ],
            "resources": [
                {
                    "title": "Bristol Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGGD/EGGD_2-1.pdf",
                    "category": "map",
                    "description": "Official ground chart for Bristol.",
                },
                {
                    "title": "Bristol Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/eggd-bristol/",
                    "category": "guide",
                    "description": "Guide featuring Felton Common and on-airport viewing terrace.",
                },
            ],
        },
        {
            "icao": "EGNT",
            "iata": "NCL",
            "name": "Newcastle",
            "city": "Newcastle",
            "lat": 55.0375,
            "lon": -1.6917,
            "frequencies": [
                {"service": "ATIS", "mhz": Decimal("133.030"), "description": "Newcastle ATIS"},
                {"service": "Ground", "mhz": Decimal("121.700"), "description": "Ground movements"},
                {"service": "Tower", "mhz": Decimal("119.700"), "description": "Tower control"},
                {"service": "Approach", "mhz": Decimal("124.380"), "description": "Newcastle approach"},
            ],
            "spots": [
                {
                    "title": "Runway 25 Approach Embankment",
                    "description": "Grassed embankment alongside the approach road for runway 25 arrivals.",
                    "lat": 55.0399,
                    "lon": -1.7045,
                    "tips": "Afternoon light. Short stay parking available nearby.",
                },
                {
                    "title": "Long Stay Car Park",
                    "description": "Upper levels provide sightlines across the apron and runway.",
                    "lat": 55.0378,
                    "lon": -1.6900,
                    "tips": "Best around sunset when the terminal face is illuminated.",
                },
            ],
            "resources": [
                {
                    "title": "Newcastle Aerodrome Chart",
                    "url": "https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-12-28-AIRAC/graphics/Charts/EGNT/EGNT_2-1.pdf",
                    "category": "map",
                    "description": "Official ground chart for Newcastle.",
                },
                {
                    "title": "Newcastle Spotting Guide",
                    "url": "https://www.spotterguide.net/planespots/airport/egnt-newcastle/",
                    "category": "guide",
                    "description": "Community recommendations for the embankment and car parks.",
                },
            ],
        },
    ]

    for data in airports:
        airport, _ = Airport.objects.get_or_create(
            icao=data["icao"],
            defaults={
                "iata": data["iata"],
                "name": data["name"],
                "city": data["city"],
                "country": "United Kingdom",
                "lat": data["lat"],
                "lon": data["lon"],
            },
        )

        # Ensure core fields stay in sync if the airport already existed
        airport.iata = data["iata"]
        airport.name = data["name"]
        airport.city = data["city"]
        airport.country = "United Kingdom"
        airport.lat = data["lat"]
        airport.lon = data["lon"]
        airport.save()

        for freq in data["frequencies"]:
            Frequency.objects.update_or_create(
                airport=airport,
                service=freq["service"],
                defaults={
                    "mhz": freq["mhz"],
                    "description": freq["description"],
                },
            )

        for spot in data["spots"]:
            SpottingLocation.objects.update_or_create(
                airport=airport,
                title=spot["title"],
                defaults={
                    "description": spot["description"],
                    "lat": spot["lat"],
                    "lon": spot["lon"],
                    "tips": spot["tips"],
                },
            )

        for resource in data["resources"]:
            AirportResource.objects.update_or_create(
                airport=airport,
                title=resource["title"],
                defaults={
                    "url": resource["url"],
                    "category": resource["category"],
                    "description": resource["description"],
                },
            )


def remove_initial_airport_data(apps, schema_editor):
    Airport = apps.get_model("core", "Airport")
    Frequency = apps.get_model("core", "Frequency")
    SpottingLocation = apps.get_model("core", "SpottingLocation")
    AirportResource = apps.get_model("core", "AirportResource")

    icaos = [
        "EGLL",
        "EGKK",
        "EGCC",
        "EGSS",
        "EGGW",
        "EGBB",
        "EGPH",
        "EGPF",
        "EGGD",
        "EGNT",
    ]

    AirportResource.objects.filter(airport__icao__in=icaos).delete()
    SpottingLocation.objects.filter(airport__icao__in=icaos).delete()
    Frequency.objects.filter(airport__icao__in=icaos).delete()
    Airport.objects.filter(icao__in=icaos).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="AirportResource",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("url", models.URLField()),
                ("category", models.CharField(choices=[("map", "Map"), ("guide", "Guide"), ("official", "Official"), ("community", "Community"), ("video", "Video")], default="guide", max_length=20)),
                ("description", models.TextField(blank=True)),
                ("airport", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="resources", to="core.airport")),
            ],
            options={
                "ordering": ["airport", "title"],
            },
        ),
        migrations.RunPython(load_initial_airport_data, remove_initial_airport_data),
    ]

