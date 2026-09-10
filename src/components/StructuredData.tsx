import JsonLd from "./JsonLd";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.rentswap.nl/#organization",
        name: "RentSwap",
        url: "https://www.rentswap.nl",
        logo: {
          "@type": "ImageObject",
          url: "https://www.rentswap.nl/android-chrome-512x512.png",
          width: 512,
          height: 512,
        },
        description:
          "RentSwap helps tenants find rental homes in the Netherlands without the traditional application race.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          email: "info@rentswap.nl",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://www.rentswap.nl/#website",
        name: "RentSwap",
        url: "https://www.rentswap.nl",
        description:
          "Find rental homes, roommates, and housing resources across the Netherlands.",
        publisher: {
          "@id": "https://www.rentswap.nl/#organization",
        },
      },
    ],
  };

  return <JsonLd data={schema} />;
}
