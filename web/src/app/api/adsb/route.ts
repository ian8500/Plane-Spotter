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
const MAX_FLIGHTS = 200;
const MS_TO_KNOTS = 1.94384;
const M_TO_FEET = 3.28084;

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
  };
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const endpoint = buildOpenSkyUrl(url);

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

    const generatedAt =
      typeof payload.time === "number"
        ? new Date(payload.time * 1000).toISOString()
        : new Date().toISOString();

    return NextResponse.json({
      flights: flights.slice(0, MAX_FLIGHTS),
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
