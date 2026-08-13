# Furrow — Animated Pet Shop UI

A cinematic, animation-forward Pet Shop marketing site built with React + Vite + TypeScript, Tailwind CSS, GSAP (+ ScrollTrigger) and Lenis smooth scrolling.

This is **UI only** — no backend, auth, cart, or payment logic. Login/Logout, search and cart controls are visually present but not wired up.

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build      # production build → dist/
```

## Where to edit things

- **All copy, nav links, categories, products, testimonials, footer content** → `src/data/content.ts`. Everything on the page is driven from this one file.
- **Pet imagery** → the site currently ships with elegant placeholder visuals (`src/components/PetVisual.tsx`) since no photo assets were provided. Each placeholder is tagged with its intended final path (e.g. `assets/dogs/dog-01.webp`) — drop real photos into `src/assets/dogs`, `src/assets/cats`, `src/assets/birds` using those filenames, then swap `PetVisual` usages for an `<img>`/`<picture>` pointing at the new files.
- **Colors, type scale, spacing tokens** → `tailwind.config.js`.
- **Fonts** → loaded via Google Fonts in `index.html` (Fraunces for display, Plus Jakarta Sans for body, Inter for utility text).

## Structure

```
src/
 ├─ components/   Header, Hero, About, CategorySlider, Services,
 │                FeaturedPets, Testimonials, CTA, Footer, FloatingButtons,
 │                PetVisual (placeholder art)
 ├─ data/         content.ts — single source of truth for copy
 ├─ hooks/        useLenis (smooth scroll), useReveal (scroll-trigger reveals)
 └─ App.tsx
```

## Notes on the Hero slider

`Hero.tsx` implements the curved/perspective carousel: a CSS `perspective` context with each card positioned via `translateX` + `rotateY` + `scale` based on its distance from the active index, so the center card sits large and forward while side cards recede and rotate away. It supports autoplay (5s/slide, pauses on hover), drag/swipe, arrow controls and dot navigation, and respects `prefers-reduced-motion`.

## Known placeholders

- Dog/cat/bird photography — see above.
- Phone/email/address and social links in the footer are placeholder values from the brief.
- Search, cart, and login/logout are UI-only stubs.
