import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";
import Link from "next/link";
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
    <PageWrapper className="space-y-10">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Spotting Log</h1>
          <p className="max-w-3xl text-sm text-slate-300">
            Browse the latest fleet data and keep track of the aircraft you have spotted. Filter by airline and aircraft type to
            focus your logbook on specific fleets.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Prefer to capture detailed sightings? Use the manual logbook to record when and where you saw an aircraft.
          </p>
          <Link
            href="/logbook/log"
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
          >
            Log a sighting manually
          </Link>
        </div>
      </header>

      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-xl shadow-cyan-500/5 sm:p-6">
        <SpottingLog initialAircraft={aircraft} />
      </div>
    </PageWrapper>
  );
}
