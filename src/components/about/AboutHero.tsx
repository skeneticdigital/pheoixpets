import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { premiumAboutContent } from '../../data/aboutContent';

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(imgRef.current, 
      { scale: 1.1, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1.5 }
    )
    .fromTo(textRef.current?.children || [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      '-=1'
    );
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20" ref={containerRef}>
      <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[4rem] mx-2 lg:mx-6 shadow-soft">
        <img 
          ref={imgRef}
          src={premiumAboutContent.hero.image} 
          alt="Pets lifestyle" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
      </div>
      
      <div className="relative z-10 text-center max-w-3xl mx-auto text-cream" ref={textRef}>
        <span className="eyebrow inline-block mb-4 text-cream/90 tracking-widest">{premiumAboutContent.hero.label}</span>
        <h1 className="font-display text-5xl md:text-7xl mb-6 leading-tight">{premiumAboutContent.hero.headline}</h1>
        <p className="text-lg md:text-xl text-cream/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          {premiumAboutContent.hero.description}
        </p>
        <Link to="/shop" className="btn-primary inline-flex bg-cream text-charcoal hover:bg-gold">
          {premiumAboutContent.hero.cta}
        </Link>
      </div>
    </section>
  );
}
