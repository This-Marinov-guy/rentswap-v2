import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "RentSwap - Find your next home without the competition",
  description: "Connect with tenants who are moving out and secure your perfect rental home in the Netherlands. No competition, fair algorithm, success-based pricing.",
};

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}
