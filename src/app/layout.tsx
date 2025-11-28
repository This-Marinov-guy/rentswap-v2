import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "RentSwap - Find your next home without the competition",
  description: "Connect with tenants who are moving out and secure your perfect rental home in the Netherlands. No competition, fair algorithm, success-based pricing.",
  keywords: "rent, apartment, housing, Netherlands, Amsterdam, Rotterdam, The Hague, Utrecht, rental, tenant",
  openGraph: {
    title: "RentSwap - Find your next home without the competition",
    description: "Connect with tenants who are moving out and secure your perfect rental home",
    url: "https://rentswap.nl",
    siteName: "RentSwap",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentSwap - Find your next home without the competition",
    description: "Connect with tenants who are moving out and secure your perfect rental home",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ paddingTop: '72px' }}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

