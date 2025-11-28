"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./CookieBanner.module.css";

const COOKIE_CONSENT_KEY = "rentswap_cookie_consent";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <h3 className={styles.title}>We use cookies</h3>
          <p className={styles.text}>
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
            By clicking "Accept", you consent to our use of cookies. Learn more in our{" "}
            <Link href="/privacy-policy" className={styles.link}>
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className={styles.actions}>
          <button onClick={handleDecline} className={styles.declineButton}>
            Decline
          </button>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
