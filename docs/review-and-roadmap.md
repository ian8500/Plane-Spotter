# Plane Spotter Progress Review & Cross-Platform Roadmap

## Current State Summary

### Backend (Django + DRF)
- **Models** already cover airports, frequencies, spotting locations, user logs, community posts, and badges. The schema is a solid foundation for the data plane spotters need.
- **ViewSets** expose CRUD endpoints via the DRF router, and JWT authentication is wired up with `rest_framework_simplejwt`.
- **Settings** enable CORS for development, static/media hosting, and SQLite by default. This is enough for local development but needs hardening for production.

### Web Frontend (Next.js 15 + Tailwind)
- Landing page plus early sections for Airports and Maps are in place.
- API access is centralised in `lib/api.ts`, but only a `GET` helper exists and the login screen was still a placeholder.
- Styling uses Tailwind with server components, giving us a good base for re-use later.

## Key Improvements Made in This Iteration
- ✅ Fixed the login screen to authenticate against the Django JWT endpoint and store the token locally (this mirrors the flow you can re-use on mobile).
- ✅ Added an airport detail page that surfaces frequencies and spotting locations – a pattern to follow for other resources.
- ✅ Tightened backend querysets to prefetch related data so that the API delivers richer responses efficiently.
- ✅ Added this roadmap to capture architecture decisions and next steps.

## Recommended Next Steps

### 1. Establish a Shared Design System
- Extract commonly styled components (buttons, cards, typography) into a package that can be consumed by both Next.js and React Native via [`@expo/html-elements`](https://docs.expo.dev/versions/latest/sdk/html-elements/) or by using [`react-native-web`](https://necolas.github.io/react-native-web/).
- Consider a monorepo structure (Turborepo or Nx) with `apps/web`, `apps/mobile`, and `packages/ui` to share logic.

### 2. Create a Mobile Client with Expo
- Initialise an Expo project (`npx create-expo-app mobile`) configured with Expo Router for parity with Next.js routing.
- Install `expo-router`, `expo-secure-store` (for JWT storage), and `react-query`/`tanstack-query` for data fetching.
- Mirror the API helpers from `web/lib/api.ts`, exposing `apiGet`, `apiPost`, etc., but wrap fetch calls with Expo-specific headers when needed.

### 3. Align Authentication Across Platforms
- Move JWT management to a shared utility (e.g., `packages/auth`) that:
  - Persists tokens (`localStorage` on web, `SecureStore` on mobile).
  - Exposes hooks like `useAuth()` to retrieve the current user and refresh tokens automatically.
- Add refresh token rotation and backend endpoints for password reset / social logins if required.

### 4. Enhance API Capability
- Implement pagination, search, and filtering on the airport and spotting location endpoints using DRF features (`SearchFilter`, `OrderingFilter`).
- Add custom endpoints for derived data the mobile app will need (e.g., nearest airports by coordinates, user stats dashboards).
- Document the API with OpenAPI/Swagger via `drf-spectacular` and publish the schema for mobile consumption.

### 5. Offline-Ready Data Layer
- Define TypeScript interfaces in a shared package and generate them from the OpenAPI schema to prevent drift.
- On mobile, use libraries like [`react-query`](https://tanstack.com/query) with persistent caches or SQLite (`expo-sqlite`) to offer offline support for recently viewed airports/locations.

### 6. Map & Geolocation Parity
- Standardise map rendering via Mapbox/MapLibre:
  - Web already uses MapLibre GL. For mobile, adopt [`@rnmapbox/maps`](https://github.com/rnmapbox/maps) (Mapbox GL) or `react-native-maplibre-gl` for feature parity.
  - Create a shared JSON schema for map layers (spotting locations, runways) that both clients read.

### 7. Continuous Delivery & QA
- Set up Docker containers or GitHub Actions workflows to run `pytest`, `eslint`, `tsc`, and future mobile E2E tests.
- Automate Expo builds with EAS for both iOS and Android; integrate Web deploys to Vercel.

## Suggested Milestones
1. **Design System & Monorepo Skeleton** – shared UI + API helpers, lint/test pipelines.
2. **Authentication Across Clients** – login, registration, token refresh in web + mobile.
3. **Core Features Parity** – airport browser, maps, logbook sync across platforms.
4. **Community & Gamification** – posts, comments, badges with push notifications on mobile.
5. **Offline & Performance** – caching strategies, background sync, metrics.

Following these steps will let you scale from the current prototype into a cohesive cross-platform experience with minimal duplication.
