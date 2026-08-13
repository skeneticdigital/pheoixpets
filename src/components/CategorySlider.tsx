import { categories } from '../data/content';
import useReveal from '../hooks/useReveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const categoryImages = {
  bird: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=800',
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
  pigeon: 'https://images.unsplash.com/photo-1534695941753-73cf13435eb4?auto=format&fit=crop&q=80&w=800',
  hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=800',
  rabbit: 'https://images.unsplash.com/photo-1685972296712-602ab8774bad?auto=format&fit=crop&q=80&w=800',
  guinea_pig: 'https://images.unsplash.com/photo-1612267168669-679c961c5b31?auto=format&fit=crop&q=80&w=800',
  turtle: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800',
  reptile: 'https://images.unsplash.com/photo-1619816128374-a6b4766ca92c?auto=format&fit=crop&q=80&w=800',
  rooster: 'https://images.unsplash.com/photo-1588164950715-6aa49568dd80?auto=format&fit=crop&q=80&w=800',
  mammal: 'https://images.unsplash.com/photo-1519003017532-75fb8e1d4a2e?auto=format&fit=crop&q=80&w=800',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=800',
};

export default function CategorySlider() {
  const sectionRef = useReveal<HTMLDivElement>({ type: 'fade-up', stagger: 0.15, duration: 1 });

  return (
    <section id="categories" className="py-24 md:py-32 overflow-hidden bg-zinc-800">
      <div className="container-shell mb-10 text-center text-white">
        <h2 className="font-display text-3xl md:text-4xl tracking-wide uppercase">
          Shop by Category
        </h2>
      </div>

      <div ref={sectionRef} className="container-shell relative py-8">
        {/* Navigation Buttons */}
        <button className="category-prev absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
          <ChevronLeft className="text-zinc-800 w-6 h-6" strokeWidth={3} />
        </button>
        <button className="category-next absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
          <ChevronRight className="text-zinc-800 w-6 h-6" strokeWidth={3} />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Mousewheel]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            500: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation={{
            prevEl: '.category-prev',
            nextEl: '.category-next',
          }}
          pagination={{ clickable: true, el: '.category-pagination' }}
          loop={true}
          mousewheel={{ forceToAxis: true }}
          className="w-full"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id} className="h-auto">
              <a href={`#${cat.id}`} className="block h-full bg-white group hover:-translate-y-2 transition-transform duration-300">
                <div className="p-4 bg-gray-100/50">
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={categoryImages[cat.kind as keyof typeof categoryImages]}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="p-6 text-center bg-white border-t border-gray-100">
                  <h3 className="font-sans font-bold text-lg text-zinc-900 uppercase tracking-widest mb-1">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-500">
                    {cat.productsCount} Products
                  </p>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Pagination Dots */}
        <div className="category-pagination flex justify-center gap-2 mt-12 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:cursor-pointer"></div>
      </div>
    </section>
  );
}
