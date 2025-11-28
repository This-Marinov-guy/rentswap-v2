import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Highlight from "@/components/common/Highlight";
import Button from "@/components/common/Button";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | RentSwap",
  description: "Fair success-based pricing. Pay nothing unless you successfully sign a rental contract. No upfront costs, no hidden fees.",
  openGraph: {
    title: "Pricing | RentSwap",
    description: "Fair success-based pricing. Pay nothing unless you successfully sign a rental contract.",
    url: "https://rentswap.nl/pricing",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

const benefits = [
  "Exclusive Access to Unlisted Rentals",
  "Save Endless Hours of Searching",
  "A Fair Tenant-Matching Algorithm",
  "No Upfront, Nor Hidden Costs",
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Pricing</p>
          <h3>
            Pay{" "}
            <Highlight variant="style2" size="small">
              NOTHING
            </Highlight>{" "}
            unless you accept an offer and the landlord approves you!
          </h3>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <Image
              src="/assets/images/features/house.png"
              alt="House"
              width={200}
              height={200}
              className={styles.iconCircle}
            />
            <div>
              <p className={styles.subTitle}>Our Success Fee</p>
              <p className={styles.title}>1 Month's Rent (+21% VAT)</p>
            </div>
          </div>

          <ul className={styles.bulletList}>
            {benefits.map((text) => (
              <li key={text} className={styles.bullet}>
                <span className={styles.dot} aria-hidden="true" />
                <div>
                  <strong>{text}</strong>
                  <p>
                    {text === benefits[1]
                      ? "Sign up once, we’ll find an offer for you."
                      : text === benefits[2]
                        ? "Our algorithms prioritize people who have been in the queue longer and need urgent help."
                        : text === benefits[3]
                          ? "If you successfully sign a contract with our help, our fee is half month’s rent plus 21% VAT."
                          : "Find homes that are not on other platforms."}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Button variant="style1" className={styles.action}>
            Sign Up for Free
          </Button>
          <p className={styles.note}>
            No Contract, No Costs! Pay only when you move in.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

