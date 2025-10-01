import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type FlightState = {
  id: string;
  callsign: string;
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  heading: number;
  origin: string;
  destination: string;
  registration: string | null;
};

type OpenSkyStateVector = [
  string | null,
  string | null,
  string | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  boolean | null,
  number | null,
  number | null,
  number | null,
  number[] | null,
  number | null,
  string | null,
  boolean | null,
  number | null,
  number | null,
];

type OpenSkyResponse = {
  time: number;
  states: OpenSkyStateVector[] | null;
};

const OPENSKY_ENDPOINT = "https://opensky-network.org/api/states/all";
const OPENSKY_ROUTE_ENDPOINT = "https://opensky-network.org/api/routes";

const MAX_FLIGHTS = 200;
const MS_TO_KNOTS = 1.94384;
const M_TO_FEET = 3.28084;

const ROUTE_CACHE_TTL_MS = 5 * 60 * 1000; // five minutes
const MAX_ROUTE_LOOKUPS = 80;
const METADATA_CACHE_TTL_MS = 30 * 60 * 1000; // thirty minutes
const MAX_METADATA_LOOKUPS = 120;

const OPENSKY_METADATA_ENDPOINT = "https://opensky-network.org/api/metadata/aircraft/icao24";

type FlightRoute = {
  origin: string | null;
  destination: string | null;
};

type RouteCacheEntry = {
  route: FlightRoute | null;
  expiresAt: number;
};

const routeCache = new Map<string, RouteCacheEntry>();

type AircraftMetadata = {
  registration: string | null;
};

type MetadataCacheEntry = {
  metadata: AircraftMetadata | null;
  expiresAt: number;
};

const metadataCache = new Map<string, MetadataCacheEntry>();

function parseFloatOrNull(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampHeading(heading: number | null): number {
  if (typeof heading !== "number" || Number.isNaN(heading)) {
    return 0;
  }
  return ((heading % 360) + 360) % 360;
}

function mapStateVector(state: OpenSkyStateVector): FlightState | null {
  const [icao24, callsign, originCountry, , , lon, lat, baroAlt, , velocity, heading, , , geoAltitude] = state;

  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }

  const bestAltitude =
    typeof geoAltitude === "number"
      ? geoAltitude
      : typeof baroAlt === "number"
        ? baroAlt
        : null;

  const altitudeFeet = bestAltitude ? Math.max(0, Math.round((bestAltitude * M_TO_FEET) / 25) * 25) : 0;
  const speedKnots = velocity ? Math.max(0, Math.round(velocity * MS_TO_KNOTS)) : 0;

  return {
    id: (icao24 ?? "UNKNOWN").toUpperCase(),
    callsign: (callsign ?? "").trim(),
    lat,
    lon,
    alt: altitudeFeet,
    speed: speedKnots,
    heading: clampHeading(heading ?? null),
    origin: originCountry?.trim() || "—",
    destination: "—",
    registration: null,
  };
}

function normaliseAirportCode(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toUpperCase();
  if (!trimmed) {
    return null;
  }

  if (trimmed.length >= 3 && trimmed.length <= 4) {
    return trimmed;
  }

  return null;
}

