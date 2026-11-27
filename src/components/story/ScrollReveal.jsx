'use client';

import { useEffect } from 'react';

/**
 * Reveals [data-reveal] text once, as it scrolls into view (styles in story.css).
 *   data-reveal         fade up out of a soft blur
 *   data-reveal="mask"  same, with a longer rise (headings)
 *   style --d: n        stagger step (110ms each)
 * Text only: fading a .glass element kills its backdrop blur until the fade ends.
 * Nothing is hidden until this runs, so without JS everything simply shows.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = [...document.querySelectorAll('[data-reveal]')];
    if (!('IntersectionObserver' in window) || !els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-shown', '');
          io.unobserve(e.target); // once: re-animating on every pass fights the reader
        }
      },
      { rootMargin: '0px 0px -20% 0px' } // fires a bit later, so the reveal happens in view
    );
    root.classList.add('reveal-on');
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.classList.remove('reveal-on');
    };
  }, []);

  return null;
}
