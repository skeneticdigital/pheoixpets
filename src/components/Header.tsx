import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { brand, nav } from '../data/content';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLUListElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { cartCount } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const searchResults = searchQuery 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kind.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

  const handleProductClick = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setMenuOpen(false);
    navigate('/shop');
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container-shell relative">
        <div
          className={`flex items-center justify-between gap-4 rounded-pill transition-all duration-500 ease-cinematic ${
            scrolled
              ? 'bg-cream/90 backdrop-blur-md border border-charcoal/10 shadow-soft px-4 py-2'
              : 'bg-transparent border-transparent px-5 py-3'
          }`}
        >
          {/* Logo */}
          <div ref={logoRef} className="flex items-center shrink-0">
            <Link to="/" className="flex items-center justify-center bg-black rounded-full p-2 w-16 h-16 md:w-20 md:h-20 shadow-sm border border-charcoal/5">
              <img src="/phoenix_pets_logo.png" alt={brand.name} className="h-full w-auto object-contain" />
            </Link>
          </div>

          {/* Nav */}
          <ul
            ref={navRef}
            className="hidden lg:flex items-center gap-1 rounded-pill px-2 py-1.5"
          >
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="px-4 py-2 rounded-pill text-sm font-medium text-charcoal/80 hover:text-[#ff7a00] hover:bg-[#ff7a00]/10 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div ref={controlsRef} className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-clay text-clay hover:bg-clay hover:text-cream transition-colors duration-300"
            >
              <Search size={16} />
            </button>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative h-10 w-10 flex items-center justify-center rounded-full border border-charcoal/10 text-charcoal/80 hover:bg-charcoal hover:text-cream transition-colors duration-300"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff7a00] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
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

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 mx-auto max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[60] animate-[fadeIn_0.2s_ease]">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search size={20} className="text-gray-400" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for products, categories, or pets..." 
                className="flex-1 bg-transparent border-none outline-none text-charcoal text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            {searchQuery && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {searchResults.map(product => (
                      <button 
                        key={product.id} 
                        onClick={handleProductClick}
                        className="w-full text-left flex items-center gap-4 p-3 rounded-xl hover:bg-cream-soft transition-colors"
                      >
                        <img src={product.image || 'https://via.placeholder.com/48'} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-charcoal font-medium text-sm truncate">{product.name}</h4>
                          <p className="text-charcoal/60 text-xs truncate">{product.category}</p>
                        </div>
                        <div className="text-[#ff7a00] font-medium text-sm flex-shrink-0">
                          {product.price}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="lg:hidden mt-3 rounded-soft bg-cream border border-charcoal/10 shadow-card p-5 animate-[fadeIn_0.3s_ease]">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 rounded-xl text-base font-medium text-charcoal/80 hover:bg-cream-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 border-t border-charcoal/10 pt-4">
              <button 
                onClick={() => { setMenuOpen(false); setIsSearchOpen(true); }}
                className="h-10 w-10 flex items-center justify-center rounded-full border border-clay text-clay hover:bg-clay hover:text-cream"
              >
                <Search size={16} />
              </button>
              <Link 
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative h-10 w-10 flex items-center justify-center rounded-full border border-charcoal/10"
              >
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff7a00] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
