"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Highlight from "../common/Highlight";
import styles from "../Hero.module.css";

export default function HeroBadges() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userHoverRef = useRef<number | null>(null);

  useEffect(() => {
    // Start with first badge hovered
    setHoveredIndex(0);

    // Auto-cycle through badges
    const startAutoCycle = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        // Only auto-cycle if user is not manually hovering
        if (userHoverRef.current === null) {
          setHoveredIndex((prev) => {
            if (prev === null || prev === 0) {
              return 1;
            } else {
              return 0;
            }
          });
        }
      }, 3000); // Change hover every 3 seconds
    };

    startAutoCycle();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    userHoverRef.current = index;
    setHoveredIndex(index);
    // Clear auto-cycle when user hovers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    userHoverRef.current = null;
    // Resume auto-cycle after a delay
    setTimeout(() => {
      if (userHoverRef.current === null) {
        setHoveredIndex((prev) => {
          if (prev === null || prev === 0) {
            return 1;
          } else {
            return 0;
          }
        });

        // Restart auto-cycle
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          if (userHoverRef.current === null) {
            setHoveredIndex((prev) => {
              if (prev === null || prev === 0) {
                return 1;
              } else {
                return 0;
              }
            });
          }
        }, 3000);
      }
    }, 500); // Small delay before resuming
  };

  return (
    <div className={styles.badges + " flex justify-center"} style={{ marginBottom: "60px" }}>
      <Link
        href="/sign-up?type=looking"
        className={`${styles.badgeWrapper} ${hoveredIndex === 0 ? styles.badgeHovered : ""}`}
        onMouseEnter={() => handleMouseEnter(0)}
        onMouseLeave={handleMouseLeave}
      >
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
      </Link>
      <Link
        href="/sign-up?type=leaving"
        className={`${styles.badgeWrapper} ${hoveredIndex === 1 ? styles.badgeHovered : ""}`}
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={handleMouseLeave}
      >
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
      </Link>
    </div>
  );
}


