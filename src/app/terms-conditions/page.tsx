import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | RentSwap",
  description: "Read our Terms and Conditions to understand the rules and regulations governing the use of RentSwap's platform and services.",
  openGraph: {
    title: "Terms and Conditions | RentSwap",
    description: "Read our Terms and Conditions to understand the rules and regulations governing the use of RentSwap's platform and services.",
    url: "https://rentswap.nl/terms-conditions",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

export default function TermsConditionsPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.lastUpdated}>Last updated: November 28, 2025</p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to RentSwap. These Terms and Conditions ("Terms") govern your use of our platform and services. By accessing or using RentSwap, you agree to be bound by these Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Service Description</h2>
            <p>
              RentSwap is a platform that connects prospective tenants with current tenants who are planning to move out of their rental properties in the Netherlands. Our service helps you find rental opportunities that may not be publicly listed on other platforms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. User Eligibility</h2>
            <p>
              To use RentSwap, you must:
            </p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Be legally capable of entering into binding contracts</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Account Registration</h2>
            <p>
              When you create an account with RentSwap, you agree to:
            </p>
            <ul>
              <li>Provide truthful, accurate, and complete information</li>
              <li>Update your information to keep it current</li>
              <li>Maintain the confidentiality of your account password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Pricing and Payment</h2>
            <p>
              RentSwap operates on a success-based pricing model:
            </p>
            <ul>
              <li>Registration and browsing are completely free</li>
              <li>No upfront costs or subscription fees</li>
              <li>A success fee of one month's rent plus 21% VAT is charged only when you successfully sign a rental contract through our platform</li>
              <li>Payment is due within 14 days of contract signing</li>
              <li>All fees are clearly communicated before any commitment</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. User Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the platform for any illegal purposes</li>
              <li>Attempt to circumvent our matching algorithm</li>
              <li>Share your account with others</li>
              <li>Scrape or collect data from the platform without permission</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Matching Algorithm</h2>
            <p>
              Our fair matching algorithm prioritizes users based on:
            </p>
            <ul>
              <li>Time in queue (registration date)</li>
              <li>Urgency of housing need</li>
              <li>Compatibility with available properties</li>
              <li>Profile completeness and accuracy</li>
            </ul>
            <p>
              We reserve the right to adjust our algorithm to ensure fairness and prevent abuse.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. No Guarantee of Success</h2>
            <p>
              While we strive to connect you with suitable rental opportunities, RentSwap does not guarantee that you will find a rental property or that any landlord will approve your application. Final decisions rest with property owners and landlords.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Intellectual Property</h2>
            <p>
              All content on RentSwap, including but not limited to text, graphics, logos, images, and software, is the property of RentSwap or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, RentSwap shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion. You may also terminate your account at any time by contacting us.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify users of significant changes via email or through the platform. Your continued use of RentSwap after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Netherlands. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of the Netherlands.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:support@rentswap.nl">support@rentswap.nl</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
