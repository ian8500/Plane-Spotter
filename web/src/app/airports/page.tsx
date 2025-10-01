import { apiGet } from "@/lib/api";
import Link from "next/link";

type Airport = {
  id: number;
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

export default async function AirportsPage() {
  const airports: Airport[] = await apiGet<Airport[]>("/airports/");

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Airports</h1>
      <ul className="space-y-4">
        {airports.map((a) => (
          <li
            key={a.id}
            className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
          >
            <Link href={`/airports/${a.id}`}>
              <div className="font-semibold text-lg">
                {a.icao} — {a.name}
              </div>
              <div className="text-gray-600">{a.city}, {a.country}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
