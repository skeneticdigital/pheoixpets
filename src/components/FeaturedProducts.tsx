import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/content';
import type { PetKind } from '../data/content';
import { ShoppingBag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<PetKind | 'all'>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filters: { label: string; value: PetKind | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Fish', value: 'fish' },
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
  ];

  const filteredProducts = products.filter(
    (product) => activeFilter === 'all' || product.kind === activeFilter
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.stagger-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/originals/a8/e7/4c/a8e74cf11a111d0c827b0be60caef4b5.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay to ensure text readability against the background */}
      <div className="absolute inset-0 bg-cream/70 backdrop-blur-[2px]"></div>

      <div className="container-shell relative z-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 stagger-item">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl tracking-tight text-charcoal sm:text-5xl md:text-6xl mb-4">
              Our Featured Products
            </h2>
            <p className="text-lg text-charcoal/70">
              Premium supplies and accessories for your beloved companions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full border px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'border-[#ff7a00] bg-[#ff7a00] text-white'
                    : 'border-charcoal/20 bg-white/80 text-charcoal/80 hover:border-charcoal hover:text-charcoal'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <div
              key={`${product.id}-${activeFilter}`}
              className="stagger-item group relative flex flex-col rounded-2xl bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              {product.image && (
                <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl bg-cream-soft relative">
                  <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}
              
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-cream-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                  {product.category}
                </span>
                <span className="font-display font-medium text-charcoal">
                  {product.price}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-display text-xl text-charcoal group-hover:text-charcoal transition-colors">
                  {product.name}
                </h3>
              </div>
              
              <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-4">
                <span className="text-sm font-medium capitalize text-charcoal/50">
                  {product.kind}
                </span>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-soft text-charcoal transition-colors group-hover:bg-[#ff7a00] group-hover:text-white">
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
