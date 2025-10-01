import { PageWrapper } from "@/app/components/page-wrapper";
import Link from "next/link";

const methodology = [
  {
    title: "Tower Operations",
    description:
      "Tower controllers manage aircraft in the immediate vicinity of the airport—typically the runway and traffic pattern. They issue takeoff and landing clearances, sequencing departures and arrivals to maintain safe separation.",
  },
  {
    title: "Ground Control",
    description:
      "Ground handles aircraft and vehicles on taxiways and ramps. Controllers provide taxi clearances, monitor surface movement, and ensure conflicts are avoided before aircraft reach the runway.",
  },
  {
    title: "Approach & Departure",
    description:
      "Approach and departure controllers transition aircraft between en-route airspace and the terminal area. They coordinate climbs, descents, and vectors to efficiently sequence flights around congested airspace.",
  },
  {
    title: "Center / En-Route",
    description:
      "Air Route Traffic Control Centers (ARTCCs) oversee aircraft cruising between airports. They manage large sectors of airspace, coordinating altitude changes and hand-offs between adjacent sectors and facilities.",
  },
];

const exchanges = [
  {
    call: "ATIS",
    meaning:
      "Automatic Terminal Information Service broadcasts current weather, runways in use, and airport notices. Pilots state the letter code (e.g., 'Information Bravo') to confirm receipt when contacting controllers.",
  },
  {
    call: "Clearance Delivery",
    meaning:
      "Provides instrument flight rules (IFR) route clearance before taxi. Typical read-back includes the cleared route, initial altitude, departure frequency, and transponder code.",
  },
  {
    call: "Taxi / Ground",
    meaning:
      "Ground control gives taxi instructions such as 'Taxi to Runway 27 via Alpha, hold short Runway 22'. Pilots must read back hold short instructions and runway assignments to confirm compliance.",
  },
  {
    call: "Takeoff Clearance",
    meaning:
      "When tower issues 'Cleared for takeoff', the aircraft may enter the runway and depart. Pilots read back the clearance to acknowledge and begin the roll when safe.",
  },
  {
    call: "Landing Clearance",
    meaning:
      "Tower communicates 'Cleared to land' once the runway is verified clear. Pilots acknowledge and continue final approach, reporting if unable or executing a go-around as necessary.",
  },
  {
    call: "Handoff / Frequency Change",
    meaning:
      "Controllers coordinate handoffs between facilities. A call like 'Contact Departure on 118.5' prompts pilots to switch frequencies, check in, and continue on the new controller's instructions.",
  },
];

export default function FrequenciesPage() {
  return (
    <PageWrapper className="space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white">ATC Communication Guide</h1>
        <p className="mx-auto max-w-2xl text-base text-slate-300">
          Understand how Air Traffic Control orchestrates safe aircraft movement and what common radio telephony (RTF)
          calls mean before you tune in.
        </p>
      </header>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl shadow-cyan-500/5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">ATC Methodology</h2>
          <p className="text-sm text-slate-300">
            Controllers coordinate flights through a series of specialised positions. Each role focuses on a specific phase
            of flight, ensuring clear responsibilities and consistent separation standards.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {methodology.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl shadow-cyan-500/5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Decoding RTF Exchanges</h2>
          <p className="text-sm text-slate-300">
            Radio calls follow a predictable rhythm. Learning the intent behind each exchange helps you follow the story in
            real time and anticipate what comes next.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {exchanges.map((item) => (
            <article
              key={item.call}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold text-white">{item.call}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{item.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="text-center text-sm text-slate-300">
        <p>Looking for live audio? Check our curated frequency list and streaming resources.</p>
        <Link
          href="/maps"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
        >
          Explore Nearby Frequencies
        </Link>
      </section>
    </PageWrapper>
  );
}
