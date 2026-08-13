import { Scissors, Wheat, Stethoscope, ShoppingBag, type LucideIcon } from 'lucide-react';
import { services } from '../data/content';
import useReveal from '../hooks/useReveal';

const icons: Record<string, LucideIcon> = {
  Scissors,
  Wheat,
  Stethoscope,
  ShoppingBag,
};

export default function Services() {
  const gridRef = useReveal<HTMLDivElement>({ type: 'fade-up', stagger: 0.12 });

  return (
    <section className="bg-sky/60 py-24 md:py-32">
      <div className="container-shell">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow">What We Offer</span>
          <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] leading-tight">
            Full-service care, in one place.
          </h2>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <div
                key={service.id}
                className="bg-cream/70 border border-charcoal/10 rounded-soft p-7 hover:bg-cream transition-colors duration-500"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-cream mb-6">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="font-display text-xl mb-2">{service.title}</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
