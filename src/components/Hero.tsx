"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import Highlight from "./common/Highlight";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              Find your next home <br />
              <Highlight
                variant="style1"
                size="small"
                className={styles.wordHighlight}
              >
                without
              </Highlight>{" "}
              <span className={styles.highlight}>the competition</span>
            </h1>
            <ul className={styles.featurePoints}>
              {[
                {
                  label: "Skip the application race",
                  detail: "get a fair chance!",
                  icon: "/assets/svg/skip.svg",
                },
                {
                  label: "No upfront cost",
                  detail: "pay after signing the contract.",
                  icon: "/assets/svg/money.svg",
                },
                {
                  label: "Set up once",
                  detail: "and just wait for your offer.",
                  icon: "/assets/svg/offer.svg",
                },
              ].map((point) => (
                <li key={point.label} className={styles.featurePoint}>
                  <span className={styles.pointIcon} aria-hidden="true">
                    <Image
                      src={point.icon}
                      alt=""
                      width={26}
                      height={26}
                      priority
                      className={styles.pointIconImage}
                    />
                  </span>
                  <div>
                    <strong>{point.label},</strong> <span>{point.detail}</span>
                  </div>
                </li>
              ))}
            </ul>

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
              <div className={styles.badges + " flex justify-center"} style={{marginBottom: "60px"}}>
                <div className={styles.badgeWrapper}>
                  <Highlight
                    variant="style1"
                    size="small"
                    className={styles.badge}
                  >
                    Earn a home
                  </Highlight>
                  <Image
                    src="/assets/images/common/arrow.avif"
                    alt=""
                    width={60}
                    height={60}
                    className={styles.arrowToHome}
                  />
                </div>
                <div className={styles.badgeWrapper}>
                  <Highlight
                    variant="style2"
                    size="small"
                    className={styles.badge}
                  >
                    Earn €200
                  </Highlight>
                  <Image
                    src="/assets/images/common/arrow.avif"
                    alt=""
                    width={60}
                    height={60}
                    className={styles.arrowToEarn}
                  />
                </div>
              </div>

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
