import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "./page.module.css";
import JsonLd from "@/components/JsonLd";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const housingMetadata = createPageMetadata({
  title: "WhatsApp Housing Groups in the Netherlands",
  description:
    "Find active WhatsApp housing groups for Amsterdam, Rotterdam, Utrecht, Groningen, Eindhoven, and other cities across the Netherlands.",
  path: "/whatsapp-netherlands/housing",
});

interface WhatsAppGroup {
  name: string;
  link: string;
  city: string;
}

const whatsappGroups: WhatsAppGroup[] = [
  {
    name: "Almere Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/GqN2wFL2sBN1qdnkoBNY1z",
    city: "Almere",
  },
  {
    name: "Amstelveen Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/BIekcT4fcJuBMAojBux7Nq",
    city: "Amstelveen",
  },
  // {
  //   name: "Amsterdam and more place of Netherlands Rooms, Studios, Flats, Apartments, Houses for rent... (FULL)",
  //   link: "https://chat.whatsapp.com/BbMxoqsgHNsEIYjYdSn75L",
  //   city: "Amsterdam",
  // },
  // {
  //   name: "Housing Amsterdam, Rotterdam and Den Haag All in one (FULL)",
  //   link: "https://chat.whatsapp.com/HDya5c9l63ZBSmdUQJL2A6",
  //   city: "Amsterdam",
  // },
  // {
  //   name: "amsterandom",
  //   link: "https://chat.whatsapp.com/DheUC0xKTxqHFlCOpZl8lg",
  //   city: "Amsterdam",
  // },
  {
    name: "Domakin Amsterdam Listings",
    link: "https://chat.whatsapp.com/GNUYUy5OjQvGp0bTjiuoWZ",
    city: "Amsterdam",
  },
  {
    name: "Amsterdam Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/FUVAtRisVaFIKeJf1VmGN8",
    city: "Amsterdam",
  },
  // {
  //   name: "NL Short Term Housing 1",
  //   link: "https://chat.whatsapp.com/GH0aplHIQ3rCeaF0dEmrsW",
  //   city: "Amsterdam/Rotterdam",
  // },
  // {
  //   name: "NL Short Term Housing 2",
  //   link: "https://chat.whatsapp.com/IGDxiZehfPZ7Ltz6MYBCmY",
  //   city: "Amsterdam/Rotterdam",
  // },
  // {
  //   name: "NL Long Term Housing 2",
  //   link: "https://chat.whatsapp.com/IGDxiZehfPZ7Ltz6MYBCmY",
  //   city: "Amsterdam/Rotterdam",
  // },
  // {
  //   name: "NL Long Term Housing 1",
  //   link: "https://chat.whatsapp.com/GH0aplHIQ3rCeaF0dEmrsW",
  //   city: "Amsterdam/Rotterdam",
  // },
  {
    name: "Arnhem Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/DzKbWx7Tu87GTI1XiHIVnk",
    city: "Arnhem",
  },
  {
    name: "Breda Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/JC5QFxSDzLHGBYIoTBrono",
    city: "Breda",
  },
  {
    name: "Domakin Breda Listings",
    link: "https://chat.whatsapp.com/DbYeHys5ESl9Po8qCZlzu1",
    city: "Breda",
  },
  {
    name: "Delft Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/CCNb2Bz0Gnd5TLSwFERC3W",
    city: "Delft",
  },
  {
    name: "Domakin Eindhoven Listings",
    link: "https://chat.whatsapp.com/D74nM3brJ6AFEutpWE5lyq",
    city: "Eindhoven",
  },
  {
    name: "Eindhoven Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/D9S939hdT1EJomWkgEEpLz",
    city: "Eindhoven",
  },
  // {
  //   name: "Housing Problems - check group info!",
  //   link: "https://chat.whatsapp.com/IZtK3OG7YkpBGwSv54Q2ox",
  //   city: "Eindhoven",
  // },
  {
    name: "Enschede Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/Elk3wlL3tiXLXdsfiOaRCs",
    city: "Enschede",
  },
  {
    name: "Groningen Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/JsezgTP32vtG8VV233yvwL",
    city: "Groningen",
  },
  {
    name: "Domakin Groningen Listings",
    link: "https://chat.whatsapp.com/CaOKFCiRXEj7hqdqozzvhJ",
    city: "Groningen",
  },
  {
    name: "Haarlem Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/IzFhnLyKBGPD2YvwGu4Ps2",
    city: "Haarlem",
  },
  {
    name: "Heerlen Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/D3J6vzHllbXBDrBfdmHD5f",
    city: "Heerlen",
  },
  {
    name: "Leeuwarden Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/FxjjXQE1XEKEb1BS6kXjZ7",
    city: "Leeuwarden",
  },
  // {
  //   name: "Room4sublet Leiden 2023 - 2024 🏡",
  //   link: "https://chat.whatsapp.com/K9sZ6GQUSBxF5SCvitFLsH",
  //   city: "Leiden",
  // },
  {
    name: "Leiden Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/GqRJMQqnoFQCoCrFY2hJmv",
    city: "Leiden",
  },
  {
    name: "Domakin Leiden & Den Haag",
    link: "https://chat.whatsapp.com/LBtK6olxoNn7aPHsHh3mOf",
    city: "Leiden & Den Haag",
  },
  {
    name: "Domakin Maastricht Listings",
    link: "https://chat.whatsapp.com/E1oWPXPbca760YuBQrIvYX",
    city: "Maastricht",
  },
  {
    name: "Maastricht Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/CiECsJ3bN4B4ixR9g9TBF6",
    city: "Maastricht",
  },
  {
    name: "Nijmegen Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/HNZApUVPVnUJa6uvV33ZGl",
    city: "Nijmegen",
  },
  {
    name: "Join this chat only if you are a bot or scammer | No Humans",
    link: "https://chat.whatsapp.com/J6bFxapc3IdLWYy0XbiV0F",
    city: "Netherlands",
  },
  // {
  //   name: "Rotterdam Internationals",
  //   link: "https://linktr.ee/InternationalsNL",
  //   city: "Rotterdam",
  // },
  {
    name: "Rotterdam Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/FDH6QC3CkgWDwpiU3tCjJG",
    city: "Rotterdam",
  },
  // {
  //   name: "Housing EUR 2022-2023 🏠",
  //   link: "https://chat.whatsapp.com/EY0kCO0otb25dHwm5poJL0w",
  //   city: "Rotterdam",
  // },
  // {
  //   name: "Shared flats Rdam",
  //   link: "https://chat.whatsapp.com/KYwY6GmoYTn7oW18JCuGA",
  //   city: "Rotterdam",
  // },
  {
    name: "Domakin Rotterdam Listings",
    link: "https://chat.whatsapp.com/KTlHSYxWNisJ3JiEIZZ65J",
    city: "Rotterdam",
  },
  // {
  //   name: "rotterdam house hunters",
  //   link: "https://chat.whatsapp.com/KO9bl8lGW16Ga745bWftH9",
  //   city: "Rotterdam",
  // },
  // {
  //   name: "Secondhand Rotterdam 2023",
  //   link: "https://chat.whatsapp.com/LcqSvEFtBcGEmvz7r8KBro",
  //   city: "Rotterdam",
  // },
  {
    name: "The Hague Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/KfNDW2RFdU88b2d5f83tgu",
    city: "The Hague",
  },
  {
    name: "Tilburg Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/H3C0aipkjqvBkXrujorHnb",
    city: "Tilburg",
  },
  // {
  //   name: "Houses, Apartments, Studios and Rooms in Utrecht, Eindhoven, Lelystad,Tilburg,Groningen and others 🏠",
  //   link: "https://chat.whatsapp.com/LwG2JnDtZvxBG3R1JZMQc2",
  //   city: "Utrecht",
  // },
  {
    name: "Utrecht Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/DDMsK5eXbwHBtJ7tOMCQBQ",
    city: "Utrecht",
  },
  {
    name: "Wageningen Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/Go2A010tGGW3KqkozmNfbq",
    city: "Wageningen",
  },
  {
    name: "Zwolle Housing Chat | RentSwap",
    link: "https://chat.whatsapp.com/I3bIhP4SpK08Be3EaqVpab",
    city: "Zwolle",
  },
];

