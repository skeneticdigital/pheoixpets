import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';
import { Sparkles } from 'lucide-react';

export default function Commitment() {
  const textRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.2 });

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={premiumAboutContent.commitment.image} 
          alt="Our commitment" 
          className="w-full h-full object-cover fixed-parallax"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-[2px]" />
      </div>

      <div className="container-shell relative z-10 text-center" ref={textRef}>
        <div className="max-w-4xl mx-auto mb-16">
          <span className="eyebrow inline-block mb-6 text-clay tracking-widest">Our Promise</span>
          <h2 className="font-display text-4xl md:text-6xl text-cream leading-tight">
            {premiumAboutContent.commitment.headline}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {premiumAboutContent.commitment.points.map((point, i) => (
            <div key={i} className="flex flex-col items-center text-cream">
              <span className="h-12 w-12 flex items-center justify-center rounded-full bg-cream/10 border border-cream/20 mb-4">
                <Sparkles size={20} className="text-clay" />
              </span>
              <p className="text-lg font-medium tracking-wide">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
