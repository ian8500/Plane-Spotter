"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";

type FormState = {
  registration: string;
  airline: string;
  type: string;
  location: string;
  date: string;
  notes: string;
};

type LogEntry = FormState & {
  id: string;
  createdAt: string;
};

const STORAGE_KEY = "plane-spotter/manual-logbook";
const AIRCRAFT_CACHE_KEY = "plane-spotter/manual-logbook-aircraft";

type Aircraft = {
  registration: string;
  airline?: string;
  type?: string;
};

const createInitialFormState = (): FormState => ({
  registration: "",
  airline: "",
  type: "",
  location: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
});

const createEntryId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function ManualLogbookPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [form, setForm] = useState<FormState>(createInitialFormState);
  const [error, setError] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [aircraftIndex, setAircraftIndex] = useState<Map<string, Aircraft>>(new Map());
  const [aircraftLoaded, setAircraftLoaded] = useState(false);
  const [aircraftError, setAircraftError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LogEntry[];
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      } catch (storageError) {
        console.warn("Unable to parse manual logbook storage", storageError);
      }
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, storageReady]);

  useEffect(() => {
    let cancelled = false;

    const loadAircraft = async () => {
      setAircraftError(null);

      try {
        if (typeof window !== "undefined") {
          const cached = window.sessionStorage.getItem(AIRCRAFT_CACHE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as Aircraft[];
              if (!cancelled && Array.isArray(parsed)) {
                const nextIndex = new Map<string, Aircraft>();
                parsed.forEach((aircraft) => {
                  if (aircraft.registration) {
                    nextIndex.set(aircraft.registration.toUpperCase(), aircraft);
                  }
                });
                setAircraftIndex(nextIndex);
                setAircraftLoaded(true);
                return;
              }
            } catch (parseError) {
              console.warn("Unable to parse cached aircraft data", parseError);
              window.sessionStorage.removeItem(AIRCRAFT_CACHE_KEY);
            }
          }
        }

        const data = await apiGet<Aircraft[]>("/aircraft/");
        if (cancelled) {
          return;
        }

        const nextIndex = new Map<string, Aircraft>();
        data.forEach((aircraft) => {
          if (aircraft.registration) {
            nextIndex.set(aircraft.registration.toUpperCase(), aircraft);
          }
        });
        setAircraftIndex(nextIndex);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(AIRCRAFT_CACHE_KEY, JSON.stringify(data));
        }
        setAircraftLoaded(true);
      } catch (loadError) {
        console.error("Failed to load aircraft details", loadError);
        if (!cancelled) {
          setAircraftError(
            "Unable to load aircraft details right now. Airline and type will remain blank.",
          );
          setAircraftLoaded(true);
        }
      }
    };

    void loadAircraft();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!form.registration.trim()) {
      if (form.airline || form.type) {
        setForm((prev) => ({ ...prev, airline: "", type: "" }));
      }
      return;
    }

    const lookup = aircraftIndex.get(form.registration.trim().toUpperCase());
    const nextAirline = lookup?.airline ?? "";
    const nextType = lookup?.type ?? "";

    if (form.airline !== nextAirline || form.type !== nextType) {
      setForm((prev) => ({
        ...prev,
        airline: nextAirline,
        type: nextType,
      }));
    }
  }, [aircraftIndex, form.airline, form.registration, form.type]);

  const matchedAircraft = useMemo(() => {
    if (!form.registration.trim()) {
      return null;
    }

    return aircraftIndex.get(form.registration.trim().toUpperCase()) ?? null;
  }, [aircraftIndex, form.registration]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (a.date === b.date) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [entries]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedRegistration = form.registration.trim().toUpperCase();
    if (!trimmedRegistration) {
      setError("Please add an aircraft registration to log your sighting.");
      return;
    }

    if (!form.date) {
      setError("Please choose when you spotted the aircraft.");
      return;
    }

    const newEntry: LogEntry = {
      ...form,
      registration: trimmedRegistration,
      id: createEntryId(),
      createdAt: new Date().toISOString(),
    };

    setEntries((previous) => [newEntry, ...previous]);
    setError(null);

    setForm((current) => ({
      ...createInitialFormState(),
      location: current.location,
    }));
  };

  const handleDelete = (id: string) => {
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
  };

  const handleRegistrationChange = (rawValue: string) => {
    const value = rawValue.toUpperCase();
    const lookup = value.trim() ? aircraftIndex.get(value.trim()) : undefined;

    setForm((prev) => ({
      ...prev,
      registration: value,
      airline: lookup?.airline ?? "",
      type: lookup?.type ?? "",
    }));
  };

  return (
    <PageWrapper className="space-y-10">
      <header className="space-y-3">
        <Link
          href="/logbook"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to fleet log
        </Link>
        <h1 className="text-3xl font-semibold text-white">Manual Sightings Log</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Capture the aircraft you have spotted, including when and where you saw them. Entries are stored locally on this device
          so you can build a personal spotting diary.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-300">
              Registration
              <input
                value={form.registration}
                onChange={(event) => handleRegistrationChange(event.target.value)}
                className="mt-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-base uppercase tracking-wide text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                placeholder="e.g. G-EZTH"
                required
              />
            </label>

            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Airline
              <input
                value={form.airline || ""}
                readOnly
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-slate-200"
                placeholder={aircraftLoaded ? "Auto-filled from fleet data" : "Loading..."}
              />
            </div>

            <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Aircraft type
              <input
                value={form.type || ""}
                readOnly
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-slate-200"
                placeholder={aircraftLoaded ? "Auto-filled from fleet data" : "Loading..."}
              />
            </div>

            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-300">
              Location / Airport
              <input
                value={form.location}
                onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                className="mt-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                placeholder="Where did you spot it?"
              />
            </label>

            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-300">
              Date spotted
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                className="mt-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                required
              />
            </label>

            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-300 md:col-span-2">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="mt-2 min-h-[96px] rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-base text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                placeholder="Add any extra details from the sighting"
              />
            </label>
          </div>

          <div className="space-y-2 text-sm text-slate-200">
            {aircraftError ? (
              <p className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-amber-100">
                {aircraftError}
              </p>
            ) : matchedAircraft ? (
              <p className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                Matched {matchedAircraft.airline || "airline"} · {matchedAircraft.type || "type"} from fleet data.
              </p>
            ) : aircraftLoaded && form.registration.trim() ? (
              <p className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-cyan-100">
                No fleet data found for this registration. Airline and type will remain blank.
              </p>
            ) : null}
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/20 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/25"
            >
              Add to logbook
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your sightings</h2>
            <p className="text-sm text-slate-300">
              {entries.length === 0
                ? "No entries yet — start logging to build your personal spotting history."
                : `Tracking ${entries.length} sighting${entries.length === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

        {sortedEntries.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-300">
            Every time you log an aircraft, it will appear here.
          </p>
        ) : (
          <ul className="space-y-4">
            {sortedEntries.map((entry) => {
              const formattedDate = entry.date
                ? new Intl.DateTimeFormat(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(entry.date))
                : "Date unknown";

              return (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-100 shadow-lg shadow-cyan-500/5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">{entry.registration}</h3>
                      <dl className="grid gap-2 text-sm text-slate-200">
                        {entry.airline && (
                          <div>
                            <dt className="font-semibold text-slate-300">Airline</dt>
                            <dd>{entry.airline}</dd>
                          </div>
                        )}
                        {entry.type && (
                          <div>
                            <dt className="font-semibold text-slate-300">Type</dt>
                            <dd>{entry.type}</dd>
                          </div>
                        )}
                        {entry.location && (
                          <div>
                            <dt className="font-semibold text-slate-300">Location</dt>
                            <dd>{entry.location}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="font-semibold text-slate-300">Date spotted</dt>
                          <dd>{formattedDate}</dd>
                        </div>
                      </dl>
                      {entry.notes && <p className="text-sm text-slate-200">{entry.notes}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="self-start rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-200 transition hover:border-red-300/60 hover:bg-red-500/20"
                      aria-label={`Remove ${entry.registration} from logbook`}
                    >
                      Remove entry
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageWrapper>
  );
}
