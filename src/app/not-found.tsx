import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or doesn't exist.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton} style={{ color: "var(--white)" }}>
              Go to Homepage
            </Link>
            <Link href="/sign-up" className={styles.secondaryButton}>
              Sign Up
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

