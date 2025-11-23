import Link from 'next/link';
import styles from './Features.module.css';

const Features = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Help & Earn €200</h2>
          <p className={styles.description}>
            Know someone moving out? Refer them to RentSwap and earn €200 when they successfully swap their rental. It's a win-win for everyone involved.
          </p>
          <Link href="#" className={styles.button}>
            Start Earning
          </Link>
        </div>
        <div className={styles.imagePlaceholder}>
          Illustration Placeholder
        </div>
      </div>
    </section>
  );
};

export default Features;