const housingPageUrl = `${SITE_URL}/whatsapp-netherlands/housing`;
const housingPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${housingPageUrl}#webpage`,
      url: housingPageUrl,
      name: "WhatsApp Housing Groups in the Netherlands",
      description:
        "City-based WhatsApp communities for people searching for housing in the Netherlands.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${housingPageUrl}#groups` },
    },
    {
      "@type": "ItemList",
      "@id": `${housingPageUrl}#groups`,
      name: "Housing WhatsApp groups by city",
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
          name: "Housing WhatsApp Groups",
          item: housingPageUrl,
        },
      ],
    },
  ],
};

export default function HousingWhatsAppGroupsPage() {
  return (
    <>
      <Header />
      <JsonLd data={housingPageSchema} />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            {/* <div className={styles.date}>10 May 2025</div> */}
            <h1 className={styles.title}>
              WhatsApp Housing Groups in the Netherlands {new Date().getFullYear()}
            </h1>
          </div>

          <div className={styles.intro}>
            <p>
              Searching for a home is tough, but you don&apos;t have to do it alone.
              RentSwap created a list of WhatsApp groups to connect renters, share
              advice, and build a stronger housing community across the Netherlands.
            </p>
            <p>
              If you know other groups we missed,{" "}
              <a href="mailto:info@rentswap.nl">reach out</a>!
            </p>
          </div>

          <section className={styles.crossPromoBanner} aria-label="Jobs WhatsApp groups">
            <h2 className={styles.crossPromoTitle}>
              Looking for a part-time / flexible job in the Netherlands?
            </h2>
            <p className={styles.crossPromoSubtitle}>
              Join city-based WhatsApp groups for local job opportunities.
            </p>
            <Link
              href="/whatsapp-netherlands/jobs"
              className={styles.crossPromoLink}
            >
              View Jobs WhatsApp Groups
            </Link>
          </section>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <caption className={styles.tableCaption}>
                Housing WhatsApp groups by city
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
            <h2>How to use housing WhatsApp groups safely</h2>
            <p>
              Housing groups can help you hear about rooms, studios, and apartments
              quickly, but always verify a listing independently before making a
              commitment. Ask for a live viewing, confirm who owns or manages the
              property, and read the rental agreement carefully.
            </p>
            <ul>
              <li>Never transfer money before verifying the property and landlord.</li>
              <li>Be cautious when an offer seems unusually cheap or urgent.</li>
              <li>Keep personal documents private until you know who receives them.</li>
            </ul>
            <p>
              Want another way to find a rental? Create a free{" "}
              <Link href="/sign-up">RentSwap rental search profile</Link> and get
              matched with tenants who are preparing to move out.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}






