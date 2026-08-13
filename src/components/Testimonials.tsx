import { Quote } from 'lucide-react';
import { testimonials } from '../data/content';
import useReveal from '../hooks/useReveal';

export default function Testimonials() {
  const gridRef = useReveal<HTMLDivElement>({ type: 'fade-up', stagger: 0.1 });

  return (
    <section className="bg-cream-soft py-24 md:py-32">
      <div className="container-shell">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow">Loved by Pets & People</span>
          <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] leading-tight">
            Stories from the pack.
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-cream rounded-soft border border-charcoal/10 p-6 flex flex-col"
            >
              <Quote size={20} className="text-gold mb-4" strokeWidth={1.5} />
              <p className="text-sm text-charcoal/70 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <span className="h-10 w-10 rounded-full bg-gold/30 flex items-center justify-center font-display text-sm">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-charcoal/50">{t.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
