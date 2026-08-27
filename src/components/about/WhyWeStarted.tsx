import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';
import { Quote } from 'lucide-react';

export default function WhyWeStarted() {
  const imgRef = useReveal<HTMLDivElement>({ type: 'fade-right', duration: 1.2 });
  const textRef = useReveal<HTMLDivElement>({ type: 'fade-left', duration: 1.2, delay: 0.2 });

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-shell">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} className="order-2 lg:order-1 max-w-xl">
            <span className="eyebrow inline-block mb-6">Why We Started</span>
            <p className="text-xl md:text-2xl text-charcoal/80 leading-relaxed mb-10 font-medium">
              {premiumAboutContent.whyWeStarted.story}
            </p>
            
            <div className="relative pl-10 border-l-2 border-clay py-4">
              <p className="font-display text-3xl md:text-4xl text-charcoal leading-tight">
                "{premiumAboutContent.whyWeStarted.quote}"
              </p>
            </div>
          </div>

          <div ref={imgRef} className="order-1 lg:order-2">
            <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-full overflow-hidden shadow-soft">
              <img 
                src={premiumAboutContent.whyWeStarted.image} 
                alt="Emotional pet connection" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
