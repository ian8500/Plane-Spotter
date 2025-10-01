"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/airports", label: "Airports" },
  { href: "/live", label: "Live Map" },
  { href: "/frequencies", label: "Frequencies" },
  { href: "/maps", label: "Maps" },
  { href: "/logbook", label: "Logbook" },
  { href: "/forums", label: "Community" },
];

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((value) => !value);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white"
          onClick={closeMobile}
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-cyan-500/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="none"
              strokeWidth="1.8"
              className="h-6 w-6 text-cyan-200"
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
          Plane Spotter
        </Link>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-controls="site-nav"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav
          id="site-nav"
          className="hidden items-center gap-8 text-sm font-medium text-slate-200 lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-cyan-300 ${
                  active ? "text-cyan-300" : "text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200 shadow-sm transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
          >
            Login
          </Link>
        </nav>
      </div>

      <div
        className={`lg:hidden ${
          mobileOpen ? "max-h-96 border-t border-white/10" : "max-h-0 border-transparent"
        } overflow-hidden bg-slate-950/95 backdrop-blur-xl transition-[max-height] duration-300 ease-in-out`}
      >
        <div className="space-y-1 px-6 py-4 text-sm text-slate-200">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`block rounded-xl px-3 py-2 transition hover:bg-white/5 ${
                  active ? "bg-white/5 text-cyan-300" : "text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={closeMobile}
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
