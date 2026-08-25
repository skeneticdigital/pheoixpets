import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';

export default function OurStory() {
  const containerRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.2 });

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-shell max-w-4xl" ref={containerRef}>
        <h2 className="font-display text-4xl md:text-5xl text-charcoal text-center mb-16">
          {premiumAboutContent.ourStory.headline}
        </h2>
        
        <div className="relative border-l border-clay/30 pl-8 md:pl-12 ml-4 md:ml-0 space-y-16">
          {premiumAboutContent.ourStory.timeline.map((item, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[2.35rem] md:-left-[3.35rem] top-1 h-3 w-3 rounded-full bg-clay ring-4 ring-white" />
              <div className="mb-2">
                <span className="text-sm font-bold tracking-wider text-clay uppercase">
                  {item.year}
                </span>
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-3">{item.title}</h3>
              <p className="text-charcoal/70 leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
