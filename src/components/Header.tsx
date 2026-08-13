import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Search, ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { brand, nav } from '../data/content';

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLUListElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl = gsap.timeline({ delay: reduceMotion ? 0 : 0.3, defaults: { ease: 'power3.out' } });

    tl.fromTo(headerRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.9 })
      .fromTo(logoRef.current, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
      .fromTo(
        navRef.current ? Array.from(navRef.current.children) : [],
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 },
        '-=0.4'
      )
      .fromTo(controlsRef.current, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.5');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container-shell">
        <div
          className={`flex items-center justify-between gap-4 rounded-pill border transition-all duration-500 ease-cinematic ${
            scrolled
              ? 'bg-cream/80 backdrop-blur-md border-charcoal/10 shadow-soft px-4 py-2'
              : 'bg-cream/40 backdrop-blur-sm border-transparent px-5 py-3'
          }`}
        >
          {/* Logo */}
          <div ref={logoRef} className="flex items-center shrink-0">
            <img src="/phoenix_pets_logo.jpg" alt={brand.name} className="h-16 w-auto object-contain mix-blend-multiply" />
          </div>

          {/* Nav */}
          <ul
            ref={navRef}
            className="hidden lg:flex items-center gap-1 rounded-pill px-2 py-1.5"
          >
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="px-4 py-2 rounded-pill text-sm font-medium text-charcoal/80 hover:text-[#ff7a00] hover:bg-[#ff7a00]/10 transition-colors duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div ref={controlsRef} className="hidden md:flex items-center gap-2 shrink-0">
            <button
              aria-label="Search"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-clay text-clay hover:bg-clay hover:text-cream transition-colors duration-300"
            >
              <Search size={16} />
            </button>
            <button
              aria-label="Cart"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-charcoal/10 text-charcoal/80 hover:bg-charcoal hover:text-cream transition-colors duration-300"
            >
              <ShoppingBag size={16} />
            </button>
            <button
              onClick={() => setLoggedIn((v) => !v)}
              className="ml-1 inline-flex items-center gap-2 rounded-pill bg-charcoal text-cream px-4 py-2.5 text-sm font-semibold hover:bg-gold hover:text-charcoal transition-colors duration-300"
            >
              {loggedIn ? (
                <>
                  <LogOut size={15} /> Logout
                </>
              ) : (
                <>
                  <User size={15} /> Login
                </>
              )}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full border border-charcoal/10"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="lg:hidden mt-3 rounded-soft bg-cream border border-charcoal/10 shadow-card p-5 animate-[fadeIn_0.3s_ease]">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 rounded-xl text-base font-medium text-charcoal/80 hover:bg-cream-soft"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 border-t border-charcoal/10 pt-4">
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-clay text-clay hover:bg-clay hover:text-cream">
                <Search size={16} />
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-charcoal/10">
                <ShoppingBag size={16} />
              </button>
              <button
                onClick={() => setLoggedIn((v) => !v)}
                className="ml-auto inline-flex items-center gap-2 rounded-pill bg-charcoal text-cream px-4 py-2.5 text-sm font-semibold"
              >
                {loggedIn ? (
                  <>
                    <LogOut size={15} /> Logout
                  </>
                ) : (
                  <>
                    <User size={15} /> Login
                  </>
                )}
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
