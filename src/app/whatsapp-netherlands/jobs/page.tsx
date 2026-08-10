import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../page.module.css";
import JsonLd from "@/components/JsonLd";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Jobs WhatsApp Groups in the Netherlands",
  description:
    "Find WhatsApp groups for part-time, flexible, and student jobs in Amsterdam, Rotterdam, Utrecht, Groningen, and other Dutch cities.",
  path: "/whatsapp-netherlands/jobs",
});

interface WhatsAppGroup {
  name: string;
  link: string;
  city: string;
}

const whatsappGroups: WhatsAppGroup[] = [
  {
    name: "Amsterdam Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/IRtFvMMhXNoEBbZkuEXNHc",
    city: "Amsterdam",
  },
  {
    name: "Groningen Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/E4H3tXk83sw1TSr5DxwqIR",
    city: "Groningen",
  },
  {
    name: "Eindhoven Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/KA5lQzizNljIi0ebBIQosg",
    city: "Eindhoven",
  },
  {
    name: "Rotterdam Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/IbO302dwcRAI5bhj7oQh7c",
    city: "Rotterdam",
  },
  {
    name: "The Hague Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/IyTk89nEwPSHxyRBWHb4Zx",
    city: "The Hague",
  },
  {
    name: "Leeuwarden Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/GmraUa8MJRHLbig4TwV4q3",
    city: "Leeuwarden",
  },
  {
    name: "Enschede Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/IGT4qR03DIH7jovynbBh7R",
    city: "Enschede",
  },
  {
    name: "Breda Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/FSH6aP38khRCtVHVCRRJ5T",
    city: "Breda",
  },
  {
    name: "Haarlem Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/KldyvmZoalTGOHLMVyYvpv",
    city: "Haarlem",
  },
  {
    name: "Leiden Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/C1QcQmsBplC368xSIhK7aJ",
    city: "Leiden",
  },
  {
    name: "Nijmegen Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/HlskvVOug4i9jyMYrXOVvR",
    city: "Nijmegen",
  },
  {
    name: "Tilburg Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/GXfeRdDZFXS5q0W4shRraJ",
    city: "Tilburg",
  },
  {
    name: "Utrecht Jobs Chat | RentSwap",
    link: "https://chat.whatsapp.com/EImpAv7tGXlECh7TET5C91",
    city: "Utrecht",
  },
  {
    name: "Join this group if you are a scammer, bot or a spammer",
    link: "https://chat.whatsapp.com/J6bFxapc3IdLWYy0XbiV0F",
    city: "Netherlands",
  },
];

const jobsPageUrl = `${SITE_URL}/whatsapp-netherlands/jobs`;
const jobsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${jobsPageUrl}#webpage`,
      url: jobsPageUrl,
      name: "Jobs WhatsApp Groups in the Netherlands",
      description:
        "City-based WhatsApp communities for people searching for flexible and part-time jobs in the Netherlands.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${jobsPageUrl}#groups` },
    },
    {
      "@type": "ItemList",
      "@id": `${jobsPageUrl}#groups`,
      name: "Jobs WhatsApp groups by city",
      numberOfItems: whatsappGroups.length,
      itemListElement: whatsappGroups.map((group, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: group.name,
        url: group.link,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Jobs WhatsApp Groups",
          item: jobsPageUrl,
        },
      ],
    },
  ],
};

export default function JobsWhatsAppGroupsPage() {
  return (
    <>
      <Header />
      <JsonLd data={jobsPageSchema} />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Jobs WhatsApp Groups in the Netherlands {new Date().getFullYear()}
            </h1>
          </div>

          <div className={styles.intro}>
            <p>
              Looking for part-time or flexible work? RentSwap created a list of
              WhatsApp groups where job seekers can share opportunities and
              local advice across the Netherlands.
            </p>
            <p>
              If you know other groups we missed,{" "}
              <a href="mailto:info@rentswap.nl">reach out</a>!
            </p>
          </div>

          <section
            className={styles.crossPromoBanner}
            aria-label="Housing WhatsApp groups"
          >
            <h2 className={styles.crossPromoTitle}>
              Looking for housing in the Netherlands?
            </h2>
            <p className={styles.crossPromoSubtitle}>
              Join city-based WhatsApp groups for housing listings and advice.
            </p>
            <Link
              href="/whatsapp-netherlands/housing"
              className={styles.crossPromoLink}
            >
              View Housing WhatsApp Groups
            </Link>
          </section>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <caption className={styles.tableCaption}>
                Jobs WhatsApp groups by city
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={styles.tableHeader}>Group Name</th>
                  <th scope="col" className={styles.tableHeader}>Joining Link</th>
                  <th scope="col" className={styles.tableHeader}>City</th>
                </tr>
              </thead>
              <tbody>
                {whatsappGroups.map((group) => (
                  <tr key={group.link} className={styles.tableRow}>
                    <td className={styles.tableCell}>{group.name}</td>
                    <td className={styles.tableCell}>
                      <a
                        href={group.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                        aria-label={`Join ${group.name}`}
                      >
                        Join Group
                      </a>
                    </td>
                    <td className={styles.tableCell}>{group.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className={styles.seoContent}>
            <h2>How to use jobs WhatsApp groups safely</h2>
            <p>
              These city groups can help you discover flexible, part-time, and
              student work. Before sharing personal information, verify the company,
              role, location, working hours, and pay directly with the employer.
            </p>
            <ul>
              <li>Legitimate employers should not charge you an application fee.</li>
              <li>Confirm the company and recruiter through an official website.</li>
              <li>Do not share banking or identity documents in a public group.</li>
            </ul>
            <p>
              Moving for work or study? Browse our{" "}
              <Link href="/whatsapp-netherlands/housing">
                housing WhatsApp groups in the Netherlands
              </Link>{" "}
              to connect with local housing communities.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
