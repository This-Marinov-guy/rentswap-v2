"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is RentSwap?",
    answer: "RentSwap is a platform that connects prospective tenants with current tenants who are planning to move out of their rental properties in the Netherlands. We help you find rental opportunities that may not be publicly listed on other platforms, giving you access to homes before they hit the competitive market."
  },
  {
    question: "How does RentSwap work?",
    answer: "Simply create a free account and complete your profile with your housing preferences. Our fair matching algorithm will connect you with tenants who are moving out of properties that match your criteria. When a match is found, you'll be notified and can express your interest. If both parties agree and the landlord approves, you can proceed with the rental process."
  },
  {
    question: "Is RentSwap really free to use?",
    answer: "Yes! Registration, browsing, and using our matching service is completely free. You only pay our success fee of one month's rent plus 21% VAT if you successfully sign a rental contract through our platform. There are no upfront costs, subscription fees, or hidden charges."
  },
  {
    question: "How does the matching algorithm work?",
    answer: "Our algorithm prioritizes fairness and transparency. We consider factors like how long you've been in the queue (registration date), urgency of your housing need, compatibility with available properties, and profile completeness. This ensures that everyone gets a fair chance, and those who need help most urgently are prioritized."
  },
  {
    question: "What areas does RentSwap cover?",
    answer: "RentSwap currently operates throughout the Netherlands, with a focus on major cities like Amsterdam, Rotterdam, The Hague, and Utrecht. We're continuously expanding to cover more areas as our network grows."
  },
  {
    question: "When do I pay the success fee?",
    answer: "You only pay our success fee after you've successfully signed a rental contract through RentSwap. The fee is one month's rent plus 21% VAT, and payment is due within 14 days of contract signing. If you don't find a home through our platform, you pay nothing."
  },
  {
    question: "Can I trust the listings on RentSwap?",
    answer: "Yes. We verify all users and listings to ensure authenticity. Our platform connects you directly with current tenants and landlords, reducing the risk of scams. However, we always recommend conducting your own due diligence, viewing properties in person, and reviewing contracts carefully before signing."
  },
  {
    question: "How long does it take to find a rental?",
    answer: "The timeline varies depending on your preferences, the current market, and availability. Some users find a match within weeks, while others may take a few months. Our algorithm ensures you're in a fair queue, and we'll notify you immediately when suitable opportunities arise."
  },
  {
    question: "What if the landlord doesn't approve my application?",
    answer: "Landlords have the final say in tenant selection. If a landlord doesn't approve your application, you won't be charged any fees, and you'll remain in our matching system for future opportunities. We recommend keeping your profile complete and up-to-date to maximize your chances."
  },
  {
    question: "Can I view properties before committing?",
    answer: "Absolutely! We encourage all users to view properties in person, meet with current tenants and landlords, and ask questions before making any commitments. Never sign a contract without viewing the property first."
  },
  {
    question: "What information do I need to provide?",
    answer: "You'll need to create an account with basic contact information and complete your profile with details about your housing preferences (location, budget, size, move-in date), employment status, and any other relevant information that helps us match you with suitable properties."
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes. We take data privacy seriously and comply with GDPR and Dutch data protection laws. Your information is encrypted and only shared with relevant parties (landlords, current tenants) when you express interest in a property. See our Privacy Policy for full details."
  },
  {
    question: "Can I cancel my account at any time?",
    answer: "Yes, you can cancel your account at any time by contacting us. If you haven't signed a rental contract through our platform, there are no cancellation fees. If you've already signed a contract and paid the success fee, the fee is non-refundable."
  },
  {
    question: "What makes RentSwap different from other rental platforms?",
    answer: "Unlike traditional rental platforms where you compete with hundreds of applicants, RentSwap gives you early access to properties before they're publicly listed. Our fair matching algorithm, success-based pricing, and focus on connecting you directly with outgoing tenants make the process more transparent, affordable, and less stressful."
  },
  {
    question: "How do I contact RentSwap support?",
    answer: "You can reach our support team at support@rentswap.nl. We typically respond within 24-48 hours during business days. For urgent matters, please indicate this in your email subject line."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={`${styles.question} ${openIndex === index ? styles.active : ""}`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <span className={styles.icon}>
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`${styles.answer} ${openIndex === index ? styles.open : ""}`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.contactSection}>
            <h2>Still have questions?</h2>
            <p>
              We're here to help! Reach out to our support team at{" "}
              <a href="mailto:support@rentswap.nl">support@rentswap.nl</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
