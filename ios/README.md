# Plane Spotter iOS

This directory contains a native SwiftUI implementation of the Plane Spotter client so you can run the experience on iPhone and iPad. The app talks to the existing Django REST API that powers the web experience.

## Features

- SwiftUI navigation hub that mirrors the sections of the web product.
- Airport list with search, pull-to-refresh, and detail pages.
- Airport detail view that renders frequencies, spotting locations, and external resources with native styling and a MapKit preview.
- Map view that plots all airports and lets you jump between them with animated camera transitions.
- Frequency learning guide with rich text cards.
- Live ADS-B browser that streams the latest fleet data from the Django backend with filtering controls.
- Placeholder screens for Logbook and Community to highlight the API integration points that still need to be built.

## Getting started

1. Open `ios/PlaneSpotter/PlaneSpotter.xcodeproj` in Xcode 15 or newer (iOS 17 SDK).
2. Update the `API_BASE_URL` entry in `PlaneSpotter/Info.plist` if your backend is not running on `http://localhost:8000/api`.
3. (Optional) Configure App Transport Security in the project settings if you are connecting to a non-HTTPS development server.
4. Build and run the app on the iOS simulator or a physical device.

### Running the backend locally

```bash
# From the repository root
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Ensure your simulator can reach the backend host. When running inside Docker, replace `localhost` with your machine IP and update `API_BASE_URL` accordingly.

### Live ADS-B feed configuration

The Live ADS-B tab calls the `/api/fleet/live/` endpoint, which proxies the OpenSky aircraft metadata CSV. Override `AIRCRAFT_FEED_URL` in `backend/.env` if you prefer a different data source and ensure the Django server has network access.

## Extending the app

- **Live ADS-B**: extend the list to include richer visuals such as a map overlay or sorting/grouping controls. The view already consumes the `/api/fleet/live/` endpoint and can be themed further.
- **Logbook sync**: call the `/api/seen/` endpoint using authenticated requests to keep a local spotting log.
- **Community**: wire up `/api/posts/`, `/api/comments/`, and `/api/badges/` to deliver social features.
- **Offline caching**: wrap the networking layer with persistence to support offline browsing when at the airport.

## Project structure

```
ios/PlaneSpotter
├── PlaneSpotter.xcodeproj
└── PlaneSpotter
    ├── Assets.xcassets
    ├── Components
    ├── Info.plist
    ├── Models
    ├── Networking
    ├── Utilities
    ├── ViewModels
    └── Views
```

Each view model performs async API calls using `APIClient`, which automatically converts snake_case JSON responses into Swift naming conventions.

## Known limitations

- Authentication flows are not implemented yet.
- Airport photos, logbook updates, and community posts still require native UI.
- Map clustering is not yet enabled for dense airport regions.

Contributions and enhancements are welcome!
