import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";

import FleetBrowser from "./fleet-browser";

type Aircraft = {
  id: number;
  registration: string;
  type: string;
  airline: string;
  country: string;
};

export const metadata = {
  title: "Airline Fleets",
  description: "Browse airline fleets and track the registrations you have already spotted.",
};

export default async function FleetsPage() {
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
          <h1 className="text-3xl font-semibold text-white">Airline Fleets</h1>
          <p className="max-w-3xl text-sm text-slate-300">
            Select a carrier to explore its active fleet. Registrations you have marked as seen in your spotting log are
            highlighted automatically so you can focus on the next additions to your collection.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Fleet information is sourced from the Plane Spotter dataset and updates as the aircraft catalog grows.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-xl shadow-cyan-500/5 sm:p-6">
        <FleetBrowser aircraft={aircraft} />
      </div>
    </PageWrapper>
  );
}
