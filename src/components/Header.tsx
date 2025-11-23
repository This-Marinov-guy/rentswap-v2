'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './common/Button';
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
        
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/find-home" className={styles.navLink}>
            Find a home
          </Link>
          <Link href="/help-earn" className={styles.navLink}>
            Help & Earn €200
          </Link>
          <Link href="/roommate" className={styles.navLink}>
            Looking for a roommate?
          </Link>
        </nav>

        <div className={styles.authButtons}>
          <Button variant="text" href="/signin" className={styles.signInBtn}>
            Sign In
          </Button>
          <Button variant="primary" size="medium" href="/signup" className={styles.signUpBtn}>
            Sign Up
          </Button>
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
              <Link href="/find-home" className={styles.mobileNavLink}>
                Find a home
              </Link>
              <Link href="/help-earn" className={styles.mobileNavLink}>
                Help & Earn €200
              </Link>
              <Link href="/roommate" className={styles.mobileNavLink}>
                Looking for a roommate?
              </Link>
              <div className={styles.mobileAuthButtons}>
                <Button variant="text" href="/signin" fullWidth>
                  Sign In
                </Button>
                <Button variant="primary" size="medium" href="/signup" fullWidth>
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
