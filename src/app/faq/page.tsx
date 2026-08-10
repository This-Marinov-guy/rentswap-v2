import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQList from "@/components/FAQList";
import styles from "./page.module.css";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Rental Service Frequently Asked Questions",
  description:
    "Find answers about RentSwap's rental matching process, costs, apartment offers, tenant eligibility, and moving-out rewards in the Netherlands.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Find answers to common questions about RentSwap. Can&apos;t find what
            you&apos;re looking for? Contact us at{" "}
            <a href="mailto:support@rentswap.nl">support@rentswap.nl</a>
          </p>

          <FAQList />

          <div className={styles.contactSection}>
            <h2>Have a Question?</h2>
            <p>
              Let us know, and we&apos;ll make sure it&apos;s added to the FAQ!
            </p>
            <div className={styles.contactForm}>
              <a
                href="mailto:info@rentswap.nl?subject=FAQ Question"
                className={styles.contactButton}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
