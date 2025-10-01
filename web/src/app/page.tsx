import Link from "next/link";

export default function Home() {
  const sections = [
    { title: "Airports", description: "Spotting locations, reviews & photos", href: "/airports" },
    { title: "Frequencies", description: "Tower, Ground, ATIS & more", href: "/frequencies" },
    { title: "Maps", description: "Airfield maps & your location", href: "/maps" },
    { title: "Live ADS-B", description: "Track live aircraft nearby", href: "/live" },
    { title: "Logbook", description: "Record aircraft you’ve spotted", href: "/logbook" },
    { title: "Community", description: "Forum, chat & badges", href: "/community" },
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Plane Spotter</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Your complete plane spotting companion — explore airports, check frequencies, 
        log aircraft, and connect with the spotting community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {sections.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h2>
            <p className="text-gray-600">{s.description}</p>
          </Link>
        ))}
      </div>

      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Plane Spotter · Built with Next.js & Tailwind
      </footer>
    </main>
  );
}
