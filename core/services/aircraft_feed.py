"""Utilities for fetching aircraft fleet data from external feeds."""

from __future__ import annotations

import csv
import io
import urllib.request
from dataclasses import dataclass
from typing import Dict, Iterable, Iterator, List, Optional

from django.conf import settings
from django.core.cache import cache


class AircraftFeedError(RuntimeError):
    """Raised when a live aircraft feed cannot be retrieved."""


@dataclass(frozen=True)
class AircraftRecord:
    icao24: str
    registration: str
    manufacturer: str
    model: str
    type_code: str
    icao_aircraft_type: str
    operator: str
    operator_callsign: str
    owner: str
    serial_number: str
    built: str
    country: str

    @classmethod
    def from_row(cls, row: Dict[str, str]) -> "AircraftRecord":
        """Normalise a CSV row from the OpenSky aircraft database."""

        def clean(key: str) -> str:
            return (row.get(key) or "").strip()

        return cls(
            icao24=clean("icao24").lower(),
            registration=clean("registration"),
            manufacturer=clean("manufacturername") or clean("manufacturericao"),
            model=clean("model"),
            type_code=clean("typecode"),
            icao_aircraft_type=clean("icaoaircrafttype"),
            operator=clean("operator"),
            operator_callsign=clean("operatorcallsign"),
            owner=clean("owner"),
            serial_number=clean("serialnumber"),
            built=clean("built"),
            country=clean("registeredcountry") or clean("operatorcountry") or clean("owner")
        )

    def as_dict(self) -> Dict[str, str]:
        return {
            "icao24": self.icao24,
            "registration": self.registration,
            "manufacturer": self.manufacturer,
            "model": self.model,
            "type_code": self.type_code,
            "icao_aircraft_type": self.icao_aircraft_type,
            "operator": self.operator,
            "operator_callsign": self.operator_callsign,
            "owner": self.owner,
            "serial_number": self.serial_number,
            "built": self.built,
            "country": self.country,
        }


def _open_feed(url: str) -> io.TextIOBase:
    """Open the remote CSV feed with sane defaults."""

    try:
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "PlaneSpotter/1.0 (+https://github.com/)",
                "Accept": "text/csv,application/octet-stream",
            },
        )
        response = urllib.request.urlopen(request, timeout=settings.AIRCRAFT_FEED_TIMEOUT)
        return io.TextIOWrapper(response, encoding="utf-8", errors="replace")
    except Exception as exc:  # pragma: no cover - network errors mocked in tests
        raise AircraftFeedError(str(exc)) from exc


def _iter_records(reader: Iterable[Dict[str, str]]) -> Iterator[AircraftRecord]:
    for row in reader:
        record = AircraftRecord.from_row(row)
        if record.registration or record.icao24:
            yield record


def fetch_live_fleet(
    *,
    registration: Optional[str] = None,
    country: Optional[str] = None,
    limit: Optional[int] = None,
    url: Optional[str] = None,
    use_cache: bool = True,
) -> List[Dict[str, str]]:
    """Fetch live aircraft data and return a list of dictionaries.

    Results can be filtered by registration substring and country (case insensitive).
    """

    limit = limit or settings.AIRCRAFT_FEED_MAX_RESULTS
    limit = min(limit, settings.AIRCRAFT_FEED_MAX_RESULTS)
    cache_key = None

    registration_filter = registration.lower() if registration else None
    country_filter = country.lower() if country else None

    if use_cache and registration_filter is None and country_filter is None:
        cache_key = f"aircraft-feed:{limit}:{url or ''}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached[:limit]

    feed_url = url or settings.AIRCRAFT_FEED_URL
    with _open_feed(feed_url) as handle:
        reader = csv.DictReader(handle)
        matches: List[Dict[str, str]] = []
        for record in _iter_records(reader):
            if registration_filter and registration_filter not in record.registration.lower():
                continue
            if country_filter and country_filter not in record.country.lower():
                continue
            matches.append(record.as_dict())
            if len(matches) >= limit:
                break

    if cache_key and not (registration_filter or country_filter):
        cache.set(cache_key, matches, settings.AIRCRAFT_FEED_CACHE_SECONDS)

    return matches

