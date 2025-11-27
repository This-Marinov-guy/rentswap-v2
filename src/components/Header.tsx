'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
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
        
        <nav className={`${styles.navContainer} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <div className={styles.nav}>
            <Link href="/" className={`${styles.navLink} ${styles.active}`}>
              Home
            </Link>
            <Link href="/moving-out" className={styles.navLink}>
              Moving Out?
            </Link>
            <Link href="/pricing" className={styles.navLink}>
              Pricing
            </Link>
            <Link href="/resources" className={styles.navLink}>
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
              <Link href="/" className={styles.mobileNavLink}>
                Home
              </Link>
              <Link href="/moving-out" className={styles.mobileNavLink}>
                Moving Out?
              </Link>
              <Link href="/pricing" className={styles.mobileNavLink}>
                Pricing
              </Link>
              <Link href="/resources" className={styles.mobileNavLink}>
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
