import { PawPrint, Phone, Mail, MapPin } from 'lucide-react';
import { brand, footerContent } from '../data/content';

// lucide-react no longer ships brand marks, so simple inline glyphs stand in.
function FacebookGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.7c0-1 .3-1.7 1.8-1.7H16.6V2.8C16.1 2.7 15 2.6 13.8 2.6c-2.6 0-4.4 1.6-4.4 4.5v2.9H6.9V13.5h2.5V22h4.1Z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9.2 15 12l-5 2.8V9.2Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-sky pt-28 pb-8">
      {/* Flowing wave shapes */}
      <svg
        className="absolute top-0 left-0 w-full h-40 -translate-y-1/2"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,120 C240,180 480,40 720,90 C960,140 1200,60 1440,110 L1440,200 L0,200 Z"
          fill="#CFE4EA"
          opacity="0.6"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -bottom-10 -right-20 w-[560px] h-[560px] opacity-40"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="100" fill="#B9D8E1" />
      </svg>
      <svg
        className="pointer-events-none absolute -top-24 -left-24 w-[380px] h-[380px] opacity-30"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="100" fill="#CFE4EA" />
      </svg>

      <div className="container-shell relative">
        <div className="grid md:grid-cols-4 gap-12 pb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-6">
              <img src="/phoenix_pets_logo.jpg" alt={brand.name} className="h-20 w-auto object-contain rounded-xl mix-blend-multiply" />
            </div>
            <p className="text-sm text-charcoal/65 leading-relaxed max-w-xs">
              {footerContent.description}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[FacebookGlyph, InstagramGlyph, YoutubeGlyph].map((Glyph, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-charcoal hover:bg-charcoal hover:text-cream transition-colors duration-300"
                >
                  <Glyph />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {footerContent.quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-sm text-charcoal/65 hover:text-charcoal transition-colors duration-300"
                  >
                    <PawPrint size={12} className="text-clay shrink-0" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg mb-5">Categories</h4>
            <ul className="space-y-3">
              {footerContent.categoryLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-sm text-charcoal/65 hover:text-charcoal transition-colors duration-300"
                  >
                    <PawPrint size={12} className="text-clay shrink-0" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-white mt-1">
                  <Phone size={15} />
                </span>
                <div className="flex flex-col gap-1 mt-1.5">
                  {Array.isArray(footerContent.contact.phone) ? (
                    footerContent.contact.phone.map((p, i) => (
                      <a key={i} href={`tel:${p.replace(/\s+/g, '')}`} className="text-sm text-charcoal/65 hover:text-[#ff7a00] transition-colors">{p}</a>
                    ))
                  ) : (
                    <a href={`tel:${footerContent.contact.phone.replace(/\s+/g, '')}`} className="text-sm text-charcoal/65 hover:text-[#ff7a00] transition-colors">{footerContent.contact.phone}</a>
                  )}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-white">
                  <Mail size={15} />
                </span>
                <span className="text-sm text-charcoal/65">{footerContent.contact.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-white">
                  <MapPin size={15} />
                </span>
                <span className="text-sm text-charcoal/65">{footerContent.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dashed border-charcoal/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-charcoal/55">
          <p>{footerContent.bottom.copyright}</p>
          <p className="flex items-center gap-3">
            {footerContent.bottom.links.map((link, i) => (
              <span key={link} className="flex items-center gap-3">
                <a href="#" className="hover:text-charcoal transition-colors">
                  {link}
                </a>
                {i < footerContent.bottom.links.length - 1 && <span>|</span>}
              </span>
            ))}
          </p>
          <p>{footerContent.bottom.credit}</p>
        </div>
      </div>
    </footer>
  );
}
