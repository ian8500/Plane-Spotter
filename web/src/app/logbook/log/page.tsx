"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

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
          setAircraftError("Unable to load aircraft details right now. Airline and type will remain blank.");
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
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm text-blue-600">
            <Link href="/logbook" className="hover:underline">
              ← Back to fleet log
            </Link>
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Manual Sightings Log</h1>
          <p className="text-slate-600">
            Capture the aircraft you have spotted, including when and where you saw them. Entries
            are stored locally on this device so you can build a personal spotting diary.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-slate-700">
                Registration
                <input
                  value={form.registration}
                  onChange={(event) => handleRegistrationChange(event.target.value)}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base uppercase tracking-wide text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. G-EZTH"
                  required
                />
              </label>

              <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Airline</span>
                <input
                  value={form.airline || ""}
                  readOnly
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-base text-slate-600"
                  placeholder={aircraftLoaded ? "Auto-filled from fleet data" : "Loading..."}
                />
              </div>

              <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Aircraft type</span>
                <input
                  value={form.type || ""}
                  readOnly
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-base text-slate-600"
                  placeholder={aircraftLoaded ? "Auto-filled from fleet data" : "Loading..."}
                />
              </div>

              <label className="flex flex-col text-sm font-medium text-slate-700">
                Location / Airport
                <input
                  value={form.location}
                  onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Where did you spot it?"
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-slate-700">
                Date spotted
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>

              <label className="flex flex-col text-sm font-medium text-slate-700 md:col-span-2">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  className="mt-1 min-h-[96px] rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Add any extra details from the sighting"
                />
              </label>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              {aircraftError ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                  {aircraftError}
                </p>
              ) : matchedAircraft ? (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-800">
                  Matched {matchedAircraft.airline || "airline"} · {matchedAircraft.type || "type"} from fleet data.
                </p>
              ) : aircraftLoaded && form.registration.trim() ? (
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-800">
                  No fleet data found for this registration. Airline and type will remain blank.
                </p>
              ) : null}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Add to logbook
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-900">Your sightings</h2>
            <p className="text-sm text-slate-600">
              {entries.length === 0
                ? "No entries yet — start logging to build your personal spotting history."
                : `Tracking ${entries.length} sighting${entries.length === 1 ? "" : "s"}.`}
            </p>
          </div>

          {sortedEntries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
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
                  <li key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900">{entry.registration}</h3>
                        <dl className="grid gap-1 text-sm text-slate-600">
                          {entry.airline && (
                            <div>
                              <dt className="font-medium text-slate-500">Airline</dt>
                              <dd>{entry.airline}</dd>
                            </div>
                          )}
                          {entry.type && (
                            <div>
                              <dt className="font-medium text-slate-500">Type</dt>
                              <dd>{entry.type}</dd>
                            </div>
                          )}
                          {entry.location && (
                            <div>
                              <dt className="font-medium text-slate-500">Location</dt>
                              <dd>{entry.location}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="font-medium text-slate-500">Date spotted</dt>
                            <dd>{formattedDate}</dd>
                          </div>
                        </dl>
                        {entry.notes && <p className="text-sm text-slate-600">{entry.notes}</p>}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="self-start rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
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
      </div>
    </main>
  );
}
