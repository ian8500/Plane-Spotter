"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { NavigationControl, Popup } from "maplibre-gl";
import type { Map, Marker, StyleSpecification } from "maplibre-gl";
import type { FlightState } from "../api/adsb/route";
import { apiGet } from "@/lib/api";

const SECTIONAL_STYLE: StyleSpecification = {
  version: 8,
  name: "Sectional Chart",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
    sectional: {
      type: "raster",
      tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        "Map data © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)",
      maxzoom: 17,
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#03162a",
      },
    },
    {
      id: "osm",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
      paint: {
        "raster-brightness-min": 0.25,
        "raster-brightness-max": 0.85,
        "raster-saturation": -0.2,
        "raster-contrast": 0.25,
      },
    },
    {
      id: "sectional",
      type: "raster",
      source: "sectional",
      minzoom: 4,
      maxzoom: 13,
      paint: {
        "raster-brightness-min": 0.35,
        "raster-brightness-max": 0.95,
        "raster-saturation": -0.15,
        "raster-opacity": 0.55,
      },
    },
  ],
};

type MarkerRecord = {
  marker: Marker;
  label: HTMLSpanElement;
};

type Airport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

const INITIAL_CENTER: [number, number] = [-0.4543, 51.4706];
const REFRESH_INTERVAL_MS = 15000;

