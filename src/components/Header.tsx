"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to check if a link is active
  const isActive = (path: string, hash?: string) => {
    // For hash-only links on the home page
    if (path === "/" && hash) {
      return pathname === "/" && currentHash === hash;
    }
    // For regular page routes
    if (!hash) {
      return pathname === path || pathname.startsWith(path + "/");
    }
    // For links that could be either a path or hash
    return pathname === path || currentHash === hash;
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/assets/svg/logo.svg"
            alt="RentSwap"
            width={140}
            height={32}
            priority
          />
        </Link>

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
          <Link href="/signup" className={styles.signUpButton}>
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
              >
                How it works
              </Link>
              <Link
                href="/#moving-out"
                className={`${styles.mobileNavLink} ${
                  isActive("/", "#moving-out") ? styles.active : ""
                }`}
              >
                Moving Out?
              </Link>
              <Link
                href="/pricing"
                className={`${styles.mobileNavLink} ${
                  isActive("/pricing") ? styles.active : ""
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className={`${styles.mobileNavLink} ${
                  isActive("/resources") ? styles.active : ""
                }`}
              >
                Useful Resources
              </Link>
              <div className={styles.mobileAuthButtons}>
                <Link href="/signup" className={styles.mobileSignUpButton}>
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
