import { Plus } from 'lucide-react';
import PetVisual from './PetVisual';
import useReveal from '../hooks/useReveal';
import { useProducts } from '../context/ProductContext';

export default function FeaturedPets() {
  const gridRef = useReveal<HTMLDivElement>({ type: 'fade-up', stagger: 0.1 });
  const { products } = useProducts();

  return (
    <section id="products" className="container-shell py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
        <div>
          <span className="eyebrow">Featured</span>
          <h2 className="mt-4 font-display text-3xl md:text-[2.6rem] leading-tight">
            A few favorites.
          </h2>
        </div>
        <a href="/shop" className="btn-secondary">
          View All Products
        </a>
      </div>

      <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="relative overflow-hidden rounded-soft aspect-[4/5]">
              <PetVisual
                kind={product.kind}
                showTag={false}
                className="absolute inset-0 h-full w-full transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />
              <button
                aria-label={`Add ${product.name} to cart`}
                className="absolute bottom-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-cream text-charcoal shadow-soft opacity-0 translate-y-2 transition-all duration-400 ease-cinematic group-hover:opacity-100 group-hover:translate-y-0"
              >
                <Plus size={17} />
              </button>
            </div>
            <p className="mt-4 text-xs uppercase tracking-eyebrow text-charcoal/45">
              {product.category}
            </p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="font-display text-lg">{product.name}</h3>
              <span className="text-sm font-semibold text-clay">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
