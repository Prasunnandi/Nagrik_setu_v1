// app/layout.tsx

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'नागरिक सेतु | Nagrik Setu — India\'s Civic AI Agent',
  description: 'Hum sirf report nahi karte — hum fix karate hain. India\'s first autonomous civic accountability AI agent.',
  keywords: 'civic complaints India, municipal corporation, pothole, garbage, RTI, KMC, BBMP, MCGM, MCD',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Nagrik Setu — Civic AI Agent',
    description: 'File, track, verify and resolve civic complaints with AI',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nagrik Setu',
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E0600A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nagrik Setu" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Figtree:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Figtree', sans-serif" }} className="bg-[var(--ns-paper)] text-[var(--ns-ink)] antialiased">
        {children}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,visualization`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
