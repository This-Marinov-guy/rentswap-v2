'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Testimonial.module.css';

const Testimonial = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.quoteWrapper}>
            <div className={styles.quoteIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M16 20C16 16.6863 18.6863 14 22 14V14C22 9.58172 18.4183 6 14 6V6C9.58172 6 6 9.58172 6 14V34C6 37.3137 8.68629 40 12 40H16C19.3137 40 22 37.3137 22 34V26C22 22.6863 19.3137 20 16 20V20Z"
                  fill="currentColor"
                />
                <path
                  d="M38 20C38 16.6863 40.6863 14 44 14V14C44 9.58172 40.4183 6 36 6V6C31.5817 6 28 9.58172 28 14V34C28 37.3137 30.6863 40 34 40H38C41.3137 40 44 37.3137 44 34V26C44 22.6863 41.3137 20 38 20V20Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <blockquote className={styles.quote}>
              "I had been searching for an apartment in Amsterdam for 3 months with no luck. 
              Every viewing had 30+ people competing. With RentSwap, I found my perfect home 
              in just 5 days! The previous tenant helped me craft an application the landlord 
              couldn't refuse. It felt like having an insider guide me through the process."
            </blockquote>
            
            <div className={styles.author}>
              <div className={styles.authorImage}>
                <Image
                  src="/assets/images/home/david.avif"
                  alt="David - RentSwap customer"
                  width={64}
                  height={64}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.authorInfo}>
                <p className={styles.authorName}>David van der Berg</p>
                <p className={styles.authorLocation}>Found his home in Amsterdam Zuid</p>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1L12.39 6.36L18 7.24L14 11.14L14.92 16.73L10 14L5.08 16.73L6 11.14L2 7.24L7.61 6.36L10 1Z"
                        fill="#FFD700"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>3 months</p>
              <p className={styles.statLabel}>Traditional search time</p>
            </div>
            <div className={styles.arrow}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M8.33334 20H31.6667M31.6667 20L23.3333 11.6667M31.6667 20L23.3333 28.3333"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statNumber}>5 days</p>
              <p className={styles.statLabel}>With RentSwap</p>
            </div>
          </div>
        </div>
        
        <div className={styles.moreTestimonials}>
          <p className={styles.moreText}>Join 1,000+ happy tenants who found their perfect home</p>
          <div className={styles.testimonialLogos}>
            <div className={styles.logoGroup}>
              <span className={styles.logoText}>Featured in</span>
              <div className={styles.logos}>
                <span className={styles.publication}>NRC</span>
                <span className={styles.publication}>Parool</span>
                <span className={styles.publication}>AT5</span>
                <span className={styles.publication}>RTL Nieuws</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
