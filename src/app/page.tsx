import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: "RentSwap — Find Your Next Home Without the Competition",
  socialTitle: "RentSwap — Find Your Next Home Without the Competition",
  description:
    "Connect with tenants who are moving out and secure your next rental home in the Netherlands. No application race, fair matching, and success-based pricing.",
  path: "/",
  absoluteTitle: true,
});

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
