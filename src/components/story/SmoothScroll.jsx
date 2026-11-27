'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';
import { getStory, setStory } from '@/lib/story-store';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/** Smooth-scroll to a section id (falls back to native scroll when Lenis is off). */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'top' ? 0 : -80 });
  else el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

/** Smooth-scroll to an absolute page offset (used to jump inside pinned sections). */
export function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: 'auto' });
}

/**
 * Lenis smooth scroll wired to GSAP ScrollTrigger, plus story tracking:
 * every [data-story] section writes { section, progress } while it is in view.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStory({ section: 'hero', progress: 0 });
    let idle = 0;
    const onScroll = () => {
      if (!getStory().scrolling) setStory({ scrolling: true });
      clearTimeout(idle);
      idle = window.setTimeout(() => setStory({ scrolling: false }), 180);
    };

    let tick = null;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      lenis.on('scroll', onScroll);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const triggers = [...document.querySelectorAll('[data-story]')].map((el) => {
      const section = el.dataset.story;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setStory({ section });
        },
        onUpdate: (self) => {
          if (self.isActive) setStory({ section, progress: self.progress });
        },
      });
    });
    ScrollTrigger.refresh();

    if (process.env.NODE_ENV !== 'production') window.__story = getStory;

    let raf = 0;
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      raf = requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(document.getElementById(id) ?? 0, { immediate: true, offset: -80 });
        else document.getElementById(id)?.scrollIntoView();
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      triggers.forEach((t) => t.kill());
      window.removeEventListener('scroll', onScroll);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return children;
}
