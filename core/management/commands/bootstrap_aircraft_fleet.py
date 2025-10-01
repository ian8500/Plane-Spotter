"""Management command to fully bootstrap the aircraft fleet data."""

from __future__ import annotations

from typing import Any

from django.core.management import BaseCommand, CommandError, call_command

from core.services import AircraftFeedError, sync_aircraft_database


class Command(BaseCommand):
    help = (
        "Apply database migrations and populate the Aircraft table from the configured feed."
    )

    def add_arguments(self, parser) -> None:  # type: ignore[override]
        parser.add_argument(
            "--skip-sync",
            action="store_true",
            help="Only run migrations and skip downloading the live fleet feed.",
        )
        parser.add_argument(
            "--limit",
            type=int,
            help=(
                "Maximum number of aircraft records to import when syncing. "
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
        verbosity = int(options.get("verbosity", 1))
        migrate_verbosity = max(verbosity - 1, 0)

        self.stdout.write("Applying database migrations...")
        call_command("migrate", interactive=False, verbosity=migrate_verbosity)
        self.stdout.write(self.style.SUCCESS("Migrations applied."))

        if options.get("skip_sync"):
            self.stdout.write("Skipping live fleet import as requested.")
            return None

        limit = options.get("limit")
        use_cache = not options.get("no_cache", False)
        prune = options.get("prune", False)

        self.stdout.write("Importing aircraft from the live feed...")
        try:
            summary = sync_aircraft_database(
                limit=limit,
                use_cache=use_cache,
                prune=prune,
            )
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
