import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <Link href="/" className={styles.logo}>
            RentSwap
          </Link>
          <p style={{ color: "#003049", lineHeight: 1.6 }}>
            The exclusive rental finder service. Get matched with your ideal
            home.
          </p>
          <div className={styles.socials}>
            <Link href="#" className={styles.socialIcon}>
              <Facebook size={20} />
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <Twitter size={20} />
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <Instagram size={20} />
            </Link>
            <Link href="#" className={styles.socialIcon}>
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
        <div className={styles.column}>
          <h4 className={styles.heading}>Company</h4>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <Link href="/#how-it-works" className={styles.link}>
                How it work
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/#pricing" className={styles.link}>
                Pricing
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="#pricing" className={styles.link}>
                Help & Earn
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.heading}>Support</h4>
          <ul className={styles.linkList}>
            <li className={styles.linkItem}>
              <Link href="/faq" className={styles.link}>
                FAQ
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/terms-conditions" className={styles.link}>
                Terms & Conditions
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="mailto:support@rentswap.nl" className={styles.link}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} RentSwap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
