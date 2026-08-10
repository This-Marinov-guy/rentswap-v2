import type { Metadata } from "next";

export const SITE_NAME = "RentSwap";
export const SITE_URL = "https://rentswap.nl";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/opengraph-image`;

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  socialTitle?: string;
  imageAlt?: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  socialTitle,
  imageAlt,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const resolvedSocialTitle = socialTitle ?? `${title} | ${SITE_NAME}`;
  const resolvedImageAlt = imageAlt ?? `${title} — ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: resolvedSocialTitle,
      description,
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: resolvedImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedSocialTitle,
      description,
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          alt: resolvedImageAlt,
        },
      ],
      creator: "@rentswap",
      site: "@rentswap",
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
