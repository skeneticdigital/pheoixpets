import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';

export default function OurMission() {
  const containerRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.2 });

  return (
    <section className="bg-charcoal text-cream py-24 md:py-32 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-clay/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <div className="container-shell relative z-10" ref={containerRef}>
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {premiumAboutContent.mission.headline}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {premiumAboutContent.mission.cards.map((card, i) => (
            <div 
              key={i}
              className="bg-cream/10 backdrop-blur-sm border border-cream/10 p-8 rounded-[2rem] hover:bg-cream/15 transition-colors duration-500"
            >
              <h3 className="font-display text-2xl text-gold mb-4">{card.title}</h3>
              <p className="text-cream/80 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
