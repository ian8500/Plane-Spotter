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
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Spotting Log</h1>
          <p className="text-slate-600">
            Browse the latest fleet data and keep track of the aircraft you have spotted.
            Filter by airline and aircraft type to focus your logbook on specific fleets.
          </p>
        </header>

        <SpottingLog initialAircraft={aircraft} />
      </div>
    </main>
  );
}
