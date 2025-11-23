'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const steps = [
    {
      number: '1',
      title: 'Tell us about yourself and your ideal place',
      description: 'Share your apartment needs and craft a standout introduction using our proven templates. We\'ll match you with the perfect opportunities.',
      image: '/assets/images/home/hiw-1.avif',
      icon: '📝',
    },
    {
      number: '2',
      title: 'Accept an offer and meet the tenant helping you',
      description: 'Have a video call or in-person viewing with the current tenant. They\'ll give you insider tips and ensure it\'s the right fit for you.',
      image: '/assets/images/home/hiw-2.avif',
      icon: '🤝',
    },
    {
      number: '3',
      title: 'Send the perfect application with insider help',
      description: 'With the current tenant\'s recommendation and guidance, submit an application that stands out. Get approved faster than traditional methods.',
      image: '/assets/images/home/hiw-3.avif',
      icon: '✅',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            How it works
          </h2>
          <p className={styles.subtitle}>
            Three simple steps to your new home - faster than any traditional rental platform
          </p>
        </div>

        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          {/* Desktop Timeline */}
          <div className={styles.timeline}>
            <div className={styles.timelineLine}>
              <div 
                className={styles.timelineProgress} 
                style={{ width: `${(activeStep / 2) * 100}%` }}
              />
            </div>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`${styles.timelineStep} ${index <= activeStep ? styles.active : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <div className={styles.stepNumber}>
                  <span>{step.icon}</span>
                </div>
                <div className={styles.stepContent}>
                  <h3>{step.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${styles.step} ${index === activeStep ? styles.activeStep : ''}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className={styles.stepImageWrapper}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={400}
                    height={300}
                    className={styles.stepImage}
                  />
                  <div className={styles.stepBadge}>
                    <span>Step {step.number}</span>
                  </div>
                </div>
                <div className={styles.stepInfo}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepIcon}>{step.icon}</span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                  </div>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Steps */}
          <div className={styles.mobileSteps}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${styles.mobileStep} ${isVisible ? styles.visible : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={styles.mobileStepHeader}>
                  <div className={styles.mobileStepNumber}>
                    <span>{step.icon}</span>
                  </div>
                  <h3 className={styles.mobileStepTitle}>{step.title}</h3>
                </div>
                <div className={styles.mobileStepImage}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={400}
                    height={250}
                    className={styles.stepImage}
                  />
                </div>
                <p className={styles.mobileStepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Ready to skip the rental queue?
          </p>
          <a href="#signup" className={styles.ctaButton}>
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;