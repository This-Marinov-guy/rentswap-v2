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
  const ref = useRef<HTMLDivElement>(null);

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Auto advance
  useEffect(() => {
    if (!visible || hovered !== null) return;

    const t = setTimeout(() => {
      setActiveStep((p) => (p + 1) % steps.length);
    }, 3500);

    return () => clearTimeout(t);
  }, [visible, hovered, activeStep, steps.length]);

  const segment = 100 / (steps.length - 1);
  const progress = visible ? activeStep * segment : 0;

  return (
    <div
      ref={ref}
      className={`${styles.content} ${visible ? styles.visible : ""}`}
    >
      {/* Timeline */}
      <div className={styles.timeline}>
        <div className={styles.timelineLine}>
          <div
            className={styles.timelineProgress}
            style={{ width: `${progress}%` }}
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

      {/* Cards */}
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
    </div>
  );
}