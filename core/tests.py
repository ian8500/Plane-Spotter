import io
from unittest import mock

from django.core.cache import cache
from django.test import SimpleTestCase, override_settings
from rest_framework.test import APIRequestFactory

from .services import aircraft_feed


SAMPLE_CSV = """icao24,registration,manufacturername,model,typecode,icaoaircrafttype,operator,operatorcallsign,owner,serialnumber,built,registeredcountry,operatorcountry
abcd12,G-EZTH,Airbus,A320-214,A320,L2J,EASYJET AIRLINE COMPANY LIMITED,EZY,EASYJET AIRLINE,1234,2014,United Kingdom,United Kingdom
bbcd34,N12345,Boeing,737-8H4,B738,L2J,Southwest Airlines Co.,SWA,Southwest Airlines,9876,2017,United States,United States
ccdd56,C-FGHI,Bombardier,CRJ900,CRJ9,L2J,Air Canada Express,ACAX,Jazz Aviation,5555,2015,Canada,Canada
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
