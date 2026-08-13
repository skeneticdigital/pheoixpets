import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { ctaContent } from '../data/content';
import PetVisual from './PetVisual';
import useReveal from '../hooks/useReveal';

export default function CTA() {
  const textRef = useReveal<HTMLDivElement>({ type: 'fade-up' });
  const floatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !floatRef.current) return;
    gsap.to(floatRef.current, {
      y: -18,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <section className="container-shell py-24 md:py-32">
      <div className="relative overflow-hidden rounded-soft bg-charcoal text-cream px-8 py-16 md:px-16 md:py-20 grid md:grid-cols-2 items-center gap-10">
        <div ref={textRef}>
          <h2 className="font-display text-3xl md:text-[2.8rem] leading-tight max-w-md">
            {ctaContent.heading}
          </h2>
          <p className="mt-4 text-cream/65 max-w-sm">{ctaContent.subtext}</p>
          <a href="#products" className="btn-primary mt-8 bg-gold text-charcoal hover:bg-cream">
            {ctaContent.button} <ArrowRight size={16} />
          </a>
        </div>
        <div ref={floatRef} className="relative">
          <PetVisual kind="dog" showTag={false} className="w-full aspect-[4/3] rounded-soft" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
      </div>
    </section>
  );
}
