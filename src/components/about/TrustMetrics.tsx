import { premiumAboutContent } from '../../data/aboutContent';
import useReveal from '../../hooks/useReveal';

export default function TrustMetrics() {
  const containerRef = useReveal<HTMLDivElement>({ type: 'fade-up', duration: 1.2 });

  return (
    <section className="bg-sky py-24">
      <div className="container-shell relative">
        {/* Decorative background elements */}
        <svg
          className="absolute -top-10 -left-20 w-[400px] h-[400px] opacity-20 pointer-events-none"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="100" fill="#CFE4EA" />
        </svg>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10" ref={containerRef}>
          {premiumAboutContent.trust.stats.map((stat, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <span className="font-display text-5xl md:text-6xl text-charcoal mb-4">
                {stat.number}
              </span>
              <span className="text-charcoal/70 font-medium tracking-wide text-sm md:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
