import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQList from "@/components/FAQList";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | RentSwap",
  description: "Find answers to common questions about RentSwap, our matching algorithm, pricing, and how we help you find a rental home in the Netherlands.",
  openGraph: {
    title: "Frequently Asked Questions | RentSwap",
    description: "Find answers to common questions about RentSwap, our matching algorithm, pricing, and how we help you find a rental home in the Netherlands.",
    url: "https://rentswap.nl/faq",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Find answers to common questions about RentSwap. Can't find what you're looking for? Contact us at{" "}
            <a href="mailto:support@rentswap.nl">support@rentswap.nl</a>
          </p>

          <FAQList />

          <div className={styles.contactSection}>
            <h2>Have a Question?</h2>
            <p>
              Let us know, and we'll make sure it's added to the FAQ!
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
