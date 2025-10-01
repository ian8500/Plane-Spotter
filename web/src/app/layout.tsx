import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteName = "Plane Spotter";
const siteUrl = "https://plane-spotter.app";
const siteDescription =
  "Mission-grade intelligence for aviation spotters featuring curated airport dossiers, live ops data, and collaborative planning tools.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Mission control for plane spotters`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "plane spotting",
    "aviation intelligence",
    "airport guides",
    "live atc",
    "ads-b",
    "spotting community",
  ],
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  category: "Aviation",
  alternates: { canonical: siteUrl },
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
