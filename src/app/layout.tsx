import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PanelWash - Maximize Solar Power | Professional Solar Panel Cleaning",
  description: "Dirty Panels = Lost Power. Restore your Suraj Ki Shakti with PanelWash. Premium solar cleaning services for residential, commercial, and industrial installations in India.",
  keywords: "solar panel cleaning, solar maintenance, commercial solar wash, residential solar cleaning, solar energy efficiency, PanelWash India",
  openGraph: {
    title: "PanelWash - Maximize Solar Power Generation",
    description: "Maximize your solar ROI. Clean panels absorb up to 30% more sunlight. Book your Saaf Clean today!",
    url: "https://panelwash.in",
    siteName: "PanelWash",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PanelWash Solar Panel Cleaning Services",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Schema Markup for Local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PanelWash",
              "image": "https://panelwash.in/logo.png",
              "@id": "https://panelwash.in",
              "url": "https://panelwash.in",
              "telephone": "+918349655888",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sohna Road, Sector 48",
                "addressLocality": "Gurugram",
                "addressRegion": "HR",
                "postalCode": "122018",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 28.4132,
                "longitude": 77.0420
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "07:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.facebook.com/panelwash",
                "https://www.instagram.com/panelwash"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased selection:bg-solar-yellow selection:text-solar-deep">
        {children}
      </body>
    </html>
  );
}
