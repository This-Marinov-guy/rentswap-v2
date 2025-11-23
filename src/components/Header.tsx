import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        RentSwap
      </Link>
      <nav className={styles.nav}>
        <Link href="#" className={styles.navLink}>
          Find a home
        </Link>
        <Link href="#" className={styles.navLink}>
          Help & Earn €200
        </Link>
      </nav>
      <div className={styles.authButtons}>
        <Link href="#" className={styles.signIn}>
          Sign In
        </Link>
        <Link href="#" className={styles.signUp}>
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
