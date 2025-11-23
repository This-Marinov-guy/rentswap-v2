import { User, CheckCircle, Send } from 'lucide-react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: User,
    title: 'Tell Us About Yourself',
    description: 'Create a profile and let us know what kind of home you are looking for.',
  },
  {
    icon: CheckCircle,
    title: 'Accept an Offer',
    description: 'Receive offers from people moving out of their apartments.',
  },
  {
    icon: Send,
    title: 'Send the Perfect Application',
    description: 'Apply directly to the landlord with a pre-vetted application.',
  },
];

const HowItWorks = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>How it works</h2>
      <div className={styles.steps}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className={styles.step}>
              <div className={styles.iconWrapper}>
                <Icon size={32} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
