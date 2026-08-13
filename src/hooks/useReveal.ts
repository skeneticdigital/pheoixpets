import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealType = 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in';

interface Options {
  type?: RevealType;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

const fromVars: Record<RevealType, gsap.TweenVars> = {
  'fade-up': { y: 48, opacity: 0 },
  'fade-left': { x: -56, opacity: 0 },
  'fade-right': { x: 56, opacity: 0 },
  'scale-in': { scale: 0.92, opacity: 0 },
};

export default function useReveal<T extends HTMLElement>(options: Options = {}) {
  const ref = useRef<T | null>(null);
  const {
    type = 'fade-up',
    delay = 0,
    duration = 1.1,
    stagger,
    start = 'top 82%',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        fromVars[type],
        {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