export default function LiveAdsbPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Map<string, MarkerRecord>>(new Map());
  const pollingTimeoutRef = useRef<number | null>(null);
  const fetchFlightsRef = useRef<() => Promise<void> | null>(null);
  const isFetchingRef = useRef(false);
  const pendingFetchRef = useRef(false);

  const [flights, setFlights] = useState<FlightState[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isAirportLoading, setIsAirportLoading] = useState<boolean>(false);
  const [airportError, setAirportError] = useState<string | null>(null);
  const [originFilter, setOriginFilter] = useState<string>("");
  const [destinationFilter, setDestinationFilter] = useState<string>("");
  const [minAltitude, setMinAltitude] = useState<string>("");
  const [maxAltitude, setMaxAltitude] = useState<string>("");
  const [limitToMapView, setLimitToMapView] = useState<boolean>(true);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const loadAirports = async () => {
      setIsAirportLoading(true);
      try {
        const data = await apiGet<Airport[]>("/airports/");
        if (!isCancelled) {
          setAirports(data);
          setAirportError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Unable to load airport directory";
          setAirportError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsAirportLoading(false);
        }
      }
    };

    loadAirports();

    return () => {
      isCancelled = true;
    };
  }, []);

  const airportLookup = useMemo(() => {
    const map = new Map<string, Airport>();
    airports.forEach((airport) => {
      map.set(airport.icao.toUpperCase(), airport);
    });
    return map;
  }, [airports]);

  const formatAirportCode = useCallback(
    (code: string) => {
      const trimmed = code?.trim();
      if (!trimmed || trimmed === "—") {
        return "—";
      }
      const icao = trimmed.toUpperCase();
      const match = airportLookup.get(icao);
      if (!match) {
        return icao;
      }
      const iata = match.iata?.toUpperCase();
      if (iata && iata !== icao) {
        return `${icao} (${iata})`;
      }
      return icao;
    },
    [airportLookup],
  );

  const formatAirportDetail = useCallback(
    (code: string) => {
      const trimmed = code?.trim();
      if (!trimmed || trimmed === "—") {
        return "—";
      }
      const icao = trimmed.toUpperCase();
      const match = airportLookup.get(icao);
      if (!match) {
        return icao;
      }
      const iata = match.iata?.toUpperCase();
      const codes = iata && iata !== icao ? `${icao} (${iata})` : icao;
      const location = match.city ? `${match.city}, ${match.country}` : match.country;
      return `${codes} · ${match.name}${location ? ` – ${location}` : ""}`;
    },
    [airportLookup],
  );

  const airportOptions = useMemo(() => {
    return [...airports]
      .map((airport) => {
        const icao = airport.icao.toUpperCase();
        const iata = airport.iata ? airport.iata.toUpperCase() : "";
        const codes = iata && iata !== icao ? `${icao} (${iata})` : icao;
        const location = airport.city ? `${airport.city}, ${airport.country}` : airport.country;
        return {
          value: icao,
          label: `${codes} · ${airport.name}${location ? ` – ${location}` : ""}`,
        };
      })
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [airports]);

  const hasFilters =
    originFilter !== "" || destinationFilter !== "" || minAltitude !== "" || maxAltitude !== "";

  const headerStats = useMemo(() => {
    if (!flights.length) {
      return hasFilters ? "No aircraft match the selected filters" : "No traffic in range";
    }

    const averageAltitude = Math.round(
      flights.reduce((sum, flight) => sum + flight.alt, 0) / flights.length,
    );
    const prefix = hasFilters ? "match filters" : limitToMapView ? "tracked" : "available";
    return `${flights.length} aircraft ${prefix} · Avg ${averageAltitude.toLocaleString()} ft`;
  }, [flights, hasFilters, limitToMapView]);

  const renderPopup = useCallback(
    (flight: FlightState) => {
      const { callsign, alt, speed, heading, registration } = flight;
      return `
        <div class="adsb-popup">
          <div class="adsb-popup__title">${callsign || flight.id}</div>
          ${registration ? `<div class="adsb-popup__meta">Reg ${registration}</div>` : ""}
          <div class="adsb-popup__meta">${formatAirportDetail(flight.origin)} ➞ ${formatAirportDetail(flight.destination)}</div>
          <div class="adsb-popup__meta">Alt ${alt.toLocaleString()} ft · ${speed} kt · HDG ${Math.round(heading)}°</div>
        </div>
      `;
    },
    [formatAirportDetail],
  );

  const selectedFlightIdRef = useRef<string | null>(null);

  const updateMarkers = useCallback(
    (newFlights: FlightState[]) => {
      if (!mapRef.current) return;
      const seen = new Set<string>();

      newFlights.forEach((flight) => {
        const id = flight.id;
        const position: [number, number] = [flight.lon, flight.lat];
        const existing = markersRef.current.get(id);

        if (existing) {
          existing.marker.setLngLat(position).setRotation(flight.heading);
          existing.label.textContent = flight.callsign || id;
          existing.marker.getPopup()?.setHTML(renderPopup(flight));
          existing.marker
            .getElement()
            ?.classList.toggle("adsb-marker--selected", selectedFlightIdRef.current === id);
          seen.add(id);
          return;
        }

        const markerElement = document.createElement("div");
        markerElement.className = "adsb-marker";
        const arrow = document.createElement("div");
        arrow.className = "adsb-marker__arrow";
        const label = document.createElement("span");
        label.className = "adsb-marker__label";
        label.textContent = flight.callsign || id;

        markerElement.appendChild(arrow);
        markerElement.appendChild(label);

        markerElement.addEventListener("click", () => {
          setSelectedFlightId(id);
        });

        const popup = new Popup({ offset: 18, closeButton: false }).setHTML(
          renderPopup(flight),
        );

        const marker = new maplibregl.Marker({
          element: markerElement,
          rotationAlignment: "map",
          pitchAlignment: "map",
        })
          .setLngLat(position)
          .setRotation(flight.heading)
          .setPopup(popup)
          .addTo(mapRef.current);

        markersRef.current.set(id, { marker, label });
        marker
          .getElement()
          ?.classList.toggle("adsb-marker--selected", selectedFlightIdRef.current === id);
        seen.add(id);
      });

      markersRef.current.forEach((record, id) => {
        if (!seen.has(id)) {
          record.marker.remove();
          markersRef.current.delete(id);
        }
      });
    },
    [renderPopup, setSelectedFlightId],
  );

  const scheduleNextFetch = useCallback(() => {
    if (pollingTimeoutRef.current !== null) {
      window.clearTimeout(pollingTimeoutRef.current);
    }

    pollingTimeoutRef.current = window.setTimeout(() => {
      fetchFlightsRef.current?.();
    }, REFRESH_INTERVAL_MS);
  }, []);

  const fetchFlights = useCallback(async () => {
    if (!mapRef.current) {
      return;
    }

    if (isFetchingRef.current) {
      pendingFetchRef.current = true;
      return;
    }

    if (pollingTimeoutRef.current !== null) {
      window.clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }

    isFetchingRef.current = true;

    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (limitToMapView) {
        const bounds = mapRef.current.getBounds();
        params.set("minLat", bounds.getSouth().toFixed(4));
        params.set("maxLat", bounds.getNorth().toFixed(4));
        params.set("minLon", bounds.getWest().toFixed(4));
        params.set("maxLon", bounds.getEast().toFixed(4));
      }

      if (originFilter) {
        params.set("origin", originFilter);
      }
      if (destinationFilter) {
        params.set("destination", destinationFilter);
      }

      const minAltNumber = Number.parseInt(minAltitude, 10);
      if (Number.isFinite(minAltNumber) && minAltitude.trim() !== "") {
        params.set("minAlt", Math.max(0, minAltNumber).toString());
      }
      const maxAltNumber = Number.parseInt(maxAltitude, 10);
      if (Number.isFinite(maxAltNumber) && maxAltitude.trim() !== "") {
        params.set("maxAlt", Math.max(0, maxAltNumber).toString());
      }

      const response = await fetch(`/api/adsb?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`ADS-B request failed: ${response.status}`);
      }

      const payload = (await response.json()) as {
        flights: FlightState[];
        generatedAt: string;
      };

      setFlights(payload.flights);
      setSelectedFlightId((previous) =>
        previous && payload.flights.some((flight) => flight.id === previous) ? previous : null,
      );
      setLastUpdated(payload.generatedAt);
      updateMarkers(payload.flights);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load live traffic";
      setError(message);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);

      if (pendingFetchRef.current) {
        pendingFetchRef.current = false;
        fetchFlightsRef.current?.();
      } else {
        scheduleNextFetch();
      }
    }

    

  useEffect(() => {
    fetchFlightsRef.current = fetchFlights;
  }, [fetchFlights]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: SECTIONAL_STYLE,
      center: INITIAL_CENTER,
      zoom: 7.2,
      pitch: 35,
      bearing: -15,
      hash: false,
    });

    mapRef.current = map;

    map.addControl(new NavigationControl({ visualizePitch: true }), "top-left");

    const handleMoveEnd = () => {
      fetchFlightsRef.current?.();
    };

      map.on("load", () => {
        fetchFlightsRef.current?.();
        map.on("moveend", handleMoveEnd);
      });

    const markers = markersRef.current;

    return () => {
      map.off("moveend", handleMoveEnd);
      markers.forEach(({ marker }) => marker.remove());
      markers.clear();
      markersRef.current = new Map();
      if (pollingTimeoutRef.current !== null) {
        window.clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      isFetchingRef.current = false;
      pendingFetchRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    fetchFlights();
  }, [fetchFlights]);

  useEffect(() => {
    selectedFlightIdRef.current = selectedFlightId;
    markersRef.current.forEach((record, id) => {
      record.marker
        .getElement()
        ?.classList.toggle("adsb-marker--selected", selectedFlightId === id);
    });
  }, [selectedFlightId]);

  const selectedFlight = useMemo(() => {
    if (!selectedFlightId) {
      return null;
    }
    return flights.find((flight) => flight.id === selectedFlightId) ?? null;
  }, [flights, selectedFlightId]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!selectedFlight) {
      markersRef.current.forEach((record) => {
        record.marker.getPopup()?.remove();
      });
      return;
    }

    const record = markersRef.current.get(selectedFlight.id);
    if (!record) {
      return;
    }

    const popup = record.marker.getPopup();
    if (popup && !popup.isOpen()) {
      popup.addTo(mapRef.current);
    }
  }, [selectedFlight]);

  const formattedTimestamp = useMemo(() => {
    if (!lastUpdated) return null;
    const timestamp = new Date(lastUpdated);
    if (Number.isNaN(timestamp.valueOf())) {
      return null;
    }
    return `${timestamp.toLocaleTimeString()} local`;
  }, [lastUpdated]);

  return (
    <main className="relative min-h-screen bg-[#020c19] pb-10 pt-24 text-sky-100">
      <div className="pointer-events-none absolute inset-0 bg-[url('/textures/aviation-chart.svg')] bg-cover opacity-20" />
      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col gap-6 px-4 lg:flex-row lg:px-8">
        <section className="flex-1 rounded-3xl border border-sky-900/40 bg-slate-950/50 p-6 shadow-2xl shadow-sky-900/40 backdrop-blur-xl">
          <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-sky-400">Live ADS-B</p>
              <h1 className="text-3xl font-semibold text-sky-100 md:text-4xl">Traffic Radar</h1>
            </div>
            <div className="text-sm text-sky-200/80">
              {formattedTimestamp ? `Updated ${formattedTimestamp}` : "Awaiting data"}
            </div>
          </header>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/80">
                Departure airport
              </span>
              <select
                value={originFilter}
                onChange={(event) => setOriginFilter(event.target.value.toUpperCase())}
                className="rounded-xl border border-sky-800/60 bg-slate-900/80 px-3 py-2 text-sm text-sky-100 shadow-inner shadow-sky-900/40 focus:border-sky-500 focus:outline-none"
                disabled={isAirportLoading && !airportOptions.length}
              >
                <option value="">All departures</option>
                {airportOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/80">
                Arrival airport
              </span>
              <select
                value={destinationFilter}
                onChange={(event) => setDestinationFilter(event.target.value.toUpperCase())}
                className="rounded-xl border border-sky-800/60 bg-slate-900/80 px-3 py-2 text-sm text-sky-100 shadow-inner shadow-sky-900/40 focus:border-sky-500 focus:outline-none"
                disabled={isAirportLoading && !airportOptions.length}
              >
                <option value="">All arrivals</option>
                {airportOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/80">
                Minimum altitude (ft)
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={minAltitude}
                onChange={(event) => setMinAltitude(event.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                className="rounded-xl border border-sky-800/60 bg-slate-900/80 px-3 py-2 text-sm text-sky-100 shadow-inner shadow-sky-900/40 focus:border-sky-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/80">
                Maximum altitude (ft)
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={maxAltitude}
                onChange={(event) => setMaxAltitude(event.target.value.replace(/[^0-9]/g, ""))}
                placeholder="45000"
                className="rounded-xl border border-sky-800/60 bg-slate-900/80 px-3 py-2 text-sm text-sky-100 shadow-inner shadow-sky-900/40 focus:border-sky-500 focus:outline-none"
              />
            </label>
          </div>
          <label className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-sky-800/60 bg-slate-900/80 px-4 py-3 text-xs text-sky-200/80 shadow-inner shadow-sky-900/40">
            <span className="font-semibold uppercase tracking-[0.3em] text-sky-300/80">Limit to map view</span>
            <input
              type="checkbox"
              checked={limitToMapView}
              onChange={(event) => setLimitToMapView(event.target.checked)}
              className="h-4 w-4 rounded border-sky-700 bg-slate-950 text-sky-500 focus:ring-sky-400"
            />
          </label>
          {airportError && (
            <div className="mb-4 rounded-xl border border-amber-400/50 bg-amber-950/40 px-4 py-2 text-xs text-amber-100">
              {airportError}
            </div>
          )}
          <p className="mb-4 text-sm text-sky-200/80">{headerStats}</p>
          <div
            ref={mapContainerRef}
            className="h-[60vh] w-full overflow-hidden rounded-2xl border border-sky-800/60 shadow-xl shadow-sky-900/40 lg:h-[75vh]"
          />
          {error && (
            <div className="mt-4 rounded-xl border border-rose-400/50 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}
        </section>
        <aside className="max-h-[75vh] w-full rounded-3xl border border-sky-900/40 bg-slate-950/60 p-6 shadow-xl shadow-sky-900/40 backdrop-blur-xl lg:w-[360px]">
          <h2 className="text-xl font-semibold text-sky-100">Aircraft Details</h2>
          <div className="mt-4 mb-6 rounded-2xl border border-sky-800/60 bg-slate-900/70 p-4 text-sm text-sky-100 shadow-inner shadow-sky-900/40">
            {selectedFlight ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Selected Flight</p>
                  <p className="text-lg font-semibold text-sky-100">
                    {selectedFlight.callsign || selectedFlight.id}
                  </p>
                  {selectedFlight.registration ? (
                    <p className="text-xs text-sky-300/70">Registration • {selectedFlight.registration}</p>
                  ) : null}
                  <p className="text-xs text-sky-300/70">ICAO24 • {selectedFlight.id}</p>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-sky-200/80">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sky-300/80">Route</span>
                    <span className="text-sky-200/70">
                      {formatAirportDetail(selectedFlight.origin)} ➞ {formatAirportDetail(selectedFlight.destination)}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-sky-300/60">
                    <div>
                      <dt className="text-sky-300/70">Altitude</dt>
                      <dd className="text-base font-semibold tracking-normal text-sky-100">
                        {selectedFlight.alt.toLocaleString()} ft
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sky-300/70">Speed</dt>
                      <dd className="text-base font-semibold tracking-normal text-sky-100">
                        {Math.round(selectedFlight.speed)} kt
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sky-300/70">Heading</dt>
                      <dd className="text-base font-semibold tracking-normal text-sky-100">
                        {Math.round(selectedFlight.heading)}°
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sky-300/70">Position</dt>
                      <dd className="text-base font-semibold tracking-normal text-sky-100">
                        {selectedFlight.lat.toFixed(2)}°, {selectedFlight.lon.toFixed(2)}°
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-sky-200/80">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">No flight selected</p>
                <p>Select an aircraft on the radar or from the list below to view detailed telemetry.</p>
              </div>
            )}
          </div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-sky-400">Sorted by altitude</p>
          <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1" style={{ maxHeight: "calc(75vh - 4rem)" }}>
            {isLoading && !flights.length ? (
              <div className="rounded-xl border border-sky-800/50 bg-slate-900/70 px-4 py-6 text-center text-sm text-sky-200/70">
                Initializing ADS-B feed…
              </div>
            ) : flights.length ? (
              [...flights]
                .sort((a, b) => b.alt - a.alt)
                .map((flight) => (
                  <article
                    key={flight.id}
                    className={`rounded-2xl border px-4 py-3 text-sm shadow-inner shadow-sky-900/40 transition-colors ${
                      selectedFlightId === flight.id
                        ? "border-sky-400/80 bg-slate-900/90"
                        : "border-sky-800/60 bg-slate-900/70 hover:border-sky-600/70 hover:bg-slate-900/80"
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedFlightId(flight.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedFlightId(flight.id);
                      }
                    }}
                    aria-pressed={selectedFlightId === flight.id}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-sky-100">{flight.callsign || flight.id}</span>
                      <span className="text-xs text-sky-300/80">{Math.round(flight.speed)} kt</span>
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-sky-300/60">
                      {flight.registration ? `Reg ${flight.registration}` : `ICAO24 ${flight.id}`}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-sky-200/70">
                      <span
                        title={`${formatAirportDetail(flight.origin)} → ${formatAirportDetail(flight.destination)}`}
                      >
                        {formatAirportCode(flight.origin)} ➞ {formatAirportCode(flight.destination)}
                      </span>
                      <span>FL{Math.round(flight.alt / 100)}</span>
                      <span>HDG {Math.round(flight.heading)}°</span>
                    </div>
                    <div className="mt-1 text-xs text-sky-200/50">
                      {flight.lat.toFixed(2)}°, {flight.lon.toFixed(2)}°
                    </div>
                  </article>
                ))
            ) : (
              <div className="rounded-xl border border-sky-800/50 bg-slate-900/70 px-4 py-6 text-center text-sm text-sky-200/70">
                {limitToMapView
                  ? "No aircraft within the current map view."
                  : "No aircraft match the selected criteria."}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
