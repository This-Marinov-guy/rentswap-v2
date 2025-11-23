'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from './common/Button';
import styles from './Features.module.css';

const features = [
  {
    icon: '🎯',
    title: 'No Competition',
    description: 'Skip the viewing wars. Connect directly with tenants who are moving out.',
  },
  {
    icon: '⏰',
    title: 'Save Time',
    description: `Sign up once and we'll find offers for you. No endless searching required.`,
  },
  {
    icon: '⚖️',
    title: 'Fair Algorithm',
    description: `Our system prioritizes those who've been waiting longest and those in urgent need.`,
  },
  {
    icon: '💶',
    title: 'Success-Based Pricing',
    description: `No upfront costs. Pay only half a month's rent + VAT after you sign the lease.`,
  },
];

const Features = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Features Grid */}
        <div 
          id="features-grid"
          ref={(el) => (sectionRefs.current['features-grid'] = el)}
          className={`${styles.featuresGrid} ${
            visibleSections.has('features-grid') ? styles.visible : ''
          }`}
        >
          <div className={styles.gridHeader}>
            <h2 className={styles.gridTitle}>Why choose RentSwap?</h2>
            <p className={styles.gridSubtitle}>
              The smarter way to find your next rental home in the Netherlands
            </p>
          </div>
          
          <div className={styles.cards}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cardIcon}>{feature.icon}</div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div
          id="story-section"
          ref={(el) => (sectionRefs.current['story-section'] = el)}
          className={`${styles.alternatingSection} ${
            visibleSections.has('story-section') ? styles.visible : ''
          }`}
        >
          <div className={styles.alternatingContent}>
            <div className={styles.textContent}>
              <span className={styles.badge}>Our Story</span>
              <h2 className={styles.sectionTitle}>
                Born from personal experience
              </h2>
              <p className={styles.sectionText}>
                Our founder moved to the Netherlands and faced the same challenges you're facing. 
                Finding a rental felt impossible until a friend who was moving out helped secure 
                their apartment.
              </p>
              <p className={styles.sectionText}>
                That experience inspired RentSwap - a platform that connects people looking for 
                homes with tenants who are moving out. No more competing with 50 other applicants. 
                No more endless viewings. Just a direct connection to your next home.
              </p>
              <Button variant="secondary" size="large" href="/about">
                Read Our Full Story
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 13L12 8L7 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
            <div className={styles.imageContent}>
              <Image
                src="/assets/images/home/story-home.avif"
                alt="Amsterdam canal houses"
                width={600}
                height={400}
                className={styles.sectionImage}
              />
            </div>
          </div>
        </div>

        {/* Earn Section */}
        <div
          id="earn-section"
          ref={(el) => (sectionRefs.current['earn-section'] = el)}
          className={`${styles.alternatingSection} ${styles.reversed} ${
            visibleSections.has('earn-section') ? styles.visible : ''
          }`}
        >
          <div className={styles.alternatingContent}>
            <div className={styles.imageContent}>
              <Image
                src="/assets/images/home/earn-phone.avif"
                alt="Earn money with RentSwap"
                width={600}
                height={400}
                className={styles.sectionImage}
              />
              <div className={styles.earnBadge}>
                <span className={styles.earnAmount}>€200</span>
                <span className={styles.earnText}>per successful swap</span>
              </div>
            </div>
            <div className={styles.textContent}>
              <span className={styles.badge}>Help & Earn</span>
              <h2 className={styles.sectionTitle}>
                Moving out? Earn €200
              </h2>
              <p className={styles.sectionText}>
                If you're moving out within a year, you can help someone else get your place 
                and earn €200 when they successfully sign the lease.
              </p>
              <div className={styles.earnSteps}>
                <div className={styles.earnStep}>
                  <div className={styles.stepIcon}>1</div>
                  <div className={styles.stepText}>List your apartment details</div>
                </div>
                <div className={styles.earnStep}>
                  <div className={styles.stepIcon}>2</div>
                  <div className={styles.stepText}>We match you with candidates</div>
                </div>
                <div className={styles.earnStep}>
                  <div className={styles.stepIcon}>3</div>
                  <div className={styles.stepText}>Help them secure the place</div>
                </div>
                <div className={styles.earnStep}>
                  <div className={styles.stepIcon}>4</div>
                  <div className={styles.stepText}>Get paid €200 after success</div>
                </div>
              </div>
              <Button variant="primary" size="large" href="/help-earn">
                Start Earning Now
              </Button>
            </div>
          </div>
        </div>

        {/* Roommate Section */}
        <div
          id="roommate-section"
          ref={(el) => (sectionRefs.current['roommate-section'] = el)}
          className={`${styles.roommateSection} ${
            visibleSections.has('roommate-section') ? styles.visible : ''
          }`}
        >
          <div className={styles.roommateContent}>
            <div className={styles.roommateText}>
              <h2 className={styles.roommateTitle}>Looking for a roommate?</h2>
              <p className={styles.roommateSubtitle}>
                Share your room details and we'll deliver roommate candidates straight to your inbox - completely free!
              </p>
              <Button variant="primary" size="large" href="/roommate">
                Find a Roommate
              </Button>
            </div>
            <div className={styles.roommateImage}>
              <Image
                src="/assets/images/finder/roomates.avif"
                alt="Roommates"
                width={300}
                height={200}
                className={styles.roommateImg}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;