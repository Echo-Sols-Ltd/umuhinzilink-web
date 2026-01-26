import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutUmuhinzinLink from '@/components/AboutUmunhzinLink';
import WhoWeServe from '@/components/WhoWeServe';
import PlatformFeatures from '@/components/PlatformFeatures';
import HowItWorks from '@/components/HowItWorks';
import ImpactStories from '@/components/ImpactStories';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <section id="home">
        <Hero />
      </section>
      <section id="features">
        <AboutUmuhinzinLink />
        <WhoWeServe />
        <PlatformFeatures />
      </section>
      <section id="agribusiness">
        <HowItWorks />
      </section>
      <section id="lenders">
        <ImpactStories />
      </section>
      <section id="contact">
        <CallToAction />
        <Footer />
      </section>
    </main>
  );
}
