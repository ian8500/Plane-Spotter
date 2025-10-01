"use client";

import { useEffect, useMemo, useState } from "react";

import { useSeenAircraft } from "./use-seen-aircraft";

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

export default function SpottingLog({ initialAircraft }: SpottingLogProps) {
  const [airlineFilter, setAirlineFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const { seenIds, toggleSeen } = useSeenAircraft();

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

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-100 md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-200">
            Airline
            <select
              value={airlineFilter}
              onChange={(event) => setAirlineFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            >
              <option value="">All airlines</option>
              {airlines.map((airline) => (
                <option key={airline} value={airline}>
                  {airline}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-slate-200">
            Aircraft type
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-50"
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

        <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
          <p className="font-semibold uppercase tracking-wide">Seen summary</p>
          <p className="text-xs text-cyan-100/80">
            {seenCount} of {initialAircraft.length} aircraft marked as seen
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAircraft.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-300">
            No aircraft match the current filters. Try selecting a different airline or type.
          </p>
        ) : (
          filteredAircraft.map((aircraft) => {
            const isSeen = seenIds.has(aircraft.id);
            return (
              <article
                key={aircraft.id}
                className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 md:flex-row md:items-center ${
                  isSeen
                    ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-100"
                    : "border-white/10 bg-slate-900/70 text-slate-100"
                }`}
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {aircraft.registration}
                  </h2>
                  <p className="text-sm opacity-80">
                    {aircraft.airline || "Unknown airline"} · {aircraft.type || "Unknown type"}
                  </p>
                  {aircraft.country && (
                    <p className="text-xs opacity-60">Registered in {aircraft.country}</p>
                  )}
                </div>

                <label className="flex items-center justify-end gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={isSeen}
                    onChange={() => toggleSeen(aircraft.id)}
                    className="h-5 w-5 rounded border-white/30 bg-slate-950/60 text-cyan-400 focus:ring-cyan-300"
                  />
                  Mark as seen
                </label>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
