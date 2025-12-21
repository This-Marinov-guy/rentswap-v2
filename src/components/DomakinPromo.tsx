import Image from "next/image";
import Highlight from "./common/Highlight";
import styles from "./DomakinPromo.module.css";

export default function DomakinPromo() {
  return (
    <section
      className={`${styles.section} ${styles.domakinPromo} ${styles.revealSection} ${styles.formExtend}`}
    >
      <div className={styles.domakinContent}>
        <Image
          src="/assets/logo/domakin.png"
          alt="Domakin"
          width={300}
          height={100}
        />
        <h3 className={styles.domakinTitle}>
          List your room and earn{" "}
          <Highlight variant="style2">€200</Highlight> after success.
        </h3>

        <a
          href="https://www.domakin.nl/services/add-listing"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.domakinButton}
        >
          Add listing
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 15L15 5M15 5H8M15 5V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}



