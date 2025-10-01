"use client";

import { useEffect, useMemo, useState } from "react";

import { isAircraftSeen, useSeenAircraft } from "../logbook/use-seen-aircraft";

type Aircraft = {
  id: number;
  registration: string;
  type: string;
  airline: string;
  country: string;
};

type FleetBrowserProps = {
  aircraft: Aircraft[];
};

function normaliseAirline(name: string | null | undefined) {
  return name?.trim() || "Unassigned operator";
}

export default function FleetBrowser({ aircraft }: FleetBrowserProps) {
  const { seenIds, toggleSeen } = useSeenAircraft();

  const airlines = useMemo(() => {
    const counts = new Map<string, number>();

    aircraft.forEach((item) => {
      const airline = normaliseAirline(item.airline);
      counts.set(airline, (counts.get(airline) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [aircraft]);

  const [selectedAirline, setSelectedAirline] = useState(() => airlines[0]?.name ?? "");

  useEffect(() => {
    if (!selectedAirline && airlines.length > 0) {
      setSelectedAirline(airlines[0]!.name);
    }
  }, [airlines, selectedAirline]);

  useEffect(() => {
    if (selectedAirline && !airlines.some((airline) => airline.name === selectedAirline)) {
      setSelectedAirline(airlines[0]?.name ?? "");
    }
  }, [airlines, selectedAirline]);

  const airlineFleet = useMemo(() => {
    const scoped = aircraft.filter((item) => normaliseAirline(item.airline) === selectedAirline);

    const groups = new Map<string, Aircraft[]>();
    scoped.forEach((item) => {
      const type = item.type?.trim() || "Unknown type";
      const current = groups.get(type) ?? [];
      current.push(item);
      groups.set(type, current);
    });

    return Array.from(groups.entries())
      .map(([type, items]) => ({
        type,
        items: items.sort((a, b) => a.registration.localeCompare(b.registration)),
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [aircraft, selectedAirline]);

  const seenInAirline = useMemo(() => {
    if (!selectedAirline) {
      return 0;
    }

    return aircraft.reduce((count, item) => {
      if (normaliseAirline(item.airline) !== selectedAirline) {
        return count;
      }
      return count + (seenIds.has(item.id) ? 1 : 0);
    }, 0);
  }, [aircraft, selectedAirline, seenIds]);

  if (airlines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300">
        No fleet data is available yet. Check back once the database has been seeded.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Airlines</h2>
          <p className="mt-1 text-xs text-slate-400">
            Browse each carrier to see registrations and types available in the fleet.
          </p>
        </div>
        <ul className="space-y-2">
          {airlines.map((airline) => {
            const active = airline.name === selectedAirline;
            return (
              <li key={airline.name}>
                <button
                  type="button"
                  onClick={() => setSelectedAirline(airline.name)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-100"
                      : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-500/5"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-medium">{airline.name}</span>
                    <span className="text-xs uppercase tracking-wide opacity-70">{airline.count}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="space-y-6">
        {selectedAirline ? (
          <header className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-slate-100">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{selectedAirline} fleet overview</h1>
                <p className="text-sm text-slate-300/80">
                  Registrations and aircraft types sourced from the Plane Spotter fleet database.
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-right text-sm text-cyan-100">
                <p className="font-semibold uppercase tracking-wide">Seen in this fleet</p>
                <p className="text-xs text-cyan-100/80">
                  {seenInAirline} of {airlineFleet.reduce((total, group) => total + group.items.length, 0)} aircraft
                </p>
              </div>
            </div>
          </header>
        ) : null}

        {selectedAirline ? (
          airlineFleet.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
              No aircraft found for this airline.
            </p>
          ) : (
            airlineFleet.map((group) => (
              <article
                key={group.type}
                className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-slate-100 shadow-lg shadow-cyan-500/5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{group.type}</h2>
                    <p className="text-xs text-slate-300/80">
                      {group.items.length} registration{group.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {group.items.map((item) => {
                    const seen = isAircraftSeen(seenIds, item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                          seen
                            ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-100"
                            : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-500/5"
                        }`}
                      >
                        <div>
                          <p className="text-base font-semibold tracking-tight">{item.registration}</p>
                          <p className="text-xs text-slate-300/80">
                            {item.country ? `Registered in ${item.country}` : "Registration country unknown"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSeen(item.id)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                            seen
                              ? "border-cyan-300/70 bg-cyan-400/20 text-cyan-100"
                              : "border-white/20 bg-white/5 text-slate-200 hover:border-cyan-300/60 hover:bg-cyan-500/10 hover:text-cyan-100"
                          }`}
                        >
                          {seen ? (
                            <>
                              <span className="inline-block h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
                              Seen
                            </>
                          ) : (
                            "Mark seen"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))
          )
        ) : (
          <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
            Select an airline from the list to browse its fleet.
          </p>
        )}
      </section>
    </div>
  );
}
