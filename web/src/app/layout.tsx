import type { Metadata } from "next";
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
  title: "Plane Spotter · Aviation Intelligence for Enthusiasts",
  description:
    "Discover airports, live frequencies, immersive maps, and tracking tools crafted for passionate plane spotters.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Plane Spotter",
    description:
      "Explore airports, monitor frequencies, and follow live traffic with a premium experience tailored to aviation enthusiasts.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plane Spotter",
    description: "Your command center for airports, frequencies, maps, and live aircraft tracking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-100 selection:bg-sky-500/40 selection:text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
