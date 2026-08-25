import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';

export default function FinalCTA() {
  const containerRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.2 });

  return (
    <section className="bg-cream py-24 pb-48">
      <div className="container-shell" ref={containerRef}>
        <div className="relative rounded-[3rem] overflow-hidden bg-charcoal">
          <div className="absolute inset-0">
            <img 
              src={premiumAboutContent.finalCta.image} 
              alt="Happy pet" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/40"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-4">
            <h2 className="font-display text-4xl md:text-6xl text-cream mb-8">
              {premiumAboutContent.finalCta.headline}
            </h2>
            <Link 
              to={premiumAboutContent.finalCta.link}
              className="btn-primary bg-[#ff7a00] text-white hover:bg-white hover:text-charcoal border-none"
            >
              {premiumAboutContent.finalCta.button}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
