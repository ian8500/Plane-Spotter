import Link from "next/link";

type Module = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: string;
  readonly signal: string;
};

type Metric = {
  readonly label: string;
  readonly value: string;
};

type Insight = {
  readonly title: string;
  readonly detail: string;
  readonly tone: "sky" | "emerald" | "slate";
};

const modules: Module[] = [
  {
    title: "Airports",
    description: "Structured guides with runway intel, best vantage points, and logistics tips from the community.",
    href: "/airports",
    icon: "🛬",
    signal: "Field guide",
  },
  {
    title: "Frequencies",
    description: "Tower, ground, ATIS, and guard channels tracked with verification badges and update history.",
    href: "/frequencies",
    icon: "📡",
    signal: "Live ATC",
  },
  {
    title: "Maps",
    description: "Georeferenced airport diagrams layered with sun path, noise abatement, and traffic flow overlays.",
    href: "/maps",
    icon: "🗺️",
    signal: "Situational",
  },
  {
    title: "Live ADS-B",
    description: "Real-time aircraft tracking with fleet filters, alerts, and collaborative session sharing.",
    href: "/live",
    icon: "✈️",
    signal: "Ops feed",
  },
  {
    title: "Logbook",
    description: "Catalog every sighting with EXIF sync, weather capture, and export-ready mission summaries.",
    href: "/logbook",
    icon: "🧭",
    signal: "Records",
  },
  {
    title: "Community",
    description: "Coordinate meets, swap alerts, and elevate your craft with curated critiques and masterclasses.",
    href: "/community",
    icon: "🤝",
    signal: "Network",
  },
];

const missionMetrics: Metric[] = [
  { label: "Airports profiled", value: "128" },
  { label: "Verified frequencies", value: "412" },
  { label: "Community intel drops", value: "5.2k" },
];

const missionInsights: Insight[] = [
  {
    title: "Community curated",
    detail: "Contributions are vetted by aviation photographers, controllers, and moderators before publishing.",
    tone: "sky",
  },
  {
    title: "Always in sync",
    detail: "Live data sources refresh every 60 seconds with offline-ready caching for field reliability.",
    tone: "emerald",
  },
  {
    title: "Privacy aware",
    detail: "Granular sharing controls keep sensitive locations restricted to vetted collaborators.",
    tone: "slate",
  },
];

const supportLinks = [
  { label: "Browse airports", href: "/airports" },
  { label: "View tactical map", href: "/maps" },
  { label: "Join the community", href: "/login" },
] as const;

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.35),transparent_55%)]"
        aria-hidden
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 lg:px-12 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/80 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]">
              Elite spotting workstation
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                Plan, execute, and document every mission with confidence
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                Plane Spotter unifies airport intelligence, live operations, and collaborative tooling into one refined
                command center. Arrive prepared, capture each frame, and debrief with data-rich precision.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                Launch mission control
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/airports"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-sky-400/60 hover:text-sky-200"
              >
                Survey featured fields
                <span aria-hidden>→</span>
              </Link>
            </div>
            <dl className="grid gap-6 text-sm sm:grid-cols-3">
              {missionMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/45 p-5 shadow-inner shadow-black/30 backdrop-blur"
                >
                  <dt className="text-slate-400">{metric.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-slate-50">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="relative">
            <div className="absolute -left-10 top-6 h-36 w-36 rounded-full bg-sky-500/30 blur-3xl" aria-hidden />
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Mission checklist</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Build a briefing that keeps your crew aligned from pre-flight setup through golden hour departures.
                  </p>
                </div>
                <ol className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                      01
                    </span>
                    Sync custom loadouts, preferred lenses, and time-on-target reminders.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                      02
                    </span>
                    Export GPS tracks, shot lists, and weather contingencies to teammates.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                      03
                    </span>
                    Capture sightings with automated EXIF enrichment and collaborative annotations.
                  </li>
                </ol>
                <div className="mt-8 grid gap-3 text-sm">
                  {supportLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-sky-200"
                    >
                      {item.label}
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="space-y-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-slate-50">Modular systems engineered for clarity</h2>
              <p className="max-w-2xl text-base text-slate-400">
                Navigate between research, live operations, and archiving with a consistent visual language. Every module is
                handcrafted to elevate situational awareness and visual storytelling.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              Explore membership benefits
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="group relative overflow-hidden rounded-3xl border border-white/6 bg-white/5 p-6 shadow-xl shadow-black/25 transition hover:border-sky-400/40 hover:bg-slate-900/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-2xl" aria-hidden>
                    {module.icon}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400 transition group-hover:border-sky-500/40 group-hover:text-sky-200">
                    {module.signal}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-100">{module.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{module.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition group-hover:text-sky-200">
                  Open module
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-2xl shadow-slate-950/50 backdrop-blur lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-slate-50">Built with the pros, trusted in the field</h2>
            <p className="text-base text-slate-400">
              From the ramp to the runway threshold, Plane Spotter is co-designed with seasoned photographers, ATC
              veterans, and community moderators. Expect reliable data, purposeful workflows, and a platform that adapts to
              evolving missions.
            </p>
            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2 sm:gap-5">
              {missionInsights.map((insight) => (
                <div
                  key={insight.title}
                  className={`rounded-2xl border p-4 ${
                    insight.tone === "sky"
                      ? "border-sky-500/25 bg-sky-500/12"
                      : insight.tone === "emerald"
                        ? "border-emerald-400/25 bg-emerald-400/12"
                        : "border-white/12 bg-white/5"
                  }`}
                >
                  <strong className="block text-slate-100">{insight.title}</strong>
                  {insight.detail}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-inner shadow-slate-950/60">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Stay ahead of the pattern</h3>
              <p className="mt-2 text-sm text-slate-400">
                Weekly intel briefings highlight new airport dossiers, rare movements, and operational advisories tailored to
                your watchlist.
              </p>
            </div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden />
                Precision summaries of runway works, NOTAMs, and equipment outages.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
                Event-ready spotter guides for rare aircraft appearances and special operations.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-white/70" aria-hidden />
                Analyst commentary with equipment setup, vantage planning, and debrief insights.
              </li>
            </ul>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-sky-400/50 hover:text-sky-200"
            >
              Subscribe to briefings
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
