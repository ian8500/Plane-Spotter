import { PageWrapper } from "@/app/components/page-wrapper";
import { apiGet } from "@/lib/api";
import Link from "next/link";

type Frequency = {
  id: number;
  service: string;
  mhz: string;
  description: string;
};

type SpottingLocation = {
  id: number;
  title: string;
  description: string;
  tips: string;
  lat: number;
  lon: number;
};

type AirportResource = {
  id: number;
  title: string;
  url: string;
  category: string;
  description: string;
};

type Airport = {
  id: number;
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  frequencies: Frequency[];
  spots: SpottingLocation[];
  resources: AirportResource[];
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const RESOURCE_CATEGORY_LABELS: Record<string, string> = {
  map: "Airfield Map",
  guide: "Spotting Guide",
  official: "Official",
  community: "Community",
  video: "Video",
};

const RESOURCE_CATEGORY_CLASSES: Record<string, string> = {
  map: "bg-emerald-500/10 text-emerald-200",
  guide: "bg-sky-500/10 text-sky-200",
  official: "bg-slate-500/10 text-slate-200",
  community: "bg-purple-500/10 text-purple-200",
  video: "bg-orange-500/10 text-orange-200",
};

export default async function AirportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const airport = await apiGet<Airport>(`/airports/${id}/`);

  return (
    <PageWrapper className="space-y-10">
      <div className="space-y-3">
        <Link
          href="/airports"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to all airports
        </Link>
        <h1 className="text-3xl font-semibold text-white">
          {airport.icao} · {airport.name}
        </h1>
        <p className="text-sm text-slate-300">
          {airport.city}, {airport.country}
        </p>
        <p className="text-xs text-slate-400">
          Coordinates: {airport.lat.toFixed(4)}, {airport.lon.toFixed(4)}
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Frequencies</h2>
          <p className="mt-1 text-sm text-slate-300">
            Active tower, approach, and ground channels to monitor during your spotting session.
          </p>
        </div>
        {airport.frequencies.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            No frequencies have been added yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {airport.frequencies.map((frequency) => (
              <article
                key={frequency.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-cyan-500/5"
              >
                <h3 className="text-lg font-semibold text-white">{frequency.service}</h3>
                <p className="font-mono text-sm text-cyan-300">
                  {Number(frequency.mhz).toFixed(3)} MHz
                </p>
                {frequency.description ? (
                  <p className="mt-2 text-sm text-slate-300">{frequency.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Spotting Locations</h2>
          <p className="mt-1 text-sm text-slate-300">
            Crowd-sourced vantage points with tips on lighting, access, and ideal movements to capture.
          </p>
        </div>
        {airport.spots.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            No spotting locations recorded yet. Be the first to add one!
          </p>
        ) : (
          <div className="space-y-4">
            {airport.spots.map((spot) => (
              <article
                key={spot.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-cyan-500/5"
              >
                <h3 className="text-lg font-semibold text-white">{spot.title}</h3>
                {spot.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{spot.description}</p>
                ) : null}
                <p className="mt-3 text-xs text-slate-400">
                  Coordinates: {spot.lat.toFixed(4)}, {spot.lon.toFixed(4)}
                </p>
                {spot.tips ? (
                  <p className="mt-3 rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
                    <strong className="font-semibold">Tips:</strong> {spot.tips}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Resources</h2>
          <p className="mt-1 text-sm text-slate-300">
            Hand-picked guides, maps, and community links to help you plan your visit.
          </p>
        </div>
        {airport.resources.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            No resources listed yet.
          </p>
        ) : (
          <div className="space-y-4">
            {airport.resources.map((resource) => {
              const categoryLabel = RESOURCE_CATEGORY_LABELS[resource.category] || "Resource";
              const categoryClasses =
                RESOURCE_CATEGORY_CLASSES[resource.category] || "bg-slate-500/10 text-slate-200";

              return (
                <article
                  key={resource.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-cyan-500/5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-cyan-300 hover:underline"
                      >
                        {resource.title}
                      </a>
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryClasses}`}
                    >
                      {categoryLabel}
                    </span>
                  </div>
                  {resource.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{resource.description}</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
