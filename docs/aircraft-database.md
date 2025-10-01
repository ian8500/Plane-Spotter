# Aircraft Database Synchronisation

The aircraft logbook in the web client reads from the `/aircraft/` endpoint, which serves records from the `core.Aircraft` model. A fresh install only contains the schema, so you need to load some fleet data before those lookups will work. The steps below walk through preparing the environment, running the migrations (which include a baked-in sample fleet), and importing the latest aircraft feed.

## Prerequisites

1. **Install backend dependencies.** From an activated virtual environment run:

   ```bash
   pip install -r requirements.txt
   ```

   The requirements list ships with the repo and covers Django, Django REST Framework, CORS headers, and JWT auth.

2. **Apply the database migrations.** This creates the schema and executes the seed migration that inserts roughly two dozen representative aircraft registrations:

   ```bash
   python manage.py migrate
   ```

   The migration uses `update_or_create`, so it is safe to rerun after pulling updates — existing sample tail numbers will be refreshed rather than duplicated.

## Quick Bootstrap (Recommended)

If you want the backend ready in a single step, use the bundled bootstrapper after installing dependencies:

```bash
python manage.py bootstrap_aircraft_fleet
```

The command applies migrations (seeding the baked-in sample fleet) and then pulls live aircraft data from the configured feed. It prints a summary of how many registrations were created, updated, skipped, or removed.

Use this route when you just want a working environment without juggling multiple commands — for example when spinning up a review app or refreshing a local database before testing the UI.

### Useful options

- `--skip-sync` – run migrations only and skip the live feed import.
- `--limit <n>` – cap the number of rows fetched from the feed (defaults to `AIRCRAFT_FEED_MAX_RESULTS`).
- `--no-cache` – ignore the in-memory cache and force a fresh download.
- `--prune` – remove aircraft that do not appear in the most recent snapshot. Use this when performing a full refresh.

## One-off or Manual Sync

If you prefer to control the steps yourself, you can still call the sync command directly after the prerequisites:

```bash
python manage.py sync_aircraft_database
```

This downloads up to `AIRCRAFT_FEED_MAX_RESULTS` records (default `200`) from the OpenSky aircraft metadata feed and upserts them into the local database. Existing registrations are updated with the latest airline, type, and country information. Reach for this approach when you need to orchestrate migrations separately (for example as part of a CI workflow) or when you want to run an import with customised flags.

## Updating the Feed Configuration

The command uses the same settings as the live fleet endpoint. To change the source or increase the cap, set the following environment variables before running the command:

- `AIRCRAFT_FEED_URL`
- `AIRCRAFT_FEED_MAX_RESULTS`
- `AIRCRAFT_FEED_TIMEOUT`

Adjust `AIRCRAFT_FEED_MAX_RESULTS` if you want to prefill the database with a larger slice of the fleet for autocomplete in the logbook.

## Verifying the Data

After the sync completes, you can sanity-check the results by opening a Django shell and counting the aircraft or by visiting the fleet browser in the web client:

```bash
python manage.py shell
```

```python
from core.models import Aircraft
Aircraft.objects.count()
```

Expect at least the sample registrations from the migration, with additional entries filled in by the feed import. When the count remains unchanged, review the management command output — it will tell you whether records were skipped (already up-to-date) or if the remote feed could not be reached.
