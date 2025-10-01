"""Utilities for fetching aircraft fleet data from external feeds."""

from __future__ import annotations

import csv
import io
import logging
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Iterator, List, Optional, Set

from django.conf import settings
from django.core.cache import cache
from django.db import transaction

from core.models import Aircraft


class AircraftFeedError(RuntimeError):
    """Raised when a live aircraft feed cannot be retrieved."""


logger = logging.getLogger(__name__)


FALLBACK_DATASET = Path(__file__).resolve().parent / "data" / "aircraft_sample.csv"


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

    def _read_from_handle(handle: io.TextIOBase) -> List[Dict[str, str]]:
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
        return matches

    def _load_from_fallback() -> List[Dict[str, str]]:
        if not FALLBACK_DATASET.exists():
            raise AircraftFeedError("Aircraft feed is unavailable and no fallback dataset is bundled")
        with FALLBACK_DATASET.open("r", encoding="utf-8") as handle:
            return _read_from_handle(handle)

    feed_url = url or settings.AIRCRAFT_FEED_URL
    try:
        with _open_feed(feed_url) as handle:
            matches = _read_from_handle(handle)
    except AircraftFeedError:
        logger.warning("Falling back to bundled aircraft sample dataset", exc_info=True)
        matches = _load_from_fallback()

    if cache_key and not (registration_filter or country_filter):
        cache.set(cache_key, matches, settings.AIRCRAFT_FEED_CACHE_SECONDS)

    return matches


def _trim(value: Optional[str], *, max_length: int) -> str:
    return (value or "").strip()[:max_length]


def sync_aircraft_database(
    *,
    limit: Optional[int] = None,
    use_cache: bool = False,
    prune: bool = False,
) -> Dict[str, int]:
    """Populate the local :class:`~core.models.Aircraft` table from the live feed."""

    records = fetch_live_fleet(limit=limit, use_cache=use_cache)

    type_max = Aircraft._meta.get_field("type").max_length  # type: ignore[arg-type]
    airline_max = Aircraft._meta.get_field("airline").max_length  # type: ignore[arg-type]
    country_max = Aircraft._meta.get_field("country").max_length  # type: ignore[arg-type]

    created = 0
    updated = 0
    skipped = 0
    seen: Set[str] = set()

    with transaction.atomic():
        for entry in records:
            registration = _trim(entry.get("registration"), max_length=16).upper()
            if not registration or registration in seen:
                skipped += 1
                continue

            seen.add(registration)

            type_value = _trim(
                entry.get("model")
                or entry.get("type_code")
                or entry.get("icao_aircraft_type"),
                max_length=type_max,
            )
            airline_value = _trim(entry.get("operator") or entry.get("owner"), max_length=airline_max)
            country_value = _trim(entry.get("country"), max_length=country_max)

            defaults = {
                "type": type_value,
                "airline": airline_value,
                "country": country_value,
            }

            aircraft, created_flag = Aircraft.objects.get_or_create(
                registration=registration, defaults=defaults
            )

            if created_flag:
                created += 1
                continue

            fields_to_update = []
            for field, value in defaults.items():
                if getattr(aircraft, field) != value:
                    setattr(aircraft, field, value)
                    fields_to_update.append(field)

            if fields_to_update:
                aircraft.save(update_fields=fields_to_update)
                updated += 1

    removed = 0
    if prune and seen:
        removed, _ = Aircraft.objects.exclude(registration__in=seen).delete()

    summary = {
        "processed": len(records),
        "created": created,
        "updated": updated,
        "skipped": skipped,
        "removed": removed,
    }

    logger.info("Aircraft database sync complete: %s", summary)

    return summary

