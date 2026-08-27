import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PetKind } from '../data/content';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<PetKind | 'all'>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { products } = useProducts();

  const filters: { label: string; value: PetKind | 'all' }[] = [
    { label: 'All', value: 'all' },
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
      gsap.from('.header-stagger', {
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
      id="products"
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
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 header-stagger">
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
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {filteredProducts.map((product) => (
            <div
              key={`${product.id}-${activeFilter}`}
              className="group relative flex flex-col rounded-2xl bg-white p-3 sm:p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-[fadeIn_0.5s_ease]"
            >
              {product.image && (
                <div className="mb-4 aspect-square w-full overflow-hidden rounded-xl bg-cream-soft relative">
                  <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-sm p-1 rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-md border border-white/20">
                    <img src="/phoenix_pets_logo.png" alt="Phoenix Pets Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
              
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-cream-soft px-2 py-1 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-charcoal/60 shrink-0">
                  {product.category}
                </span>
                <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
                  <span className="font-display font-medium text-[#1e3a8a] text-sm sm:text-base">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-[#22c55e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                      {product.discount.includes('%') || product.discount.toLowerCase().includes('off') ? product.discount : `${product.discount}% OFF`}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 mt-1 sm:mt-0">
                <h3 className="font-display text-sm sm:text-xl text-charcoal group-hover:text-charcoal transition-colors leading-tight">
                  {product.name}
                </h3>
              </div>
              
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-charcoal/5 pt-3 sm:pt-4 gap-2 sm:gap-0">
                <span className="text-xs sm:text-sm font-medium capitalize text-charcoal/50">
                  {product.kind}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-cream-soft text-charcoal transition-colors group-hover:bg-[#ff7a00] group-hover:text-white shrink-0"
                >
                  <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
