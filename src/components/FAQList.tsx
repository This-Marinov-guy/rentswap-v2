"use client";

import { useState } from "react";
import styles from "@/app/faq/page.module.css";

interface FAQItem {
    question: string;
    answer: string | string[];
}

const apartmentSeekerFAQs: FAQItem[] = [
    {
        question: "How does RentSwap work? - For an Apartment-Seeker",
        answer: [
            "Sign up and share your rental needs, introduction letter, and a photo.",
            "You'll be selected by a tenant moving out of a place that fits your needs.",
            "If you like the offer, chat with the tenant, video call, or visit the apartment.",
            "If you're both happy, we help you craft the perfect application.",
            "You and the current tenant send it to the landlord or agent.",
            "From there, it's up to you to secure the place. Good luck!"
        ]
    },
    {
        question: "What's included in the free service?",
        answer: [
            "Access to rental homes that match your needs, not listed anywhere else.",
            "A guide to help you write a strong Tenant Introduction Letter.",
            "A ready-to-use Rental Contract Request Email Template.",
            "Weekly updates about the status of your rental search without any active searching on your side."
        ]
    },
    {
        question: "When do I pay?",
        answer: [
            "If a tenant moves out of an apartment that suits your preferences, you'll receive an offer with its details and photos.",
            "If you accept the offer, you'll pay a deposit of half a month's rent plus 21% VAT on the current rent price.",
            "If the landlord approves you, we keep the deposit. If rejected, your deposit is refunded immediately.",
            "Both you and the outgoing tenant need to confirm the final result of the rental process."
        ]
    },
    {
        question: "What if I don't get a rental contract?",
        answer: [
            "No rental, no charge.",
            "You'll get your deposit back if you don't get the apartment.",
            "You only pay if we succeed."
        ]
    },
    {
        question: "How quickly can I find a rental?",
        answer: "The timeframe can vary based on availability and demand, but we aim to connect you with suitable tenants and secure a rental agreement as quickly as possible."
    },
    {
        question: "What if I change my mind and no longer need the service?",
        answer: "If you decide not to proceed, simply let us know. Since our service is free, you won't be charged unless you choose to move forward with an offer and secure a rental contract."
    }
];

const leavingTenantFAQs: FAQItem[] = [
    {
        question: "What is the moving tenant's job exactly?",
        answer: [
            "Upload a few pictures and info about your rental.",
            "We will send you a few candidates, and you choose one who you think has the highest chance to get your rental from your landlord/agent.",
            "Have a video call or viewing to ensure you're both happy with the arrangement.",
            "Introduce your candidate to your agent/landlord a few weeks before you move out."
        ]
    },
    {
        question: "When does the moving tenant get paid?",
        answer: [
            "In case your agent/landlord accepts your candidate as their next tenant.",
            "Right after both sides confirmed the success of the lease transfer."
        ]
    },
    {
        question: "Can I trust who you'll connect me with?",
        answer: "We verify the identity of aspiring tenants and collect their introductions. We then provide these introductions to the current tenant, who makes the final decision on choosing the right candidate. The current tenant reviews potential candidates without knowing their identities. If they decide to change their mind after the match, they can disconnect, and find a new candidate."
    }
];

export default function FAQList() {
    const [openIndex, setOpenIndex] = useState<{ section: string; index: number } | null>(null);

    const toggleFAQ = (section: string, index: number) => {
        const key = `${section}-${index}`;
        if (openIndex?.section === section && openIndex?.index === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex({ section, index });
        }
    };

    const renderAnswer = (answer: string | string[]) => {
        if (Array.isArray(answer)) {
            return (
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {answer.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem' }}>{item}</li>
                    ))}
                </ul>
            );
        }
        return <p>{answer}</p>;
    };

    return (
        <>
            <div className={styles.faqList}>
                <h2 className={styles.sectionTitle}>For an Apartment-Seeker</h2>
                {apartmentSeekerFAQs.map((faq, index) => (
                    <div key={`seeker-${index}`} className={styles.faqItem}>
                        <button
                            className={`${styles.question} ${
                                openIndex?.section === "seeker" && openIndex?.index === index
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => toggleFAQ("seeker", index)}
                            aria-expanded={
                                openIndex?.section === "seeker" && openIndex?.index === index
                            }
                        >
                            <span>{faq.question}</span>
                            <span className={styles.icon}>
                                {openIndex?.section === "seeker" && openIndex?.index === index
                                    ? "−"
                                    : "+"}
                            </span>
                        </button>
                        <div
                            className={`${styles.answer} ${
                                openIndex?.section === "seeker" && openIndex?.index === index
                                    ? styles.open
                                    : ""
                            }`}
                        >
                            {renderAnswer(faq.answer)}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.faqList} style={{ marginTop: 'var(--spacing-3xl)' }}>
                <h2 className={styles.sectionTitle}>Leaving Tenant Q&A</h2>
                {leavingTenantFAQs.map((faq, index) => (
                    <div key={`tenant-${index}`} className={styles.faqItem}>
                        <button
                            className={`${styles.question} ${
                                openIndex?.section === "tenant" && openIndex?.index === index
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => toggleFAQ("tenant", index)}
                            aria-expanded={
                                openIndex?.section === "tenant" && openIndex?.index === index
                            }
                        >
                            <span>{faq.question}</span>
                            <span className={styles.icon}>
                                {openIndex?.section === "tenant" && openIndex?.index === index
                                    ? "−"
                                    : "+"}
                            </span>
                        </button>
                        <div
                            className={`${styles.answer} ${
                                openIndex?.section === "tenant" && openIndex?.index === index
                                    ? styles.open
                                    : ""
                            }`}
                        >
                            {renderAnswer(faq.answer)}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
