import Link from "next/link";

const sections = [
  {
    title: "Airports",
    description: "Spotting locations, reviews, logistics intel, and stunning gallery highlights.",
    href: "/airports",
    icon: "🛬",
  },
  {
    title: "Frequencies",
    description: "Tower, ground, ATIS, and emergency channels verified by the community.",
    href: "/frequencies",
    icon: "📡",
  },
  {
    title: "Maps",
    description: "Immersive taxi overlays, runway diagrams, and real-time geolocation tools.",
    href: "/maps",
    icon: "🗺️",
  },
  {
    title: "Live ADS-B",
    description: "Track nearby aircraft with altitude, speed, and equipment filters at a glance.",
    href: "/live",
    icon: "✈️",
  },
  {
    title: "Logbook",
    description: "Capture sightings with weather, camera metadata, and shareable notes.",
    href: "/logbook",
    icon: "🧭",
  },
  {
    title: "Community",
    description: "Coordinate meets, swap intel, and celebrate milestones with fellow spotters.",
    href: "/community",
    icon: "🤝",
  },
] as const;

const stats = [
  { label: "Airports profiled", value: "128" },
  { label: "Verified frequencies", value: "412" },
  { label: "Community reports", value: "5.2k" },
];

const quickLinks = [
  { label: "Browse airports", href: "/airports" },
  { label: "View live map", href: "/maps" },
  { label: "Join the community", href: "/login" },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.35),transparent_55%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16 lg:px-12 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium uppercase tracking-[0.2em] text-sky-200/80 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]">
              Precision spotting suite
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                Command your next
                <br className="hidden lg:block" /> spotting mission
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                Plane Spotter delivers curated intelligence for runways across the globe—pairing detailed airport guides
                with live operational data so you can arrive prepared and capture every moment with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                Launch command center
              </Link>
              <Link
                href="/airports"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-sky-400/60 hover:text-sky-200"
              >
                Explore featured airports
              </Link>
            </div>
            <dl className="grid gap-6 text-sm sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-inner shadow-black/30 backdrop-blur"
                >
                  <dt className="text-slate-400">{stat.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-slate-50">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="relative">
            <div className="absolute -left-8 top-6 h-32 w-32 rounded-full bg-sky-500/30 blur-3xl" aria-hidden />
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Mission brief</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Monitor conditions, coordinate gear, and sync with teammates before you head to the field.
                  </p>
                </div>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                      01
                    </span>
                    Export custom checklists and share routes tailored to each airport.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                      02
                    </span>
                    Sync your logbook with weather snapshots and equipment presets.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                      03
                    </span>
                    Invite teammates to collaborate on locations, alerts, and coverage.
                  </li>
                </ul>
                <div className="mt-8 grid gap-3 text-sm">
                  {quickLinks.map((item) => (
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

        <section className="space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-50">All your tools, aligned</h2>
              <p className="mt-2 max-w-2xl text-base text-slate-400">
                Navigate effortlessly between research, live ops, and documentation. Each module is meticulously crafted to
                surface the details spotters rely on most.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              See membership benefits
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 shadow-xl shadow-black/20 transition hover:border-sky-400/40 hover:bg-slate-900/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-2xl" aria-hidden>
                    {section.icon}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition group-hover:border-sky-500/40 group-hover:text-sky-200">
                    Explore
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-100">{section.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{section.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition group-hover:text-sky-200">
                  Open module
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-2xl shadow-slate-950/50 backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-50">Flight-tested by spotters worldwide</h2>
              <p className="text-base text-slate-400">
                We work hand-in-hand with aviation photographers, ATC veterans, and community moderators to keep every
                dataset current. Enjoy trusted data, thoughtful design, and a platform that evolves with your missions.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
                <strong className="block text-slate-100">Community curated</strong>
                Contributions are reviewed by a panel of verified spotters and controllers before landing in the app.
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <strong className="block text-slate-100">Always in sync</strong>
                Live data sources refresh every 60 seconds with graceful fallbacks for offline sessions.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
