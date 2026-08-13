import { ArrowRight } from 'lucide-react';
import { aboutContent } from '../data/content';
import PetVisual from './PetVisual';
import useReveal from '../hooks/useReveal';

export default function About() {
  const imgRef = useReveal<HTMLDivElement>({ type: 'fade-right', duration: 1.3 });
  const textRef = useReveal<HTMLDivElement>({ type: 'fade-left', duration: 1.1, delay: 0.15 });

  return (
    <section id="about" className="container-shell py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div ref={imgRef} className="relative">
          <PetVisual
            kind="cat"
            label="Whiskey"
            file="assets/cats/cat-04.webp"
            className="w-full aspect-[4/5] rounded-soft"
          />
          <div className="absolute -bottom-6 -right-6 bg-cream border border-charcoal/10 rounded-2xl px-5 py-4 shadow-card">
            <p className="font-display text-3xl leading-none">{aboutContent.stat.value}</p>
            <p className="text-xs text-charcoal/60 mt-1">{aboutContent.stat.label}</p>
          </div>
        </div>

        <div ref={textRef}>
          <span className="eyebrow">{aboutContent.eyebrow}</span>
          <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] leading-tight text-charcoal">
            {aboutContent.heading}
          </h2>
          <p className="mt-5 text-charcoal/65 leading-relaxed max-w-lg">{aboutContent.paragraph}</p>
          <a href="#about" className="btn-secondary mt-8">
            {aboutContent.cta} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
