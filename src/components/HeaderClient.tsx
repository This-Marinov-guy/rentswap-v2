"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function HeaderClient() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState("");
    const [activeSection, setActiveSection] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        const handleHashChange = () => {
            if (typeof window !== "undefined") {
                setCurrentHash(window.location.hash);
            }
        };

        if (typeof window !== "undefined") {
            // Initialize hash state asynchronously to avoid cascading renders
            setTimeout(() => {
                setCurrentHash(window.location.hash);
            }, 0);
            window.addEventListener("scroll", handleScroll);
            window.addEventListener("hashchange", handleHashChange);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("scroll", handleScroll);
                window.removeEventListener("hashchange", handleHashChange);
            }
        };
    }, []);

    // Track which section is currently in view
    useEffect(() => {
        if (pathname !== "/") return; // Only track sections on homepage

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the middle of viewport
            threshold: [0, 0.25, 0.5, 0.75, 1],
        };

        let intersectingSections = new Map<string, number>();

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting && sectionId) {
                    intersectingSections.set(sectionId, entry.intersectionRatio);
                } else if (sectionId) {
                    intersectingSections.delete(sectionId);
                }
            });

            // Find the section with the highest intersection ratio
            let maxRatio = 0;
            let mostVisibleSection = "";

            intersectingSections.forEach((ratio, id) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    mostVisibleSection = id;
                }
            });

            if (mostVisibleSection) {
                setActiveSection(`#${mostVisibleSection}`);
                // Update hash without scrolling
                if (window.history.replaceState) {
                    window.history.replaceState(null, "", `#${mostVisibleSection}`);
                }
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll("[id='how-it-works'], [id='moving-out']");
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, [pathname]);

    // Update parent header class based on scroll
    useEffect(() => {
        const header = document.getElementById("main-header");
        if (header) {
            if (isScrolled) {
                header.classList.add(styles.scrolled);
            } else {
                header.classList.remove(styles.scrolled);
            }
        }
    }, [isScrolled]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Helper function to check if a link is active
    const isActive = (path: string, hash?: string) => {
        // For hash-only links on the home page
        if (path === "/" && hash) {
            // Check both the current hash and the active section from scroll
            return pathname === "/" && (currentHash === hash || activeSection === hash);
        }
        // For regular page routes
        if (!hash) {
            return pathname === path || pathname.startsWith(path + "/");
        }
        // For links that could be either a path or hash
        return pathname === path || currentHash === hash || activeSection === hash;
    };

    return (
      <>
        <nav
          className={`${styles.navContainer} ${
            isMobileMenuOpen ? styles.mobileOpen : ""
          }`}
        >
          <div className={styles.nav}>
            <Link
              href="/#how-it-works"
              className={`${styles.navLink} ${
                isActive("/", "#how-it-works") ? styles.active : ""
              }`}
            >
              How it works
            </Link>
            <Link
              href="/#moving-out"
              className={`${styles.navLink} ${
                isActive("/", "#moving-out") ? styles.active : ""
              }`}
            >
              Moving Out?
            </Link>
            <Link
              href="/pricing"
              className={`${styles.navLink} ${
                isActive("/pricing") ? styles.active : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className={`${styles.navLink} ${
                isActive("/blog") ? styles.active : ""
              }`}
            >
              Blog
            </Link>
            <Link
              href="/resources"
              className={`${styles.navLink} ${
                isActive("/resources") ? styles.active : ""
              }`}
            >
              Useful Resources
            </Link>
          </div>
        </nav>

        <div className={styles.authButtons}>
          <Link href="/sign-up" className={styles.signUpButton}>
            Sign Up
          </Link>
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.menuIcon}>
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenuOverlay}>
            <nav className={styles.mobileNav}>
              <Link
                href="/#how-it-works"
                className={`${styles.mobileNavLink} ${
                  isActive("/", "#how-it-works") ? styles.active : ""
                }`}
                onClick={toggleMobileMenu}
              >
                How it works
              </Link>
              <Link
                href="/#moving-out"
                className={`${styles.mobileNavLink} ${
                  isActive("/", "#moving-out") ? styles.active : ""
                }`}
                onClick={toggleMobileMenu}
              >
                Moving Out?
              </Link>
              <Link
                href="/pricing"
                className={`${styles.mobileNavLink} ${
                  isActive("/pricing") ? styles.active : ""
                }`}
                onClick={toggleMobileMenu}
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className={`${styles.mobileNavLink} ${
                  isActive("/resources") ? styles.active : ""
                }`}
                onClick={toggleMobileMenu}
              >
                Useful Resources
              </Link>
              <Link
                href="/blog"
                className={`${styles.mobileNavLink} ${
                  isActive("/blog") ? styles.active : ""
                }`}
                onClick={toggleMobileMenu}
              >
                Blog
              </Link>
              <div className={styles.mobileAuthButtons}>
                <Link
                  href="/sign-up"
                  className={styles.mobileSignUpButton}
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </>
    );
}
