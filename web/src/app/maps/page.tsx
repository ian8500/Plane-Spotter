"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { PageWrapper } from "@/app/components/page-wrapper";

export default function MapsPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json", // demo basemap
      center: [-0.4543, 51.47], // Heathrow
      zoom: 9,
    });

    return () => map.remove();
  }, []);

  return (
    <PageWrapper className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Maps</h1>
        <p className="text-sm text-slate-300">
          Layer airfield diagrams, ground movements, and sectional data to plan your spotting sessions with confidence.
        </p>
      </header>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl shadow-cyan-500/5">
        <div ref={mapRef} className="h-[600px] w-full" />
      </div>
    </PageWrapper>
  );
}
