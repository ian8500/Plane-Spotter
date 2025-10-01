"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "plane-spotter/logbook-seen";

export function useSeenAircraft() {
  const [seenIds, setSeenIds] = useState<Set<number>>(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        setSeenIds(new Set(parsed));
      } catch (error) {
        console.warn("Unable to parse spotting log storage", error);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(seenIds.values())),
    );
  }, [ready, seenIds]);

  const toggleSeen = (id: number) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return {
    seenIds,
    ready,
    toggleSeen,
  };
}

export function isAircraftSeen(seenIds: Set<number>, aircraftId: number) {
  return seenIds.has(aircraftId);
}
