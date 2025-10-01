import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";
import Link from "next/link";

type Airport = {
  id: number;
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

export default async function AirportsPage() {
  let airports: Airport[] = [];
  let loadError: string | null = null;

  try {
    airports = await apiGet<Airport[]>("/airports/");
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading airports.";
    loadError = message;

    console.error("Failed to load airports", error);
  }

  return (
    <PageWrapper className="space-y-10">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Airports</h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Explore curated spotting guides for every airfield we cover. Each airport profile highlights
            on-the-ground insights, essential frequencies, and the community resources to plan your next
            trip with confidence.
          </p>
        </div>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
          <p className="font-semibold">We couldn&apos;t load the airports just now.</p>
          <p className="mt-2 text-red-200">
            {loadError} Try refreshing the page or come back later.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {airports.map((airport) => (
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
                  <h2 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
                    {airport.name}
                  </h2>
                  <p className="text-sm text-slate-300">
                    {airport.city}, {airport.country}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-cyan-300">
                  View guide →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageWrapper>
  );
}
