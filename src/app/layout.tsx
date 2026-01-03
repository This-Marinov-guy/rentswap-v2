import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import StructuredData from "@/components/StructuredData";
import Clarity from "@/components/Clarity";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rentswap.nl"),
  title: {
    default: "RentSwap - Find your next home without the competition",
    template: "%s | RentSwap",
  },
  description: "Connect with tenants who are moving out and secure your perfect rental home in the Netherlands. No competition, fair algorithm, success-based pricing. Find apartments in Amsterdam, Rotterdam, The Hague, Utrecht, and more.",
  keywords: [
    "rent swap",
    "rental swap",
    "apartment swap",
    "housing swap",
    "Netherlands housing",
    "Amsterdam rental",
    "Rotterdam apartment",
    "The Hague housing",
    "Utrecht rental",
    "rental home",
    "apartment finder",
    "housing Netherlands",
    "rental property",
    "tenant swap",
    "housing exchange",
    "rental market Netherlands",
    "apartment search",
    "housing platform",
    "rental swap platform",
    "no competition rental",
    "fair rental algorithm",
    "success-based pricing",
    "rental application",
    "housing tips",
    "Netherlands real estate",
  ],
  authors: [{ name: "RentSwap" }],
  creator: "RentSwap",
  publisher: "RentSwap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  themeColor: "#fa3c4c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RentSwap",
  },
  alternates: {
    canonical: "https://rentswap.nl",
    languages: {
      "en-US": "https://rentswap.nl",
      "nl-NL": "https://rentswap.nl",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rentswap.nl",
    siteName: "RentSwap",
    title: "RentSwap - Find your next home without the competition",
    description: "Connect with tenants who are moving out and secure your perfect rental home in the Netherlands. No competition, fair algorithm, success-based pricing.",
    images: [
      {
        url: "https://rentswap.nl/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "RentSwap Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentSwap - Find your next home without the competition",
    description: "Connect with tenants who are moving out and secure your perfect rental home in the Netherlands.",
    images: [
      {
        url: "https://rentswap.nl/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "RentSwap - Find your next home without the competition",
      },
    ],
    creator: "@rentswap",
    site: "@rentswap",
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
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "Real Estate",
  classification: "Housing Platform",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
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
        <StructuredData />
        <Clarity />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

