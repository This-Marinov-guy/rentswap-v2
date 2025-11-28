import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import HeaderClient from "./HeaderClient";

const Header = () => {
  return (
    <header id="main-header" className={styles.header}>
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

        <HeaderClient />
      </div>
    </header>
  );
};

export default Header;
