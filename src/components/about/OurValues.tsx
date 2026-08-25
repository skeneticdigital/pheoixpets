import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';

export default function OurValues() {
  const containerRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.2 });

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="container-shell" ref={containerRef}>
        <h2 className="font-display text-4xl md:text-5xl text-charcoal text-center mb-16">
          {premiumAboutContent.values.headline}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {premiumAboutContent.values.cards.map((card, i) => (
            <div 
              key={i}
              className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/60 transition-opacity duration-500 group-hover:bg-charcoal/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <h3 className="font-display text-3xl mb-3 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {card.title}
                </h3>
                <p className="text-cream/90 opacity-0 h-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:h-auto group-hover:translate-y-0">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
