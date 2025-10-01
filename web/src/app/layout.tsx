import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plane Spotter – Aviation Intelligence for Enthusiasts",
  description:
    "Discover airports, frequencies, maps, and live aircraft data with Plane Spotter, the all-in-one companion for aviation enthusiasts.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Plane Spotter",
    description:
      "Explore airports, frequencies, and live traffic with an elegant, data-rich experience tailored for aviation enthusiasts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
