"use client";

import { useEffect, useMemo, useState } from "react";

type Aircraft = {
  id: number;
  registration: string;
  type: string;
  airline: string;
  country: string;
};

type SpottingLogProps = {
  initialAircraft: Aircraft[];
};

const STORAGE_KEY = "plane-spotter/logbook-seen";

export default function SpottingLog({ initialAircraft }: SpottingLogProps) {
  const [airlineFilter, setAirlineFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [seenIds, setSeenIds] = useState<Set<number>>(new Set());
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        setSeenIds(new Set(parsed));
      } catch (error) {
        console.warn("Unable to parse spotting log storage", error);
      }
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(seenIds.values()))
    );
  }, [seenIds, storageReady]);

  const airlines = useMemo(() => {
    const unique = new Set<string>();
    initialAircraft.forEach((aircraft) => {
      if (aircraft.airline?.trim()) {
        unique.add(aircraft.airline.trim());
      }
    });

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [initialAircraft]);

  const typeOptions = useMemo(() => {
    const scopedAircraft = airlineFilter
      ? initialAircraft.filter((aircraft) => aircraft.airline === airlineFilter)
      : initialAircraft;

    const unique = new Set<string>();
    scopedAircraft.forEach((aircraft) => {
      if (aircraft.type?.trim()) {
        unique.add(aircraft.type.trim());
      }
    });

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [airlineFilter, initialAircraft]);

  useEffect(() => {
    if (typeFilter && !typeOptions.includes(typeFilter)) {
      setTypeFilter("");
    }
  }, [typeFilter, typeOptions]);

  const filteredAircraft = useMemo(() => {
    return initialAircraft
      .filter((aircraft) => {
        if (airlineFilter && aircraft.airline !== airlineFilter) {
          return false;
        }
        if (typeFilter && aircraft.type !== typeFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const airlineComparison = a.airline.localeCompare(b.airline);
        if (airlineComparison !== 0) {
          return airlineComparison;
        }
        const typeComparison = a.type.localeCompare(b.type);
        if (typeComparison !== 0) {
          return typeComparison;
        }
        return a.registration.localeCompare(b.registration);
      });
  }, [airlineFilter, typeFilter, initialAircraft]);

  const seenCount = useMemo(() => seenIds.size, [seenIds]);

  const toggleSeen = (id: number) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Airline
            <select
              value={airlineFilter}
              onChange={(event) => setAirlineFilter(event.target.value)}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All airlines</option>
              {airlines.map((airline) => (
                <option key={airline} value={airline}>
                  {airline}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-slate-700">
            Aircraft type
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={typeOptions.length === 0}
            >
              <option value="">All types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <p className="font-semibold">Seen summary</p>
          <p>
            {seenCount} of {initialAircraft.length} aircraft marked as seen
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAircraft.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
            No aircraft match the current filters. Try selecting a different airline or type.
          </p>
        ) : (
          filteredAircraft.map((aircraft) => {
            const isSeen = seenIds.has(aircraft.id);
            return (
              <article
                key={aircraft.id}
                className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 transition hover:shadow-md md:flex-row md:items-center ${
                  isSeen ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {aircraft.registration}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {aircraft.airline || "Unknown airline"} · {aircraft.type || "Unknown type"}
                  </p>
                  {aircraft.country && (
                    <p className="text-xs text-slate-500">Registered in {aircraft.country}</p>
                  )}
                </div>

                <label className="flex items-center justify-end gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isSeen}
                    onChange={() => toggleSeen(aircraft.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Seen it!
                </label>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
