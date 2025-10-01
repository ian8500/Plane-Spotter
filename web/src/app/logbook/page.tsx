import Link from "next/link";
import { apiGet } from "@/lib/api";
import SpottingLog from "./spotting-log";

type Aircraft = {
  id: number;
  registration: string;
  type: string;
  airline: string;
  country: string;
};

export default async function LogbookPage() {
  let aircraft: Aircraft[] = [];

  try {
    aircraft = await apiGet<Aircraft[]>("/aircraft/");
  } catch (error) {
    console.error("Failed to load aircraft data", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Spotting Log</h1>
            <p className="text-slate-600">
              Browse the latest fleet data and keep track of the aircraft you have spotted.
              Filter by airline and aircraft type to focus your logbook on specific fleets.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Prefer to capture detailed sightings? Use the manual logbook to record when and where
              you saw an aircraft.
            </p>
            <Link
              href="/logbook/log"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Log a sighting manually
            </Link>
          </div>
        </header>

        <SpottingLog initialAircraft={aircraft} />
      </div>
    </main>
  );
}
