import io
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.management import call_command
from django.test import SimpleTestCase, TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory

from .models import Aircraft, UserSeen
from .services import aircraft_feed


SAMPLE_CSV = """icao24,registration,manufacturername,manufacturericao,model,typecode,icaoaircrafttype,operator,operatorcallsign,owner,serialnumber,built,registeredcountry,operatorcountry
abcd12,G-EZTH,Airbus,A320,Airbus A320-214,A320,L2J,EASYJET AIRLINE COMPANY LIMITED,EZY,EASYJET AIRLINE,1234,2014,United Kingdom,United Kingdom
bbcd34,N12345,Boeing,B738,Boeing 737-8H4,B738,L2J,Southwest Airlines Co.,SWA,Southwest Airlines,9876,2017,United States,United States
ccdd56,C-FGHI,Bombardier,CRJ9,Bombardier CRJ900,CRJ9,L2J,Air Canada Express,ACAX,Jazz Aviation,5555,2015,Canada,Canada
"""


class FetchLiveFleetTests(SimpleTestCase):
    def setUp(self):
        cache.clear()

    def _mock_feed(self):
        return io.StringIO(SAMPLE_CSV)

    def test_fetch_live_fleet_filters_registration_and_country(self):
        with mock.patch.object(aircraft_feed, "_open_feed", side_effect=self._mock_feed):
            results = aircraft_feed.fetch_live_fleet(
                registration="G-",
                country="kingdom",
                limit=5,
                use_cache=False,
            )

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["registration"], "G-EZTH")
        self.assertEqual(results[0]["country"], "United Kingdom")

    def test_fetch_live_fleet_uses_cache(self):
        with mock.patch.object(aircraft_feed, "_open_feed", side_effect=self._mock_feed) as opener:
            first = aircraft_feed.fetch_live_fleet(limit=2)
            second = aircraft_feed.fetch_live_fleet(limit=2)

        self.assertEqual(len(first), 2)
        self.assertEqual(first, second)
        self.assertEqual(opener.call_count, 1)

    def test_fetch_live_fleet_limits_results(self):
        with mock.patch.object(aircraft_feed, "_open_feed", side_effect=self._mock_feed):
            results = aircraft_feed.fetch_live_fleet(limit=1, use_cache=False)

        self.assertEqual(len(results), 1)

    def test_fetch_live_fleet_falls_back_to_sample_dataset(self):
        with mock.patch.object(
            aircraft_feed,
            "_open_feed",
            side_effect=aircraft_feed.AircraftFeedError("boom"),
        ):
            results = aircraft_feed.fetch_live_fleet(limit=5, use_cache=False)

        self.assertGreater(len(results), 0)
        registrations = {item["registration"] for item in results}
        self.assertIn("G-EZTH", registrations)


class LiveFleetViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    @override_settings(AIRCRAFT_FEED_MAX_RESULTS=10)
    def test_live_fleet_view_returns_payload(self):
        request = self.factory.get("/api/fleet/live/?limit=2")
        sample_payload = [
            {
                "icao24": "abcd12",
                "registration": "G-EZTH",
                "manufacturer": "Airbus",
                "model": "A320-214",
                "type_code": "A320",
                "icao_aircraft_type": "L2J",
                "operator": "EASYJET AIRLINE COMPANY LIMITED",
                "operator_callsign": "EZY",
                "owner": "EASYJET AIRLINE",
                "serial_number": "1234",
                "built": "2014",
                "country": "United Kingdom",
            }
        ]

        with mock.patch.object(aircraft_feed, "fetch_live_fleet", return_value=sample_payload):
            from .views import LiveFleetView

            response = LiveFleetView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"], sample_payload)

    def test_live_fleet_view_handles_errors(self):
        request = self.factory.get("/api/fleet/live/")

        with mock.patch.object(
            aircraft_feed,
            "fetch_live_fleet",
            side_effect=aircraft_feed.AircraftFeedError("network down"),
        ):
            from .views import LiveFleetView

            response = LiveFleetView.as_view()(request)

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["detail"], "network down")


class SyncAircraftDatabaseTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_sync_creates_and_updates_records(self):
        first_payload = [
            {
                "registration": "G-EZTH",
                "model": "A320-214",
                "type_code": "A320",
                "operator": "EasyJet",
                "country": "United Kingdom",
            },
            {
                "registration": "N12345",
                "model": "737-8H4",
                "type_code": "B738",
                "operator": "Southwest Airlines",
                "country": "United States",
            },
        ]

        with mock.patch.object(aircraft_feed, "fetch_live_fleet", return_value=first_payload):
            summary = aircraft_feed.sync_aircraft_database(use_cache=False)

        self.assertEqual(summary["created"], 2)
        self.assertEqual(summary["updated"], 0)
        self.assertEqual(Aircraft.objects.count(), 2)

        updated_payload = [
            {
                "registration": "G-EZTH",
                "model": "A320-214",
                "operator": "easyJet Airline Company Limited",
                "country": "United Kingdom",
            },
            {
                "registration": "N12345",
                "model": "737-8H4",
                "type_code": "B738",
                "operator": "Southwest Airlines",
                "country": "USA",
            },
        ]

        with mock.patch.object(aircraft_feed, "fetch_live_fleet", return_value=updated_payload):
            summary = aircraft_feed.sync_aircraft_database(use_cache=False)

        self.assertEqual(summary["created"], 0)
        self.assertEqual(summary["updated"], 2)
        updated_aircraft = Aircraft.objects.get(registration="G-EZTH")
        self.assertEqual(updated_aircraft.airline, "easyJet Airline Company Limited")

    def test_sync_prunes_missing_records(self):
        Aircraft.objects.create(
            registration="OLD123",
            type="A320",
            airline="Old Airline",
            country="UK",
        )

        payload = [
            {
                "registration": "NEW999",
                "model": "A350-900",
                "operator": "Futuristic Air",
                "country": "United Kingdom",
            }
        ]

        with mock.patch.object(aircraft_feed, "fetch_live_fleet", return_value=payload):
            summary = aircraft_feed.sync_aircraft_database(use_cache=False, prune=True)

        self.assertEqual(summary["removed"], 1)
        self.assertFalse(Aircraft.objects.filter(registration="OLD123").exists())
        self.assertTrue(Aircraft.objects.filter(registration="NEW999").exists())


class SyncAircraftCommandTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_management_command_outputs_summary(self):
        payload = [
            {
                "registration": "F-HSUN",
                "model": "A321neo",
                "operator": "Sunshine Air",
                "country": "France",
            }
        ]

        with mock.patch.object(aircraft_feed, "fetch_live_fleet", return_value=payload):
            out = io.StringIO()
            call_command("sync_aircraft_database", stdout=out)

        output = out.getvalue()
        self.assertIn("Processed 1 aircraft records.", output)
        self.assertIn("Created: 1, Updated: 0", output)
        self.assertTrue(Aircraft.objects.filter(registration="F-HSUN").exists())


class UserSeenAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="spotter",
            email="spotter@example.com",
            password="supersecret",
        )
        self.client.force_authenticate(self.user)
        self.aircraft = Aircraft.objects.create(
            registration="G-EZTH",
            type="Airbus A320-214",
            airline="easyJet",
            country="United Kingdom",
        )

    def test_user_can_log_seen_aircraft_by_registration(self):
        response = self.client.post(
            "/api/seen/",
            {"registration": self.aircraft.registration},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserSeen.objects.filter(user=self.user).count(), 1)
        entry = UserSeen.objects.get(user=self.user)
        self.assertEqual(entry.aircraft, self.aircraft)
        self.assertIn("aircraft", response.data)
        self.assertEqual(response.data["aircraft"]["registration"], self.aircraft.registration)

    def test_user_only_sees_their_own_entries(self):
        mine = UserSeen.objects.create(user=self.user, aircraft=self.aircraft)
        other_user = get_user_model().objects.create_user(
            username="other",
            email="other@example.com",
            password="secret",
        )
        other_aircraft = Aircraft.objects.create(
            registration="N12345",
            type="Boeing 737",
            airline="Southwest",
            country="United States",
        )
        UserSeen.objects.create(user=other_user, aircraft=other_aircraft)

        response = self.client.get("/api/seen/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], mine.id)
