import Link from "next/link";
import { apiGet } from "@/lib/api";
import { GENERAL_FORUM_LIST } from "./topics";

type AirportSummary = {
  id: number;
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

function formatAirportSubtitle(airport: AirportSummary): string {
  const parts = [airport.city, airport.country].filter(Boolean);
  return parts.join(", ");
}

export default async function ForumsLandingPage() {
  let airports: AirportSummary[] = [];

  try {
    airports = await apiGet<AirportSummary[]>("/airports/");
  } catch (error) {
    console.error("Failed to load airport list", error);
  }

  const sortedAirports = [...airports].sort((a, b) => a.icao.localeCompare(b.icao));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Community Forums
            </span>
            <h1 className="text-4xl font-bold text-slate-900">Connect with fellow spotters</h1>
            <p className="max-w-2xl text-base text-slate-600">
              Swap movement reports, coordinate meetups, and ask questions across our network of UK airports.
              Start in a community hub below or jump straight into your local airport thread.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in to start a thread
            </Link>
            <Link
              href="/docs/community"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
            >
              Review community guidelines
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Community hubs</h2>
              <p className="text-sm text-slate-600">
                Themed spaces for platform updates, live movement alerts, ATC chatter, and relaxed off-topic talk.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {GENERAL_FORUM_LIST.map((forum) => (
              <Link
                key={forum.slug}
                href={`/forums/${forum.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{forum.title}</h3>
                  <p className="text-sm text-slate-600">{forum.description}</p>
                </div>
                {forum.highlight && (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600">{forum.highlight}</p>
                )}
                <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-blue-600">
                  Visit forum →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Airport forums</h2>
              <p className="text-sm text-slate-600">
                Dedicated threads for each airport we currently cover—perfect for planning a spotting session or sharing local intel.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedAirports.map((airport) => (
              <Link
                key={airport.icao}
                href={`/forums/airports/${airport.icao.toLowerCase()}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>{airport.icao}</span>
                    <span>{airport.iata}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">{airport.name}</h3>
                  <p className="text-sm text-slate-600">{formatAirportSubtitle(airport)}</p>
                </div>
                <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-blue-600">
                  Enter discussion →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
