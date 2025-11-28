import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RentSwap",
  description: "Learn how RentSwap collects, uses, and protects your personal information in compliance with GDPR and Dutch data protection laws.",
  openGraph: {
    title: "Privacy Policy | RentSwap",
    description: "Learn how RentSwap collects, uses, and protects your personal information in compliance with GDPR and Dutch data protection laws.",
    url: "https://rentswap.nl/privacy-policy",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: November 28, 2025</p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              At RentSwap, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information (age, occupation, income details)</li>
              <li>Housing preferences and requirements</li>
              <li>Communication history with us and other users</li>
              <li>Payment and billing information</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>
              When you use RentSwap, we automatically collect:
            </p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages viewed, time spent, click patterns)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location data (with your permission)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul>
              <li>To provide and maintain our matching service</li>
              <li>To process your registration and manage your account</li>
              <li>To match you with suitable rental opportunities</li>
              <li>To communicate with you about your account and our services</li>
              <li>To process payments and prevent fraud</li>
              <li>To improve our platform and develop new features</li>
              <li>To comply with legal obligations</li>
              <li>To send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Information Sharing and Disclosure</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul>
              <li><strong>With Landlords:</strong> When you express interest in a property, we share relevant profile information with the landlord</li>
              <li><strong>With Current Tenants:</strong> To facilitate the matching process</li>
              <li><strong>Service Providers:</strong> With third-party vendors who assist in operating our platform (payment processors, hosting services, analytics providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Your Rights and Choices</h2>
            <p>
              Under GDPR and Dutch data protection laws, you have the following rights:
            </p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at <a href="mailto:privacy@rentswap.nl">privacy@rentswap.nl</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and recommendations</li>
              <li>Measure the effectiveness of our marketing campaigns</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Note that disabling cookies may affect platform functionality.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to:
            </p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p>
              When your data is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside the European Economic Area (EEA). We ensure appropriate safeguards are in place to protect your data in accordance with GDPR requirements.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Children's Privacy</h2>
            <p>
              RentSwap is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our platform. Your continued use after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <p>
              Email: <a href="mailto:privacy@rentswap.nl">privacy@rentswap.nl</a><br />
              Data Protection Officer: <a href="mailto:dpo@rentswap.nl">dpo@rentswap.nl</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Supervisory Authority</h2>
            <p>
              If you believe we have not addressed your privacy concerns adequately, you have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
