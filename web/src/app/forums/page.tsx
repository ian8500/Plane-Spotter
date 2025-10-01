import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";
import Link from "next/link";
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
    <PageWrapper className="space-y-12">
      <header className="space-y-6">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            Community Forums
          </span>
          <h1 className="text-4xl font-semibold text-white">Connect with fellow spotters</h1>
          <p className="max-w-3xl text-base text-slate-300">
            Swap movement reports, coordinate meetups, and ask questions across our network of UK airports. Start in a community
            hub below or jump straight into your local airport thread.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/25"
          >
            Sign in to start a thread
          </Link>
          <Link
            href="/docs/community"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            Review community guidelines
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Community hubs</h2>
          <p className="text-sm text-slate-300">
            Themed spaces for platform updates, live movement alerts, ATC chatter, and relaxed off-topic talk.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {GENERAL_FORUM_LIST.map((forum) => (
            <Link
              key={forum.slug}
              href={`/forums/${forum.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-100 shadow-lg shadow-cyan-500/5 transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">{forum.title}</h3>
                <p className="text-sm text-slate-200">{forum.description}</p>
              </div>
              {forum.highlight ? (
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-200">{forum.highlight}</p>
              ) : null}
              <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-cyan-300">
                Visit forum →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Airport forums</h2>
          <p className="text-sm text-slate-300">
            Dedicated threads for each airport we currently cover—perfect for planning a spotting session or sharing local intel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedAirports.map((airport) => (
            <Link
              key={airport.icao}
              href={`/forums/airports/${airport.icao.toLowerCase()}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-100 shadow-lg shadow-cyan-500/5 transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <span>{airport.icao}</span>
                  <span>{airport.iata}</span>
                </div>
                <h3 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">{airport.name}</h3>
                <p className="text-sm text-slate-200">{formatAirportSubtitle(airport)}</p>
              </div>
              <span className="mt-auto inline-flex items-center pt-4 text-sm font-semibold text-cyan-300">
                Enter discussion →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
