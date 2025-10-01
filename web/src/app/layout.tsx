import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plane-spotter.app"),
  title: {
    default: "Plane Spotter — Aviation intelligence for every mission",
    template: "%s · Plane Spotter",
  },
  description:
    "Command every spotting sortie with curated airport dossiers, live frequencies, operational maps, and collaborative tools.",
  keywords: [
    "plane spotting",
    "airports",
    "aviation intelligence",
    "live atc",
    "ads-b",
    "photography planning",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Plane Spotter",
    description:
      "A premium toolkit for aviation enthusiasts featuring airport dossiers, live frequencies, immersive maps, and mission planning tools.",
    url: "https://plane-spotter.app",
    siteName: "Plane Spotter",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plane Spotter",
    description:
      "Premium planning, live data, and collaborative tools tailored for passionate aviation spotters.",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
