import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { heroContent } from '../data/content';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const pet1Ref = useRef<HTMLImageElement>(null);
  const pet2Ref = useRef<HTMLImageElement>(null);
  const pet3Ref = useRef<HTMLImageElement>(null);
  const pet4Ref = useRef<HTMLImageElement>(null);
  const pet5Ref = useRef<HTMLImageElement>(null);
  const pet6Ref = useRef<HTMLImageElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl = gsap.timeline();

    if (reduceMotion) {
      if (preloaderRef.current) preloaderRef.current.style.display = 'none';
      gsap.set(heroContentRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Preloader animation: birds/pets moving slowly then disappearing
    tl.set(document.body, { overflow: 'hidden' })
      .fromTo(
        pet1Ref.current,
        { x: '-50vw', y: '-40vh', rotation: -15, opacity: 0 },
        { x: '-20vw', y: '-20vh', rotation: 5, opacity: 1, duration: 2.5, ease: 'power2.out' }
      )
      .fromTo(
        pet2Ref.current,
        { x: '50vw', y: '-40vh', rotation: 15, opacity: 0 },
        { x: '20vw', y: '-15vh', rotation: -5, opacity: 1, duration: 2.5, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(
        pet3Ref.current,
        { x: '-50vw', y: '40vh', rotation: -25, opacity: 0 },
        { x: '-15vw', y: '20vh', rotation: 10, opacity: 1, duration: 2.5, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(
        pet4Ref.current,
        { x: '50vw', y: '40vh', rotation: 25, opacity: 0 },
        { x: '25vw', y: '15vh', rotation: -10, opacity: 1, duration: 2.5, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(
        pet5Ref.current,
        { x: '-20vw', y: '0vh', rotation: 0, opacity: 0 },
        { x: '-5vw', y: '5vh', rotation: 15, opacity: 1, duration: 2.5, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(
        pet6Ref.current,
        { x: '20vw', y: '0vh', rotation: -10, opacity: 0 },
        { x: '10vw', y: '-5vh', rotation: -15, opacity: 1, duration: 2.5, ease: 'power2.out' },
        '<0.2'
      )
      .to([pet1Ref.current, pet2Ref.current, pet3Ref.current, pet4Ref.current, pet5Ref.current, pet6Ref.current], {
        y: '-100vh',
        opacity: 0,
        duration: 1.5,
        ease: 'power3.in',
        stagger: 0.1,
      }, '+=1')
      .to(preloaderRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          if (preloaderRef.current) preloaderRef.current.style.display = 'none';
          gsap.set(document.body, { overflow: '' });
        },
      })
      // Reveal hero slowly
      .fromTo(
        heroContentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 2, ease: 'power3.out' },
        '-=0.5'
      );

  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-32 pb-16 md:pt-40"
    >
      {/* Preloader */}
      <div
        ref={preloaderRef}
        className="fixed inset-0 z-[60] bg-cream flex items-center justify-center overflow-hidden"
      >
        <img
          ref={pet1Ref}
          src="https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&q=80&w=400"
          alt="Bird"
          className="absolute w-32 h-32 md:w-56 md:h-56 object-cover rounded-full shadow-2xl border-4 border-white"
        />
        <img
          ref={pet2Ref}
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400"
          alt="Cat"
          className="absolute w-40 h-40 md:w-64 md:h-64 object-cover rounded-full shadow-2xl border-4 border-white"
        />
        <img
          ref={pet3Ref}
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400"
          alt="Dog"
          className="absolute w-36 h-36 md:w-48 md:h-48 object-cover rounded-full shadow-2xl border-4 border-white"
        />
        <img
          ref={pet4Ref}
          src="https://images.unsplash.com/photo-1685972296712-602ab8774bad?auto=format&fit=crop&q=80&w=400"
          alt="Rabbit"
          className="absolute w-28 h-28 md:w-40 md:h-40 object-cover rounded-full shadow-2xl border-4 border-white"
        />
        <img
          ref={pet5Ref}
          src="https://images.unsplash.com/photo-1534695941753-73cf13435eb4?auto=format&fit=crop&q=80&w=400"
          alt="Pigeon"
          className="absolute w-32 h-32 md:w-52 md:h-52 object-cover rounded-full shadow-2xl border-4 border-white"
        />
        <img
          ref={pet6Ref}
          src="https://cdn.corenexis.com/f/s2Z2Rkrt3CJ.jpg"
          alt="Reptile"
          className="absolute w-24 h-24 md:w-44 md:h-44 object-cover rounded-full shadow-2xl border-4 border-white"
        />
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        <img
          src="https://cdn.corenexis.com/f/Vfq4PupHfWN.jpeg"
          alt="Pets background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Slight dark overlay to make white text pop */}
      </div>

      <div className="container-shell h-full flex flex-col justify-center items-center relative z-10 px-6 sm:px-10 lg:px-12 mt-12">
        <div ref={heroContentRef} className="max-w-4xl flex flex-col items-center text-center">
          <p className="text-white font-medium tracking-[0.2em] uppercase text-sm mb-4 drop-shadow-md">
            {heroContent.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 drop-shadow-lg leading-tight whitespace-nowrap">
            {heroContent.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-md">
            {heroContent.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent border-2 border-white rounded-full hover:bg-white/10 transition-colors shadow-lg"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
