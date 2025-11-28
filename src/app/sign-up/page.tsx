import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import SignUpForm from "@/components/SignUpForm";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | RentSwap",
  description: "Create your free RentSwap account to find exclusive rental opportunities in the Netherlands. No upfront costs, fair matching, and secure process.",
  openGraph: {
    title: "Sign Up | RentSwap",
    description: "Create your free RentSwap account to find exclusive rental opportunities in the Netherlands.",
    url: "https://rentswap.nl/sign-up",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={"highlight"}>Sign Up</h1>
            <p className={styles.subtitle}>
              Your data is safe and fully protected under GDPR guidelines. Learn more in our{" "}
              <Link href="/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>.
            </p>
          </div>

          <SignUpForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
