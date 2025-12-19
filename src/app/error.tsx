"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorIcon}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="40"
                cy="40"
                r="38"
                stroke="#fa3c4c"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M40 24V44M40 56H40.04"
                stroke="#fa3c4c"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Something went wrong!</h1>
          <p className={styles.description}>
            We're sorry, but something unexpected happened. Our team has been
            notified and is working on fixing the issue.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <div className={styles.errorDetails}>
              <p className={styles.errorLabel}>Error details (dev only):</p>
              <pre className={styles.errorMessage}>{error.message}</pre>
            </div>
          )}
          <div className={styles.actions}>
            <button onClick={reset} className={styles.primaryButton}>
              Try Again
            </button>
            <Link href="/" className={styles.secondaryButton}>
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