function extractAirportsFromRouteCandidate(candidate: unknown): FlightRoute | null {
  if (!candidate) {
    return null;
  }

  let origin: string | null = null;
  let destination: string | null = null;

  const assignFromRouteList = (list: unknown) => {
    if (!Array.isArray(list) || !list.length) {
      return;
    }

    const maybeOrigin = normaliseAirportCode(list[0]);
    const maybeDestination = normaliseAirportCode(list[list.length - 1]);
    origin = origin ?? maybeOrigin;
    destination = destination ?? maybeDestination;
  };

  const assignFromRouteString = (value: unknown) => {
    if (typeof value !== "string") {
      return;
    }
    const parts = value
      .split(/\s+/)
      .map((part) => normaliseAirportCode(part))
      .filter((code): code is string => Boolean(code));
    if (!parts.length) {
      return;
    }
    origin = origin ?? parts[0];
    destination = destination ?? parts[parts.length - 1];
  };

  if (Array.isArray(candidate)) {
    assignFromRouteList(candidate);
  } else if (typeof candidate === "string") {
    assignFromRouteString(candidate);
  } else if (typeof candidate === "object") {
    const record = candidate as Record<string, unknown>;
    origin = normaliseAirportCode(record.estDepartureAirport) ?? normaliseAirportCode(record.departure);
    destination =
      normaliseAirportCode(record.estArrivalAirport) ??
      normaliseAirportCode(record.arrival) ??
      normaliseAirportCode(record.destination);

    if (!origin || !destination) {
      if (Array.isArray(record.route)) {
        assignFromRouteList(record.route);
      } else {
        assignFromRouteString(record.route);
      }
    }

    if (!origin || !destination) {
      assignFromRouteList(record.airports);
    }
  }

  if (!origin && !destination) {
    return null;
  }

  return { origin, destination };
}

async function fetchRouteForCallsign(callsign: string): Promise<FlightRoute | null> {
  const key = callsign.trim().toUpperCase();
  if (!key) {
    return null;
  }

  const now = Date.now();
  const cached = routeCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.route;
  }

  try {
    const response = await fetch(`${OPENSKY_ROUTE_ENDPOINT}?callsign=${encodeURIComponent(key)}`, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSky route lookup failed with status ${response.status}`);
    }

    const payload = await response.json();
    let route: FlightRoute | null = null;

    if (Array.isArray(payload)) {
      for (const entry of payload) {
        route = extractAirportsFromRouteCandidate(entry);
        if (route) {
          break;
        }
      }
    } else {
      route = extractAirportsFromRouteCandidate(payload);
    }

    const expiresAt = now + ROUTE_CACHE_TTL_MS;
    routeCache.set(key, { route, expiresAt });
    return route;
  } catch {
    routeCache.set(key, { route: null, expiresAt: now + ROUTE_CACHE_TTL_MS / 2 });
    return null;
  }
}

async function enrichFlightsWithRoutes(
  flights: FlightState[],
  originFilters: Set<string>,
  destinationFilters: Set<string>,
): Promise<FlightState[]> {
  if (!flights.length) {
    return [];
  }

  const uniqueCallsigns = Array.from(
    new Set(flights.map((flight) => flight.callsign.trim()).filter(Boolean)),
  ).slice(0, MAX_ROUTE_LOOKUPS);

  const lookups = await Promise.all(
    uniqueCallsigns.map(async (callsign) => [callsign, await fetchRouteForCallsign(callsign)] as const),
  );

  const routeMap = new Map(lookups);

  return flights
    .map((flight) => {
      const route = flight.callsign ? routeMap.get(flight.callsign.trim()) ?? null : null;
      const origin = route?.origin ?? flight.origin;
      const destination = route?.destination ?? flight.destination;
      return { ...flight, origin, destination };
    })
    .filter((flight) => {
      if (originFilters.size && (!flight.origin || !originFilters.has(flight.origin))) {
        return false;
      }
      if (
        destinationFilters.size &&
        (!flight.destination || !destinationFilters.has(flight.destination))
      ) {
        return false;
      }
      return true;
    });
}

async function fetchAircraftMetadata(icao24: string): Promise<AircraftMetadata | null> {
  const key = icao24.trim().toLowerCase();
  if (!key) {
    return null;
  }

  const now = Date.now();
  const cached = metadataCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.metadata;
  }

  try {
    const response = await fetch(`${OPENSKY_METADATA_ENDPOINT}/${encodeURIComponent(key)}`, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSky metadata lookup failed with status ${response.status}`);
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const registrationRaw = payload?.registration;
    const registration =
      typeof registrationRaw === "string" && registrationRaw.trim()
        ? registrationRaw.trim().toUpperCase()
        : null;

    const metadata: AircraftMetadata = {
      registration,
    };

    metadataCache.set(key, { metadata, expiresAt: now + METADATA_CACHE_TTL_MS });
    return metadata;
  } catch {
    metadataCache.set(key, { metadata: null, expiresAt: now + METADATA_CACHE_TTL_MS / 2 });
    return null;
  }
}

