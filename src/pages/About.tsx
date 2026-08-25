import AboutHero from '../components/about/AboutHero';
import BrandIntro from '../components/about/BrandIntro';
import OurStory from '../components/about/OurStory';
import OurMission from '../components/about/OurMission';
import OurValues from '../components/about/OurValues';
import WhyWeStarted from '../components/about/WhyWeStarted';
import Commitment from '../components/about/Commitment';
import TrustMetrics from '../components/about/TrustMetrics';
import FinalCTA from '../components/about/FinalCTA';

export default function About() {
  return (
    <main className="bg-cream pt-24 overflow-hidden">
      <AboutHero />
      <BrandIntro />
      <OurStory />
      <OurMission />
      <OurValues />
      <WhyWeStarted />
      <Commitment />
      <TrustMetrics />
      <FinalCTA />
    </main>
  );
}
