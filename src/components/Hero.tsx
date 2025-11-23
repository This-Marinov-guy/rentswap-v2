import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <Image
        src="/hero-bg.png"
        alt="Modern living room"
        fill
        className={styles.backgroundImage}
        priority
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Join RentSwap and get matched with someone moving out of your ideal rental.
        </h1>
        <Link href="#" className={styles.ctaButton}>
          Find a home
        </Link>
      </div>
    </section>
  );
};

export default Hero;
