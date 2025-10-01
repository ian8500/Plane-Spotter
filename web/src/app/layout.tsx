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
  "A command center for aviation spotters blending airport dossiers, live operations data, and collaborative tooling.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Aviation intelligence for every mission`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "plane spotting",
    "aviation maps",
    "airport guides",
    "live atc",
    "ads-b",
    "spotting logbook",
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
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  category: "Aviation",
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
