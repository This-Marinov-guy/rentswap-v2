"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./HowItWorks.module.css";

type Step = {
  number: string;
  title: string;
  description: string;
  image: string;
  icon: string;
};

export default function HowItWorksClient({ steps }: { steps: Step[] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [animatingProgress, setAnimatingProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Smooth progressive animation for the progress bar
  useEffect(() => {
    if (!visible) return;

    const segment = 100 / (steps.length - 1);
    const targetProgress = activeStep * segment;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startProgress = progressRef.current;
    const startTime = performance.now();
    const duration = 800; // Animation duration in ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentProgress =
        startProgress + (targetProgress - startProgress) * eased;
      progressRef.current = currentProgress;
      setAnimatingProgress(currentProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visible, activeStep, steps.length]);

  // Auto advance
  useEffect(() => {
    if (!visible || hovered !== null) return;

    const t = setTimeout(() => {
      setActiveStep((p) => (p + 1) % steps.length);
    }, 3500);

    return () => clearTimeout(t);
  }, [visible, hovered, activeStep, steps.length]);

  return (
    <div
      ref={ref}
      className={`${styles.content} ${visible ? styles.visible : ""}`}
    >
      {/* Desktop Timeline */}
      <div className={styles.timeline}>
        <div className={styles.timelineLine}>
          <div
            className={styles.timelineProgress}
            style={{ width: `${animatingProgress}%` }}
          />
        </div>

        {steps.map((step, i) => {
          const reached = i <= activeStep;

          return (
            <div
              key={i}
              className={`${styles.timelineStep} ${
                reached ? styles.active : ""
              }`}
              onMouseEnter={() => {
                setHovered(i);
                setActiveStep(i);
              }}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`${styles.stepNumber} ${
                  reached ? styles.stepNumberCompleted : ""
                }`}
              >
                <div className={styles.stepFill} />
                <Image
                  src={step.icon}
                  alt=""
                  width={30}
                  height={30}
                  className={styles.stepIcon}
                />
              </div>
              <p className={styles.titleStep}>{step.title}</p>
            </div>
          );
        })}
      </div>

      {/* Desktop Cards */}
      <div className={styles.stepsGrid}>
        {steps.map((step, i) => (
          <div
            key={i}
            className={`${styles.step} ${
              i === activeStep ? styles.activeStep : ""
            }`}
            onMouseEnter={() => {
              setHovered(i);
              setActiveStep(i);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={styles.stepImageWrapper}>
              <Image src={step.image} alt="" width={400} height={300} />
              <div
                className={`${styles.stepBadge} ${
                  i === activeStep ? styles.stepBadgeActive : ""
                }`}
              >
                Step {step.number}
              </div>
            </div>

            <div className={styles.stepInfo}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Steps */}
      <div className={styles.mobileSteps}>
        {/* Centered Vertical Timeline Line */}
        <div className={styles.mobileTimeline}>
          <div className={styles.mobileTimelineLine}>
            <div
              className={styles.mobileTimelineProgress}
              style={{
                height: `${animatingProgress}%`,
              }}
            />
          </div>

          {/* Step node indicators on the line */}
          {steps.map((step, i) => {
            const reached = i <= activeStep;
            return (
              <div
                key={i}
                className={styles.mobileTimelineNode}
                style={{
                  top: `${(i / (steps.length - 1)) * 100}%`,
                }}
              >
                <div
                  className={`${styles.mobileNodeDot} ${
                    reached ? styles.mobileNodeDotActive : ""
                  }`}
                >
                  <Image
                    src={step.icon}
                    alt=""
                    width={34}
                    height={34}
                    className={styles.mobileNodeIcon}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Cards */}
        <div className={styles.mobileCardsWrapper}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.mobileStep} ${
                i === activeStep ? styles.mobileStepActive : ""
              }`}
              onClick={() => setActiveStep(i)}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={styles.mobileStepLabel}>Step {step.number}</div>
              <h3 className={styles.mobileStepTitle}>{step.title}</h3>

              <div className={styles.mobileStepImage}>
                <Image
                  src={step.image}
                  alt=""
                  width={400}
                  height={200}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <p className={styles.mobileStepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
