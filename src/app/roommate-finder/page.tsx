import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/SignUpForm";
import styles from "./page.module.css";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Roommate Finder | RentSwap",
  description:
    "Find the perfect roommate for your rental. Share your room details and get matched with compatible roommates in the Netherlands.",
  openGraph: {
    title: "Roommate Finder | RentSwap",
    description:
      "Find the perfect roommate for your rental. Share your room details and get matched with compatible roommates.",
    url: "https://rentswap.nl/roommate-finder",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

function SignUpFormWrapper() {
  return <SignUpForm />;
}

export default function RoommateFinderPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Roommate Finder</h1>
            <p className={styles.subtitle}>
              Looking for a roommate? Share your room details and we'll deliver
              roommate candidates straight to your inbox - completely free!
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>Share Your Room Details</h3>
                    <p>
                      Fill out the form below with information about your room,
                      location, price, and preferences.
                    </p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>Get Matched</h3>
                    <p>
                      Our system will match you with compatible roommates who
                      are looking for a place that fits your room.
                    </p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>Review Candidates</h3>
                    <p>
                      Review the matched candidates and choose who you think has
                      the highest chance of getting approved by your landlord.
                    </p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepNumber}>4</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>Connect & Earn</h3>
                    <p>
                      Connect with your chosen candidate, and if your landlord
                      approves them, you'll earn €200!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <Suspense fallback={<div>Loading...</div>}>
                <SignUpFormWrapper />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

