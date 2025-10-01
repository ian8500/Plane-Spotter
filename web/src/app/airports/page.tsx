import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";
import { AirportsExplorer } from "./airports-explorer";

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
        <AirportsExplorer airports={airports} />
      )}
    </PageWrapper>
  );
}
