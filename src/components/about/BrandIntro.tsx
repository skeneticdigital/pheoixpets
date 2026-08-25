import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';
import { CheckCircle2 } from 'lucide-react';

export default function BrandIntro() {
  const imgRef = useReveal<HTMLDivElement>({ type: 'fade-right', duration: 1.2 });
  const textRef = useReveal<HTMLDivElement>({ type: 'fade-left', duration: 1.2, delay: 0.2 });

  return (
    <section className="container-shell py-24 md:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div ref={imgRef} className="relative">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
            <img 
              src={premiumAboutContent.brandIntro.image} 
              alt="Brand lifestyle" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sky rounded-full mix-blend-multiply opacity-50 -z-10" />
        </div>

        <div ref={textRef} className="max-w-xl">
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6 leading-tight">
            {premiumAboutContent.brandIntro.headline}
          </h2>
          <p className="text-lg text-charcoal/70 leading-relaxed mb-10">
            {premiumAboutContent.brandIntro.description}
          </p>
          
          <div className="grid gap-4">
            {premiumAboutContent.brandIntro.stats.map((stat, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-charcoal/5"
              >
                <CheckCircle2 className="text-clay" size={24} />
                <span className="font-medium text-charcoal">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
