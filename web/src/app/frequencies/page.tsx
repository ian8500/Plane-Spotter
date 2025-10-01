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
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">ATC Communication Guide</h1>
          <p className="mt-4 text-lg text-slate-600">
            Understand how Air Traffic Control orchestrates safe aircraft movement and what
            common radio telephony (RTF) calls mean before you tune in.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-slate-900">ATC Methodology</h2>
          <p className="mt-2 text-slate-600">
            Controllers coordinate flights through a series of specialized positions. Each
            role focuses on a specific phase of flight, ensuring clear responsibilities and
            consistent separation standards.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {methodology.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-slate-900">Decoding RTF Exchanges</h2>
          <p className="mt-2 text-slate-600">
            Radio calls follow a predictable rhythm. Learning the intent behind each
            exchange helps you follow the story in real time and anticipate what comes next.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {exchanges.map((item) => (
              <article key={item.call} className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800">{item.call}</h3>
                <p className="mt-2 text-slate-600">{item.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="text-center text-sm text-slate-500">
          <p>
            Looking for live audio? Check our curated frequency list and streaming
            resources.
          </p>
          <Link
            href="/maps"
            className="mt-3 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            Explore Nearby Frequencies
          </Link>
        </section>
      </div>
    </main>
  );
}
