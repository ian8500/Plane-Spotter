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

const BASE_FLIGHTS: FlightState[] = [
  {
    id: "400ABC",
    callsign: "BAW123",
    lat: 51.4706,
    lon: -0.4619,
    alt: 34000,
    speed: 470,
    heading: 90,
    origin: "EGLL",
    destination: "KJFK",
  },
  {
    id: "400BCD",
    callsign: "EZY456",
    lat: 51.1537,
    lon: -0.1821,
    alt: 28000,
    speed: 430,
    heading: 140,
    origin: "EGKK",
    destination: "LEBL",
  },
  {
    id: "406DEF",
    callsign: "RYR89M",
    lat: 52.0,
    lon: 0.25,
    alt: 36000,
    speed: 450,
    heading: 210,
    origin: "EIDW",
    destination: "LTFM",
  },
  {
    id: "407AAA",
    callsign: "DLH4QA",
    lat: 51.889,
    lon: -0.233,
    alt: 32000,
    speed: 440,
    heading: 70,
    origin: "EDDF",
    destination: "KEWR",
  },
  {
    id: "401AAA",
    callsign: "UAE2",
    lat: 51.7,
    lon: 0.18,
    alt: 39000,
    speed: 500,
    heading: 260,
    origin: "OMDB",
    destination: "EGLL",
  },
  {
    id: "43ABCD",
    callsign: "AFR106",
    lat: 51.3,
    lon: -0.6,
    alt: 33000,
    speed: 465,
    heading: 305,
    origin: "LFPG",
    destination: "KMIA",
  },
];

function makeFlightPosition(base: FlightState, index: number): FlightState {
  const now = Date.now();
  const cycle = (now / 600000 + index) * Math.PI * 2; // slow oscillation

  const latOffset = Math.sin(cycle) * 0.25;
  const lonOffset = Math.cos(cycle) * 0.35;

  const velocityLat = Math.cos(cycle) * 0.25;
  const velocityLon = -Math.sin(cycle) * 0.35;
  const heading = (Math.atan2(velocityLon, velocityLat) * 180) / Math.PI;

  const speed = base.speed + Math.sin(now / 240000 + index) * 25;
  const alt = base.alt + Math.cos(now / 360000 + index) * 800;

  return {
    ...base,
    lat: base.lat + latOffset,
    lon: base.lon + lonOffset,
    heading: (heading + 360) % 360,
    speed: Math.max(240, Math.round(speed)),
    alt: Math.max(1800, Math.round(alt / 25) * 25),
  };
}

function filterByBounds(flights: FlightState[], url: URL) {
  const minLat = parseFloat(url.searchParams.get("minLat") ?? "");
  const maxLat = parseFloat(url.searchParams.get("maxLat") ?? "");
  const minLon = parseFloat(url.searchParams.get("minLon") ?? "");
  const maxLon = parseFloat(url.searchParams.get("maxLon") ?? "");

  if ([minLat, maxLat, minLon, maxLon].some((value) => Number.isNaN(value))) {
    return flights;
  }

  return flights.filter((flight) => {
    return (
      flight.lat >= Math.min(minLat, maxLat) &&
      flight.lat <= Math.max(minLat, maxLat) &&
      flight.lon >= Math.min(minLon, maxLon) &&
      flight.lon <= Math.max(minLon, maxLon)
    );
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const flights = BASE_FLIGHTS.map((flight, index) => makeFlightPosition(flight, index));
  const filtered = filterByBounds(flights, url);

  return NextResponse.json({
    flights: filtered,
    generatedAt: new Date().toISOString(),
  });
}
