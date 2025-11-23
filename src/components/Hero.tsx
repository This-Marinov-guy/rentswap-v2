'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Find your next home <br />
              <span className={styles.highlight}>without the competition</span>
            </h1>
            <p className={styles.subtitle}>
              Connect directly with tenants who are moving out. Get their apartment 
              before it hits the market, with their help securing it.
            </p>
            
            {/* <div className={styles.signupWrapper}>
              <EmailSignup
                placeholder="Enter your email to get started"
                buttonText="Start Finding"
                size="large"
                className={styles.emailSignup}
              />
              <p className={styles.disclaimer}>
                ✓ No upfront costs &nbsp;&nbsp; ✓ Only pay on success
              </p>
            </div> */}
          </div>

          <div className={styles.imageWrapper}>
            <div className={styles.imageContainer}>
              <Image
                src="/assets/images/home/home-phone.avif"
                alt="RentSwap App Interface"
                width={600}
                height={700}
                priority
                className={styles.heroImage}
              />
              {/* <div className={styles.floatingCard}>
                <div className={styles.cardIcon}>🏠</div>
                <div className={styles.cardContent}>
                  <strong>New match!</strong>
                  <span>2BR apartment in Amsterdam</span>
                </div>
              </div>
              <div className={styles.floatingCard2}>
                <div className={styles.cardIcon}>✅</div>
                <div className={styles.cardContent}>
                  <strong>Application accepted</strong>
                  <span>Congratulations!</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;