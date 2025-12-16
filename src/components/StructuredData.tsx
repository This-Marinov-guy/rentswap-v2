export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RentSwap",
    url: "https://rentswap.nl",
    logo: "https://rentswap.nl/android-chrome-512x512.png",
    description: "RentSwap helps tenants find and swap rental homes in the Netherlands without competition.",
    sameAs: [
      // Add your social media profiles here
      // "https://www.facebook.com/rentswap",
      // "https://www.twitter.com/rentswap",
      // "https://www.linkedin.com/company/rentswap",
      // "https://www.instagram.com/rentswap",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@rentswap.nl", // Update with your actual email
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentSwap",
    url: "https://rentswap.nl",
    description: "Find your next home without the competition. Connect with tenants who are moving out and secure your perfect rental home in the Netherlands.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://rentswap.nl/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Rental Housing Platform",
    provider: {
      "@type": "Organization",
      name: "RentSwap",
    },
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    description: "Rental home swapping and finding service in the Netherlands. Connect tenants looking to swap or find rental properties.",
    offers: {
      "@type": "Offer",
      description: "Success-based pricing - pay nothing unless you accept an offer",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rentswap.nl",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
