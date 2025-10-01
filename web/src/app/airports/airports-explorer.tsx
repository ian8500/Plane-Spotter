"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

type Airport = {
  id: number;
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

type AirportsExplorerProps = {
  airports: Airport[];
};

const CONTROL_CLASSES =
  "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20";

function sortAirports(a: Airport, b: Airport) {
  return a.icao.localeCompare(b.icao);
}

function normalise(value: string) {
  return value.toLowerCase();
}

export function AirportsExplorer({ airports }: AirportsExplorerProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  const deferredSearch = useDeferredValue(search);

  const sortedAirports = useMemo(() => {
    return [...airports].sort(sortAirports);
  }, [airports]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    airports.forEach((airport) => {
      if (airport.country) {
        set.add(airport.country);
      }
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [airports]);

  const filteredAirports = useMemo(() => {
    const hasQuery = deferredSearch.trim().length > 0;
    const query = normalise(deferredSearch.trim());

    return sortedAirports.filter((airport) => {
      if (countryFilter !== "all" && airport.country !== countryFilter) {
        return false;
      }

      if (!hasQuery) {
        return true;
      }

      const target = `${airport.icao} ${airport.iata} ${airport.name} ${airport.city} ${airport.country}`;
      return normalise(target).includes(query);
    });
  }, [countryFilter, deferredSearch, sortedAirports]);

  const resultSummary = useMemo(() => {
    if (!filteredAirports.length) {
      return "No airports match the current filters";
    }

    if (filteredAirports.length === airports.length) {
      return `${airports.length} airports available`;
    }

    return `${filteredAirports.length} of ${airports.length} airports shown`;
  }, [airports.length, filteredAirports.length]);

  const distinctCities = useMemo(() => {
    const set = new Set<string>();
    airports.forEach((airport) => {
      if (airport.city) {
        set.add(`${airport.city}, ${airport.country}`);
      }
    });
    return set.size;
  }, [airports]);

  const handleReset = () => {
    setSearch("");
    setCountryFilter("all");
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-500/5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="flex flex-col gap-2 text-sm text-slate-300" htmlFor="airport-search">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Search directory</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="m13.5 13.5 3 3" strokeLinecap="round" />
              </svg>
            </span>
            <input
              id="airport-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try 'Heathrow' or 'EGLL'"
              className={`${CONTROL_CLASSES} pl-9`}
              type="search"
              autoComplete="off"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-300" htmlFor="airport-country">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Filter by country</span>
          <select
            id="airport-country"
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
            className={CONTROL_CLASSES}
          >
            <option value="all">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
            disabled={!search && countryFilter === "all"}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Airports covered" value={airports.length.toString()} />
        <StatCard label="Countries represented" value={countries.length.toString()} />
        <StatCard label="Spotting cities" value={distinctCities.toString()} />
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <span aria-live="polite">{resultSummary}</span>
        <span>{countryFilter === "all" ? "Global" : countryFilter}</span>
      </div>

      {filteredAirports.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAirports.map((airport) => (
            <li key={airport.id}>
              <Link
                href={`/airports/${airport.id}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5 transition hover:border-cyan-400/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <span>{airport.icao}</span>
                  <span className="text-slate-400">{airport.iata || "—"}</span>
                </div>
                <div className="mt-3 space-y-1">
                  <h2 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">{airport.name}</h2>
                  <p className="text-sm text-slate-300">
                    {airport.city}, {airport.country}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-cyan-300">
                  View guide
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 10h10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="m10 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300">
          <p className="text-lg font-semibold text-white">No matching airports</p>
          <p className="mt-2 text-slate-300">
            Try adjusting your search terms or clearing the country filter to see more spotting locations.
          </p>
        </div>
      )}
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center shadow-inner shadow-black/10">
      <p className="text-3xl font-semibold text-slate-50">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
    </div>
  );
}

