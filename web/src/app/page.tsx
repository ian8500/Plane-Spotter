import Link from "next/link";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  badge?: string;
};

const navLinks = [
  { label: "Airports", href: "/airports" },
  { label: "Live Map", href: "/live" },
  { label: "Frequencies", href: "/frequencies" },
  { label: "Logbook", href: "/logbook" },
];

const features: Feature[] = [
  {
    title: "Airports",
    description: "Curated spotting guides with runway views, facilities, and photography notes at a glance.",
    href: "/airports",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        className="h-6 w-6 text-cyan-300"
      >
        <path
          d="M3 18h18M6 18l2.8-7.5a1 1 0 0 1 .94-.67h4.52a1 1 0 0 1 .95.69L18 18M9.5 9l1.4-4.2a1 1 0 0 1 1.9 0L14.2 9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Frequencies",
    description: "Tower, ground, ATIS and approach schedules formatted for quick access on the apron.",
    href: "/frequencies",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        className="h-6 w-6 text-cyan-300"
      >
        <path
          d="M7.5 7.5a6 6 0 0 1 0 9M4 4a9.5 9.5 0 0 1 0 16M16.5 7v10M16.5 17h1a2.5 2.5 0 0 0 0-5h-1V7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Maps",
    description: "High-resolution airfield layouts with live layers for stands, taxiways, and lighting.",
    href: "/maps",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        className="h-6 w-6 text-cyan-300"
      >
        <path
          d="M4 7.5 10 4l4 3.5 6-3.5v13L14 21l-4-3.5-6 3.5zM10 4v13M14 7.5v13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    badge: "Live layers",
  },
  {
    title: "Live ADS-B",
    description: "Follow traffic in real time with smooth trails, aircraft cards, and altitude filtering.",
    href: "/live",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        className="h-6 w-6 text-cyan-300"
      >
        <path
          d="M5 12a7 7 0 1 1 14 0 7 7 0 0 1-14 0Zm7-3v3l2 2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 12h-1M21.5 12h-1M12 3.5v-1M12 21.5v-1"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Logbook",
    description: "Build a photographic log of your sightings with weather, reg, and equipment metadata.",
    href: "/logbook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        className="h-6 w-6 text-cyan-300"
      >
        <path
          d="M6 4h9a3 3 0 0 1 3 3v13l-4.5-2-4.5 2V7a3 3 0 0 0-3-3Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 4a3 3 0 0 0-3 3v13l4.5-2 4.5 2" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Community",
    description: "Coordinate meets, share alerts, and earn badges with other spotters worldwide.",
    href: "/community",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        className="h-6 w-6 text-cyan-300"
      >
        <path
          d="M7.5 10.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm-9 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm9 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7.5 13.5v2M16.5 13.5v2M10.5 7.5h3M10.5 16.5h3" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
    badge: "New",
  },
];

const stats = [
  { label: "Airports mapped", value: "126" },
  { label: "Live receivers", value: "48" },
  { label: "Spotters online", value: "312" },
];

const plannerHighlights = [
  "Precision runway overlays with METAR updates",
  "Personalised watchlists synced across devices",
  "Smart notifications when rare liveries appear",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 -z-20">
        <div className="absolute left-[-10%] top-64 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-8%] top-32 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(148,163,184,0.06)_0%,transparent_40%,rgba(15,118,110,0.08)_100%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-24 lg:px-8 lg:pt-28">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-cyan-500/15">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="none"
                  strokeWidth="1.8"
                  className="h-7 w-7 text-cyan-200"
                >
                  <path
                    d="M3 17.5 16 12l13 5.5M16 12v8.5M10 29l6-8.5 6 8.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute inset-0 rounded-2xl border border-cyan-400/20" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
                  Plane Spotter
                </p>
                <p className="text-lg font-medium text-slate-100 sm:text-xl">
                  Aviation intelligence for passionate spotters
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2 text-sm text-slate-300">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <path
                        d="M7.5 5.5h7v7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M7 13 14.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200/90">
                Built for airside agility
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                Everything you need to plan, track, and capture every spotting moment.
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                Plane Spotter brings together live ADS-B feeds, meticulously curated airport intelligence,
                and collaborative tools so you always know where to be when something special is inbound.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/live"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_40px_-20px_rgba(6,182,212,0.95)] transition hover:scale-[1.02]"
              >
                Launch live radar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="ml-2 h-4 w-4 text-slate-900"
                >
                  <path
                    d="M5 10h10M10 5l5 5-5 5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/logbook"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
              >
                Explore your logbook
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                  <p className="text-3xl font-semibold text-slate-50">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/40 p-8 backdrop-blur-2xl">
            <div className="absolute -top-20 right-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                  Spotting planner
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  Prioritise what matters before the wheels touch down.
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  Bring your location, camera gear, and aircraft alerts into one synchronised workspace.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                {plannerHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <span className="mt-0.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, index) => (
                    <span
                      key={index}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[0.65rem] font-semibold text-cyan-100"
                    >
                      PS{index + 1}
                    </span>
                  ))}
                </div>
                Trusted by global spotter collectives
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-35px_rgba(15,118,110,0.8)] backdrop-blur-xl transition duration-300 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-[0_28px_80px_-40px_rgba(6,182,212,0.9)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
                {feature.icon}
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-50">{feature.title}</h2>
                  {feature.badge ? (
                    <span className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                      {feature.badge}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </div>
              <span className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                Discover more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M5 10h10M10 5l5 5-5 5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          ))}
        </section>

        <footer className="flex flex-col gap-4 border-t border-white/10 pt-10 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Plane Spotter. Crafted for aviation enthusiasts worldwide.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="transition hover:text-cyan-200">
              Sign in
            </Link>
            <Link href="/maps" className="transition hover:text-cyan-200">
              Airfield maps
            </Link>
            <Link href="/community" className="transition hover:text-cyan-200">
              Community
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
