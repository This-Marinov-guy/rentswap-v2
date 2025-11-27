import HowItWorksClient from "./HowItWorks.client";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    number: "1",
    title: "Tell us about yourself and your ideal place",
    description:
      "Share your apartment needs and craft a standout introduction using our proven templates.",
    image: "/assets/images/home/hiw-1.avif",
    icon: "/assets/svg/user-id.svg",
  },
  {
    number: "2",
    title: "Accept an offer and meet the tenant helping you",
    description:
      "Have a video call or in-person viewing with the current tenant.",
    image: "/assets/images/home/hiw-2.avif",
    icon: "/assets/svg/handshake.svg",
  },
  {
    number: "3",
    title: "Send the perfect application with insider help",
    description: "Submit an application that stands out with insider guidance.",
    image: "/assets/images/home/hiw-3.avif",
    icon: "/assets/svg/checkmark.svg",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How it works</h2>
          <p className={styles.subtitle}>Three simple steps to your new home</p>
        </div>

        <HowItWorksClient steps={STEPS} />
      </div>
    </section>
  );
}
