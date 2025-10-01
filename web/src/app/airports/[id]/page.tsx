import Link from "next/link";
import { apiGet } from "@/lib/api";

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
  map: "bg-emerald-100 text-emerald-800",
  guide: "bg-blue-100 text-blue-800",
  official: "bg-slate-100 text-slate-800",
  community: "bg-purple-100 text-purple-800",
  video: "bg-orange-100 text-orange-800",
};

export default async function AirportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const airport = await apiGet<Airport>(`/airports/${id}/`);

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <Link href="/airports" className="text-sm text-blue-600 hover:underline">
          ← Back to all airports
        </Link>
        <h1 className="text-3xl font-bold">
          {airport.icao} · {airport.name}
        </h1>
        <p className="text-gray-600">
          {airport.city}, {airport.country}
        </p>
        <p className="text-sm text-gray-500">
          Coordinates: {airport.lat.toFixed(4)}, {airport.lon.toFixed(4)}
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Frequencies</h2>
        {airport.frequencies.length === 0 ? (
          <p className="text-gray-600">No frequencies have been added yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {airport.frequencies.map((freq) => (
              <article key={freq.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{freq.service}</h3>
                <p className="text-blue-600 font-mono text-sm">{Number(freq.mhz).toFixed(3)} MHz</p>
                {freq.description ? (
                  <p className="text-gray-600 mt-2 text-sm">{freq.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Spotting Locations</h2>
        {airport.spots.length === 0 ? (
          <p className="text-gray-600">No spotting locations recorded yet. Be the first to add one!</p>
        ) : (
          <div className="space-y-4">
            {airport.spots.map((spot) => (
              <article key={spot.id} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{spot.title}</h3>
                {spot.description ? <p className="text-gray-700 mt-2">{spot.description}</p> : null}
                <p className="text-sm text-gray-500 mt-3">
                  Coordinates: {spot.lat.toFixed(4)}, {spot.lon.toFixed(4)}
                </p>
                {spot.tips ? (
                  <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    <strong className="font-semibold">Tips:</strong> {spot.tips}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Resources</h2>
        {airport.resources.length === 0 ? (
          <p className="text-gray-600">No resources listed yet.</p>
        ) : (
          <div className="space-y-4">
            {airport.resources.map((resource) => {
              const categoryLabel = RESOURCE_CATEGORY_LABELS[resource.category] || "Resource";
              const categoryClasses = RESOURCE_CATEGORY_CLASSES[resource.category] || "bg-gray-100 text-gray-800";

              return (
                <article key={resource.id} className="rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {resource.title}
                      </a>
                    </h3>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${categoryClasses}`}>
                      {categoryLabel}
                    </span>
                  </div>
                  {resource.description ? (
                    <p className="text-gray-700 mt-2 text-sm leading-relaxed">{resource.description}</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
