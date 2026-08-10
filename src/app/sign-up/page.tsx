import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import SignUpForm from "@/components/SignUpForm";
import styles from "./page.module.css";
import { Suspense } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Create Your Free Rental Search Profile",
  description:
    "Create a free RentSwap profile to find rental opportunities in the Netherlands through fair matching, with no subscription or upfront fee.",
  path: "/sign-up",
});

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

          <Suspense fallback={<div>Loading...</div>}>
            <SignUpForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
