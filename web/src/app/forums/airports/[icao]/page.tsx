import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import { ForumTopicList } from "../../components/topic-list";
import { ForumTopic } from "../../topics";

type Frequency = {
  id: number;
  service: string;
  mhz: string | number;
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
  params: Promise<{ icao: string }>;
};

function buildAirportTopics(airport: Airport): ForumTopic[] {
  const year = new Date().getFullYear();
  return [
    {
      title: `${airport.icao} movements & logbook ${year}`,
      excerpt: `Daily updates for arrivals, departures, and special visitors at ${airport.name}. Share your logs and attach photos when you can!`,
      replies: 268,
      lastActivity: "just now",
      tags: ["movements", "photos"],
      pinned: true,
    },
    {
      title: `${airport.city} trip planning help`,
      excerpt: `Travelling to ${airport.name}? Ask for hotel tips, transport advice, and the best times of day for runway operations.`,
      replies: 74,
      lastActivity: "1 hour ago",
      tags: ["planning", "travel"],
    },
    {
      title: `${airport.icao} ATC & procedure updates`,
      excerpt: `Log frequency changes, runway works, or new approach procedures impacting spotting around ${airport.icao}.`,
      replies: 39,
      lastActivity: "today",
      tags: ["atc", "ops"],
    },
  ];
}

function buildGuidelines(airport: Airport): string[] {
  return [
    `Include runway direction, time, and aircraft type when reporting movements at ${airport.icao}.`,
    "Avoid sharing anything heard on closed frequencies or from restricted areas.",
    "Tag your thread titles with [Report], [Question], or [Meetup] so others can skim easily.",
  ];
}

function formatMhz(value: string | number): string {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }
  return numeric.toFixed(3);
}

export default async function AirportForumPage({ params }: PageProps) {
  const { icao } = await params;
  const slug = icao.toUpperCase();

  let airport: Airport | null = null;

  try {
    airport = await apiGet<Airport>(`/airports/${slug}/`);
  } catch (error) {
    console.error(`Failed to load airport forum data for ${slug}`, error);
    airport = null;
  }

  if (!airport) {
    notFound();
  }

  const topics = buildAirportTopics(airport);
  const guidelines = buildGuidelines(airport);
  const quickResources = airport.resources.slice(0, 3);
  const keyFrequencies = airport.frequencies.slice(0, 4);
  const featuredSpots = airport.spots.slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <nav className="text-sm text-slate-500">
          <Link href="/forums" className="font-medium text-blue-600 hover:underline">
            ← Back to forums
          </Link>
        </nav>

        <header className="space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
              Airport forum
            </span>
            <h1 className="text-3xl font-bold text-slate-900">
              {airport.icao} · {airport.name}
            </h1>
            <p className="max-w-3xl text-base text-slate-600">
              Coordinate spotting at {airport.name} in {airport.city}, {airport.country}. Share daily movement logs, plan
              meetups, and keep everyone up to speed on operational changes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{airport.city}, {airport.country}</p>
              <p className="text-xs text-slate-500">{airport.lat.toFixed(4)}, {airport.lon.toFixed(4)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequencies listed</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{airport.frequencies.length}</p>
              <p className="text-xs text-slate-500">Check the sidebar for the busiest ones</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Spotting locations</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{airport.spots.length}</p>
              <p className="text-xs text-slate-500">Top picks are highlighted below</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <ForumTopicList topics={topics} />
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Forum guidelines</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {guidelines.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {keyFrequencies.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Key frequencies</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {keyFrequencies.map((freq) => (
                    <li key={freq.id} className="flex flex-col">
                      <span className="font-medium text-slate-900">{freq.service}</span>
                      <span className="font-mono text-sm text-blue-600">{formatMhz(freq.mhz)} MHz</span>
                      {freq.description ? (
                        <span className="text-xs text-slate-500">{freq.description}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {quickResources.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick resources</h2>
                <ul className="mt-4 space-y-4">
                  {quickResources.map((resource) => (
                    <li key={resource.id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-lg border border-transparent p-3 transition hover:border-blue-200 hover:bg-blue-50"
                      >
                        <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">{resource.title}</p>
                        <p className="text-xs text-slate-600">{resource.description}</p>
                      </a>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/airports/${airport.id}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View full airport guide →
                </Link>
              </div>
            )}

            {featuredSpots.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Spotlight locations</h2>
                <ul className="mt-4 space-y-4 text-sm text-slate-600">
                  {featuredSpots.map((spot) => (
                    <li key={spot.id} className="space-y-1">
                      <p className="font-medium text-slate-900">{spot.title}</p>
                      {spot.description ? <p>{spot.description}</p> : null}
                      {spot.tips ? (
                        <p className="text-xs text-blue-600">Tips: {spot.tips}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
