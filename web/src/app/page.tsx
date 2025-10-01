import Link from "next/link";

type NavigationTarget = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly badge: string;
};

type Metric = {
  readonly label: string;
  readonly value: string;
  readonly caption: string;
};

type TimelineEvent = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
};

const navigationTargets: NavigationTarget[] = [
  {
    title: "Airports",
    description: "Pinpoint vantage points, runway intel, and community photos before you head to the field.",
    href: "/airports",
    badge: "Field guide",
  },
  {
    title: "Frequencies",
    description: "Tower, ground, ATIS, and guard updates with version history you can trust.",
    href: "/frequencies",
    badge: "Live ATC",
  },
  {
    title: "Maps",
    description: "Responsive airport diagrams layered with sun paths and traffic flow overlays.",
    href: "/maps",
    badge: "Situational",
  },
  {
    title: "Live ADS-B",
    description: "Track aircraft in real time, filter by fleet, and share sessions with teammates.",
    href: "/live",
    badge: "Ops feed",
  },
  {
    title: "Logbook",
    description: "Archive every sighting with EXIF sync, weather snapshots, and export-ready PDFs.",
    href: "/logbook",
    badge: "Records",
  },
  {
    title: "Community",
    description: "Collaborate with spotters worldwide, schedule meets, and swap mission-ready intel.",
    href: "/community",
    badge: "Network",
  },
];

const missionMetrics: Metric[] = [
  {
    label: "Airports profiled",
    value: "128",
    caption: "Actively curated with local insights",
  },
  {
    label: "Verified frequencies",
    value: "412",
    caption: "Validated by controllers & spotters",
  },
  {
    label: "Community intel drops",
    value: "5.2k",
    caption: "Weekly contributions from the crew",
  },
];

const missionTimeline: TimelineEvent[] = [
  {
    id: "01",
    title: "Plan the sortie",
    detail: "Build a briefing with weather windows, fleet alerts, and custom shot lists for every location.",
  },
  {
    id: "02",
    title: "Execute with confidence",
    detail: "Layer live ADS-B tracks with airport diagrams and real-time frequency monitoring.",
  },
  {
    id: "03",
    title: "Debrief & share",
    detail: "Sync your logbook, export mission reports, and share highlights with your squadron.",
  },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.32),transparent_58%)]"
        aria-hidden
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 lg:px-10 lg:py-24">
        <header className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/80 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]">
              Mission ready toolkit
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                Professional-grade tools for the art of plane spotting
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                Plane Spotter unifies airport intelligence, live operations data, and collaborative planning into a singular
                command center. Every sortie begins with clarity and ends with a polished story.
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
                  <p className="mt-1 text-xs text-slate-400">{metric.caption}</p>
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
                  {missionTimeline.map((event) => (
                    <li key={event.id} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                        {event.id}
                      </span>
                      <div>
                        <p className="font-medium text-slate-100">{event.title}</p>
                        <p className="text-slate-400">{event.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 grid gap-3 text-sm">
                  <Link
                    href="/maps"
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-sky-200"
                  >
                    View tactical map
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-sky-200"
                  >
                    Join the community
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </header>

        <section className="space-y-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-slate-50">Modular systems engineered for clarity</h2>
              <p className="max-w-2xl text-base text-slate-400">
                Navigate between research, live operations, and archiving with a consistent visual language. Every module is
                crafted to elevate situational awareness and visual storytelling.
              </p>
            </div>
            <Link
              href="/docs/roadmap"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/40 hover:text-sky-200"
            >
              Explore the roadmap
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {navigationTargets.map((target) => (
              <Link
                key={target.title}
                href={target.href}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-white/5 bg-white/[0.035] p-6 text-left shadow-[0_20px_60px_-35px_rgba(14,116,144,0.8)] transition hover:-translate-y-1 hover:border-sky-400/60 hover:shadow-[0_30px_80px_-45px_rgba(56,189,248,0.75)]"
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
                  {target.badge}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-50 group-hover:text-sky-200">{target.title}</h3>
                  <p className="text-sm text-slate-400">{target.description}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition group-hover:text-sky-200">
                  Enter module
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-3xl border border-white/5 bg-white/[0.025] p-8 shadow-[0_30px_80px_-45px_rgba(8,47,73,0.75)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-slate-50">Why spotters rely on Plane Spotter</h2>
            <p className="text-base text-slate-400">
              Built with professionals and passionate hobbyists alike, the platform marries curated intelligence with the
              responsiveness of live data feeds. Every pixel is tuned for legibility under harsh sunlight and quick glances.
            </p>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden />
                Precision typography and spacing optimized for rapid scanning in the field.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
                Harmonized dark palette that minimizes glare while keeping focus on the content.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden />
                Modular layout ready to scale across airports, fleets, events, and community initiatives.
              </li>
            </ul>
          </div>
          <div className="grid gap-4 text-sm text-slate-200">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/40">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Crew brief</p>
              <p className="mt-3 text-lg font-semibold text-slate-50">
                “The live ops dashboard feels like bringing the tower into my backpack. Everything I need is a glance away.”
              </p>
              <p className="mt-4 text-xs text-slate-400">— Jenna, long-lens aviation photographer</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-inner shadow-black/40">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Product update</p>
              <p className="mt-3 text-lg font-semibold text-slate-50">
                Expedition planning now supports collaborative schedules, allowing teams to sync waypoints and shot targets.
              </p>
              <Link
                href="/docs/changelog"
                className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-sky-200 transition hover:text-sky-100"
              >
                Read changelog
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Plane Spotter. Built for the global spotting community.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="transition hover:text-sky-200">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-sky-200">
              Terms
            </Link>
            <Link href="/login" className="transition hover:text-sky-200">
              Access the app
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
