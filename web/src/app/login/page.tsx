"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function MapsPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // 🗺️ nicer basemap
      center: [-0.4543, 51.4700], // Heathrow
      zoom: 9,
    });

    return () => map.remove();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Maps</h1>
      <div ref={mapRef} className="w-full h-[600px] rounded-xl border shadow" />
    </main>
  );
}