async function enrichFlightsWithMetadata(flights: FlightState[]): Promise<FlightState[]> {
  if (!flights.length) {
    return [];
  }

  const uniqueIds = Array.from(new Set(flights.map((flight) => flight.id))).slice(
    0,
    MAX_METADATA_LOOKUPS,
  );

  const lookups = await Promise.all(
    uniqueIds.map(async (icao24) => [icao24, await fetchAircraftMetadata(icao24)] as const),
  );

  const metadataMap = new Map(lookups);

  return flights.map((flight) => {
    const metadata = metadataMap.get(flight.id) ?? null;
    return {
      ...flight,
      registration: metadata?.registration ?? null,
    };
  });
}

function parseAirportFilters(param: string | null): Set<string> {
  if (!param) {
    return new Set();
  }

  return new Set(
    param
      .split(",")
      .map((token) => normaliseAirportCode(token))
      .filter((code): code is string => Boolean(code)),
  );
}

function buildOpenSkyUrl(url: URL): string {
  const lamin = parseFloatOrNull(url.searchParams.get("minLat"));
  const lamax = parseFloatOrNull(url.searchParams.get("maxLat"));
  const lomin = parseFloatOrNull(url.searchParams.get("minLon"));
  const lomax = parseFloatOrNull(url.searchParams.get("maxLon"));

  const params = new URLSearchParams();

  if (lamin !== null && lamax !== null && lomin !== null && lomax !== null) {
    params.set("lamin", Math.min(lamin, lamax).toString());
    params.set("lamax", Math.max(lamin, lamax).toString());
    params.set("lomin", Math.min(lomin, lomax).toString());
    params.set("lomax", Math.max(lomin, lomax).toString());
  }

  const query = params.toString();
  return query ? `${OPENSKY_ENDPOINT}?${query}` : OPENSKY_ENDPOINT;
}

function parseAltitude(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, parsed);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const endpoint = buildOpenSkyUrl(url);
  const originFilters = parseAirportFilters(url.searchParams.get("origin"));
  const destinationFilters = parseAirportFilters(url.searchParams.get("destination"));
  let minAltitude = parseAltitude(url.searchParams.get("minAlt"));
  let maxAltitude = parseAltitude(url.searchParams.get("maxAlt"));

  if (minAltitude !== null && maxAltitude !== null && minAltitude > maxAltitude) {
    [minAltitude, maxAltitude] = [maxAltitude, minAltitude];
  }

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSky request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as OpenSkyResponse;
    const flights =
      payload.states?.map(mapStateVector).filter((state): state is FlightState => state !== null) ?? [];

    const altitudeFiltered = flights
      .filter((flight) => {
        if (minAltitude !== null && flight.alt < minAltitude) {
          return false;
        }
        if (maxAltitude !== null && flight.alt > maxAltitude) {
          return false;
        }
        return true;
      })
      .slice(0, MAX_FLIGHTS);

    const flightsWithRoutes = await enrichFlightsWithRoutes(
      altitudeFiltered,
      originFilters,
      destinationFilters,
    );

    const flightsWithMetadata = await enrichFlightsWithMetadata(flightsWithRoutes);

    const generatedAt =
      typeof payload.time === "number"
        ? new Date(payload.time * 1000).toISOString()
        : new Date().toISOString();

    return NextResponse.json({
      flights: flightsWithMetadata,
      generatedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ADS-B error";
    return NextResponse.json(
      {
        flights: [],
        generatedAt: new Date().toISOString(),
        error: message,
      },
      { status: 502 },
    );
  }
}
