import Link from "next/link";

const iconClasses = "h-12 w-12 rounded-full bg-slate-900/60 border border-white/10 flex items-center justify-center text-sky-400";

const PlaneIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 13.5 2 11.5 12 4l4 6 6 2-7.5 4.5L12 20l-1-5-7.25-1.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MapIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m8.5 4.5-5 2v13l5-2 7 2 5-2v-13l-5 2-7-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8.5 4.5v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15.5 6.5v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WavesIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9c1.25-1.333 2.75-2 4.5-2S13.75 7.667 15 9m-9 6c1.25-1.333 2.75-2 4.5-2s3.25.667 4.5 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 5c2-1.333 4-2 6-2s4 .667 6 2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 19c2-1.333 4-2 6-2s4 .667 6 2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CompassIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="m15.5 8.5-2 5-5 2 2-5 5-2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CommunityIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M16.5 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4 18.5c.75-2.667 2.75-4 6-4s5.25 1.333 6 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M18 18.5c-.333-1.333-1.333-2.333-3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const LogIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4h9.5a2.5 2.5 0 0 1 0 5H6V4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 9h9.5a2.5 2.5 0 0 1 0 5H6V9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M6 14h9.5a2.5 2.5 0 1 1 0 5H6v-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const sections = [
  {
    title: "Airports",
    description: "Browse detailed airfield intel, photography vantage points, and arrival notes.",
    href: "/airports",
    Icon: PlaneIcon,
    accent: "from-sky-500/30 via-cyan-400/20 to-sky-900/40",
  },
  {
    title: "Frequencies",
    description: "Stay tuned with verified tower, ground, ATIS, and emergency channels.",
    href: "/frequencies",
    Icon: WavesIcon,
    accent: "from-purple-500/30 via-slate-900/40 to-indigo-900/40",
  },
  {
    title: "Maps",
    description: "Navigate like a pro with live geolocation overlays and annotated taxi charts.",
    href: "/maps",
    Icon: MapIcon,
    accent: "from-emerald-500/30 via-teal-400/10 to-slate-900/40",
  },
  {
    title: "Live ADS-B",
    description: "Track real-time traffic with high-fidelity filters for altitude, speed, and type.",
    href: "/live",
    Icon: CompassIcon,
    accent: "from-orange-500/30 via-amber-400/10 to-slate-900/40",
  },
  {
    title: "Logbook",
    description: "Capture every sighting, attach media, and build your aviation story automatically.",
    href: "/logbook",
    Icon: LogIcon,
    accent: "from-pink-500/30 via-rose-400/10 to-slate-900/40",
  },
  {
    title: "Community",
    description: "Connect with spotters worldwide, share tips, and unlock achievement badges.",
    href: "/community",
    Icon: CommunityIcon,
    accent: "from-blue-500/30 via-slate-900/40 to-cyan-900/40",
  },
];

const highlights = [
  { label: "Global Airports", value: "2,450+" },
  { label: "Verified Frequencies", value: "8,900" },
  { label: "Community Reports", value: "31k" },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        <div className="absolute -left-1/4 top-1/3 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute -right-1/4 top-1/4 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-16 pt-10 md:px-12">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sky-400">
              ✈️
            </span>
            Plane Spotter
          </Link>

          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <Link className="transition hover:text-white" href="/airports">
              Airports
            </Link>
            <Link className="transition hover:text-white" href="/frequencies">
              Frequencies
            </Link>
            <Link className="transition hover:text-white" href="/maps">
              Maps
            </Link>
            <Link className="transition hover:text-white" href="/login">
              Sign in
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 grid-cols-1 items-center gap-12 py-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-200">
              Aviation Intelligence
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                The command center for passionate plane spotters
              </h1>
              <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                Plane Spotter brings together real-time ADS-B, curated airport guides, and a global community
                so you can plan the perfect outing, capture every sighting, and share your discoveries in
                style.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/maps"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
              >
                Launch Live Map
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14" strokeLinecap="round" />
                  <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/logbook"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Explore Logbook
              </Link>
            </div>

            <dl className="grid gap-6 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <dt className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative flex h-full items-center justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-white">Radar Snapshot</span>
                <span>Updated 2 mins ago</span>
              </div>
              <div className="space-y-4">
                {["Approach Queue", "Runway Lights", "Visibility", "Wind Check"].map((label, index) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-slate-400">
                        {index === 0 && "5 aircraft inbound · RWY 27"}
                        {index === 1 && "ILS status nominal"}
                        {index === 2 && "14 km · high ceiling"}
                        {index === 3 && "220° · 8 knots"}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-sky-300">LIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sections.map(({ title, description, href, Icon, accent }) => (
            <Link
              key={title}
              href={href}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${accent} p-6 transition duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-sky-500/10`}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 flex h-full flex-col gap-4">
                <span className={iconClasses}>
                  <Icon />
                </span>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">{title}</h2>
                  <p className="text-sm leading-relaxed text-slate-200/80">{description}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition group-hover:text-white">
                  Enter {title}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14" strokeLinecap="round" />
                    <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 py-8 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-slate-400 md:flex-row md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Plane Spotter. Crafted for aviation enthusiasts worldwide.</p>
          <div className="flex items-center gap-4">
            <Link className="transition hover:text-white" href="/about">
              About
            </Link>
            <Link className="transition hover:text-white" href="/community">
              Community
            </Link>
            <Link className="transition hover:text-white" href="/login">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
