# Plane Spotter Codebase Review — June 2024

## Snapshot
- Django backend exposes comprehensive aviation domain models and DRF viewsets for airports, spotting locations, user activity, and gamification features.
- Next.js 15 frontend already consumes the airport endpoints and implements a fully-styled authentication experience backed by JWT.
- Documentation outlines an ambitious roadmap, but automated quality gates and platform parity work have not started yet.

## Backend (Django + DRF)
### What is working well
- Data model covers core entities (airports, frequencies, spotting locations, aircraft sightings, community posts, badges) with useful relations and ordering to support API aggregation.
- Airports endpoint prefetches related collections so the frontend gets frequencies, spots, and resources in a single request.

### Gaps & risks
- Most mutable endpoints (`AirportViewSet`, `FrequencyViewSet`, `SpottingLocationViewSet`, etc.) use `ModelViewSet` with `AllowAny`, so anonymous users can create, update, or delete reference data. Promote admin-only mutations by switching public endpoints to `ReadOnlyModelViewSet` or enforcing `IsAuthenticated` + custom permissions before shipping broadly.
- `UserSeenViewSet` and `UserBadgeViewSet` expose all records to any authenticated user; filter querysets to the requesting user to prevent data leakage.
- There are no unit or integration tests yet (`core/tests.py` is empty). Add factories plus API tests (auth, airport detail, nested data) to protect the schema as it evolves.
- Settings still target local development (SQLite, wide-open CORS). Harden before deployment: configure environment-based settings, secure cookies, production CORS/CSRF lists, and media storage.

### Quick wins
1. Lock down write operations via DRF permissions and switch to `ReadOnlyModelViewSet` for catalogue data.
2. Introduce `django-filter`/search capabilities for airports and spotting locations so clients can query by ICAO, country, or proximity.
3. Add a `tests/` module with pytest or Django TestCase coverage for authentication, nested serializers, and user-specific resources.

## Web Frontend (Next.js 15 + Tailwind)
### What is working well
- Airport index/detail pages render nested resources with sensible loading states using the shared API helper.
- Login flow persists JWT access + refresh tokens with an optional session scope and polished UX copy, ready to plug into subscription add-ons later.

### Gaps & risks
- `api.ts` only implements GET/POST helpers. Add PUT/PATCH/DELETE plus centralised error handling (e.g., shape API errors for toast notifications) before building editable features.
- Airport detail types treat `mhz` as a string even though the component converts it to a number; align TypeScript types with backend decimal responses to avoid runtime formatting issues.
- No global auth context yet. Introduce a client-side provider that reads the stored token, injects it into fetchers, and surfaces logout/refresh logic so future pages can gate access.

### Quick wins
1. Extract reusable UI (cards, section headers) into components so the mobile client can mirror them via React Native Web or Expo Router.
2. Add loading/error states to server components (e.g., suspense boundaries, friendly messages when fetch fails).
3. Start wiring TanStack Query or React Server Components caching to keep data fresh without re-fetching on every request.

## Cross-Platform & Delivery
- iOS/Expo workspace is empty; spin up an Expo app early to keep design/feature parity with the web roadmap.
- No automated checks run yet. Set up GitHub Actions for `pytest`, `npm run lint`, and `npm run test` to catch regressions before merging.
- Expand the existing roadmap with responsibility assignments and timelines so contributors know which milestone to tackle next.

## Recommended Next Steps (Order of Impact)
1. **Security Hardening** – tighten DRF permissions, configure environment-based settings, and document deployment secrets.
2. **Testing & CI** – bootstrap backend and frontend test suites, then automate them in CI.
3. **Shared Auth & UI Toolkit** – extract auth/token helpers and shared components usable by both Next.js and future Expo clients.
4. **Mobile Client Kickoff** – scaffold the Expo app and replicate airport browsing with offline-ready data structures.
5. **API Enhancements** – add search/filter endpoints and document them via OpenAPI for web/mobile consumption.

These steps will convert the solid prototype into a production-ready, cross-platform experience while keeping maintenance overhead manageable.
