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

type Highlight = {
  readonly title: string;
  readonly detail: string;
};

type ChecklistItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
};

const navigationTargets: NavigationTarget[] = [
  {
    title: "Airports",
    description: "Curated vantage points, runway intel, and photo briefs for every sortie.",
    href: "/airports",
    badge: "Field guide",
  },
  {
    title: "Frequencies",
    description: "Tower, ground, ATIS, and guard channels with real-time change tracking.",
    href: "/frequencies",
    badge: "Live ATC",
  },
  {
    title: "Maps",
    description: "Adaptive airport diagrams layered with sun paths and traffic flow overlays.",
    href: "/maps",
    badge: "Situational",
  },
  {
    title: "Live ADS-B",
    description: "Precision filtering, fleet alerts, and shared sessions for every mission window.",
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
    description: "Coordinate meets, swap intel, and grow with spotters across the globe.",
    href: "/community",
    badge: "Network",
  },
];

const missionMetrics: Metric[] = [
  {
    label: "Airports profiled",
    value: "128",
    caption: "Curated with local vantage insights",
  },
  {
    label: "Verified frequencies",
    value: "412",
    caption: "Controller-confirmed updates in the last 90 days",
  },
  {
    label: "Community intel drops",
    value: "5.2k",
    caption: "Weekly contributions from the crew",
  },
];

const operationsHighlights: Highlight[] = [
  {
    title: "Strategic planning",
    detail: "Blend weather, fleet alerts, and regulatory notes into a single actionable briefing.",
  },
  {
    title: "Live execution",
    detail: "Sync live traffic, frequency monitoring, and custom watch lists to stay ahead of arrivals.",
  },
  {
    title: "Storytelling",
    detail: "Transform captured sessions into polished narratives ready for socials or sponsors.",
  },
];

const missionChecklist: ChecklistItem[] = [
  {
    id: "01",
    title: "Plan the sortie",
    description: "Stack airport dossiers, sun windows, and shot lists tailored to each field.",
  },
  {
    id: "02",
    title: "Execute with clarity",
    description: "Overlay ADS-B, weather, and comms to capture every pass with confidence.",
  },
  {
    id: "03",
    title: "Debrief & share",
    description: "Publish your logbook, export reports, and loop in the team for the next mission.",
  },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-[-25rem] -z-10 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.28),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-[-30%] -z-10 h-full w-[60%] bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.28),transparent_70%)]"
        aria-hidden
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16 lg:px-12 lg:py-24">
        <header className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="token-tag">Mission ready toolkit</span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                A professional cockpit for the art of plane spotting
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                Plane Spotter unifies airport intelligence, live operations data, and collaborative planning into one command
                surface. Launch every sortie with clarity and land with a story worth sharing.
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
                <div key={metric.label} className="glass-panel rounded-3xl p-5 shadow-inner shadow-black/40">
                  <dt className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">{metric.label}</dt>
                  <dd className="mt-3 text-3xl font-semibold text-slate-50">{metric.value}</dd>
                  <p className="mt-1 text-xs text-slate-400">{metric.caption}</p>
                </div>
              ))}
            </dl>
          </div>

          <aside className="relative">
            <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-sky-500/30 blur-3xl" aria-hidden />
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 shadow-2xl shadow-slate-950/45">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Mission checklist</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    A guided cadence to keep your crew aligned from scouting to debrief.
                  </p>
                </div>
                <ol className="space-y-4 text-sm text-slate-300">
                  {missionChecklist.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-sm font-medium text-sky-300">
                        {item.id}
                      </span>
                      <div>
                        <p className="font-medium text-slate-100">{item.title}</p>
                        <p className="text-slate-400">{item.description}</p>
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
                    href="/community"
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
                Navigate from research to live execution without changing languages. Each module is tuned to keep you oriented and
                in control when seconds count.
              </p>
            </div>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition hover:text-sky-200"
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
                className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40 hover:bg-slate-900/60"
              >
                <div className="space-y-4">
                  <span className="token-tag text-[0.7rem] tracking-[0.28em] text-sky-200/80">{target.badge}</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-100 transition group-hover:text-sky-100">{target.title}</h3>
                    <p className="text-sm text-slate-400">{target.description}</p>
                  </div>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition group-hover:text-sky-200">
                  Enter module
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold text-slate-50">Operations without guesswork</h2>
              <p className="max-w-2xl text-base text-slate-400">
                Whether you are working a local ramp or chasing a special movement, Plane Spotter keeps the signal high and the
                friction low.
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              {operationsHighlights.map((highlight) => (
                <div key={highlight.title} className="glass-panel rounded-3xl p-6">
                  <dt className="text-sm font-semibold text-slate-100">{highlight.title}</dt>
                  <dd className="mt-3 text-sm text-slate-400">{highlight.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent p-8 text-sm text-slate-300 shadow-2xl shadow-slate-950/40">
              <p>
                “The latest release finally lets our team prep and execute from the same dashboard. It feels like a tool built by
                spotters who understand the mission.”
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Operations lead, SkyTrack
                Collective</p>
            </div>
          </div>

          <div className="glass-panel space-y-6 rounded-[2rem] p-8 text-sm shadow-2xl shadow-slate-950/45">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Confidence from briefing to debrief</h2>
              <p className="mt-2 text-slate-400">
                Save personalized presets, synchronize with teammates, and surface the data that matters when the action starts.
              </p>
            </div>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-sky-400" aria-hidden />
                <div>
                  <p className="font-medium text-slate-100">Realtime collaboration</p>
                  <p className="text-slate-400">Shared mission boards, custom alerts, and synchronized timelines.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-emerald-400" aria-hidden />
                <div>
                  <p className="font-medium text-slate-100">Ground-truth data integrity</p>
                  <p className="text-slate-400">Every update is versioned with provenance so you trust every frequency and callout.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-amber-300" aria-hidden />
                <div>
                  <p className="font-medium text-slate-100">Offline friendly by design</p>
                  <p className="text-slate-400">Cache your dossiers and logbooks before you head to the perimeter fence.</p>
                </div>
              </li>
            </ul>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-slate-400">
              <p className="font-semibold uppercase tracking-[0.3em] text-slate-500">Next release</p>
              <p className="mt-2 text-slate-300">Immersive 3D runway visualizer and shared mission analytics land in Q4.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
