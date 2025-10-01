# Aircraft Database Synchronisation

The aircraft logbook in the web client reads from the `/aircraft/` endpoint, which serves records from the `core.Aircraft` model. A fresh install only contains the schema, so you need to import live data from the OpenSky aircraft database feed before those lookups will work.

## One-off or Manual Sync

Run the management command below from the project root after the virtualenv is activated:

```bash
python manage.py sync_aircraft_database
```

This downloads up to `AIRCRAFT_FEED_MAX_RESULTS` records (default `200`) from the feed and upserts them into the local database. Existing registrations are updated with the latest airline, type, and country information.

### Useful options

- `--limit <n>` – override the number of records fetched from the feed.
- `--no-cache` – ignore the in-memory cache and force a fresh download.
- `--prune` – remove aircraft that do not appear in the most recent snapshot. Use this when performing a full refresh.

## Updating the Feed Configuration

The command uses the same settings as the live fleet endpoint. To change the source or increase the cap, set the following environment variables before running the command:

- `AIRCRAFT_FEED_URL`
- `AIRCRAFT_FEED_MAX_RESULTS`
- `AIRCRAFT_FEED_TIMEOUT`

Adjust `AIRCRAFT_FEED_MAX_RESULTS` if you want to prefill the database with a larger slice of the fleet for autocomplete in the logbook.
