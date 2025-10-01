"""Management command to populate the Aircraft table from the live feed."""

from __future__ import annotations

from typing import Any

from django.core.management.base import BaseCommand, CommandError

from core.services import AircraftFeedError, sync_aircraft_database


class Command(BaseCommand):
    help = "Sync the local aircraft database from the configured live feed."

    def add_arguments(self, parser) -> None:  # type: ignore[override]
        parser.add_argument(
            "--limit",
            type=int,
            help=(
                "Maximum number of aircraft records to import. "
                "Defaults to AIRCRAFT_FEED_MAX_RESULTS."
            ),
        )
        parser.add_argument(
            "--no-cache",
            action="store_true",
            help="Bypass the feed cache when fetching records.",
        )
        parser.add_argument(
            "--prune",
            action="store_true",
            help="Remove aircraft that are missing from the latest feed snapshot.",
        )

    def handle(self, *args: Any, **options: Any) -> str | None:  # type: ignore[override]
        limit = options.get("limit")
        use_cache = not options.get("no_cache", False)
        prune = options.get("prune", False)

        try:
            summary = sync_aircraft_database(limit=limit, use_cache=use_cache, prune=prune)
        except AircraftFeedError as exc:  # pragma: no cover - delegated to service tests
            raise CommandError(str(exc)) from exc

        self.stdout.write(
            self.style.SUCCESS(
                f"Processed {summary['processed']} aircraft records."
            )
        )
        self.stdout.write(
            "Created: {created}, Updated: {updated}, Skipped: {skipped}, Removed: {removed}".format(
                **summary
            )
        )

        return None
