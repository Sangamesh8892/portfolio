'use client';

import { useEffect, useRef } from 'react';
import { glassMap } from '@/lib/glass-map';

/*
 * Glass runtime for every .glass element:
 * - Chromium: each element gets its own SVG filter, built from a bevel map
 *   sized to it (src/lib/glass-map.js). The backdrop bends only along the thick
 *   rounded edge, and R/G/B bend by slightly different amounts, which leaves
 *   rainbow fringes at the rim (dispersion). The middle stays clear.
 * - Other browsers: plain frosted blur (html.no-refract).
 * - The sheen on every .glass surface follows the pointer.
 * - #mercury-goo: lets the theme toggle's droplets merge like liquid metal.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const MAP_SCALE = 0.5; // maps are built at half resolution and stretched

function mapUrl(w, h, radius, bevel) {
  const mw = Math.max(2, Math.ceil(w * MAP_SCALE));
  const mh = Math.max(2, Math.ceil(h * MAP_SCALE));
  const m = glassMap(mw, mh, { radius: radius * MAP_SCALE, bevel: bevel * MAP_SCALE });
  const canvas = document.createElement('canvas');
  canvas.width = m.width;
  canvas.height = m.height;
  canvas.getContext('2d').putImageData(new ImageData(m.data, m.width, m.height), 0, 0);
  return canvas.toDataURL('image/png');
}

function channel(defs, filter, scale, keep, result) {
  const d = document.createElementNS(SVG_NS, 'feDisplacementMap');
  d.setAttribute('in', 'SourceGraphic');
  d.setAttribute('in2', 'map');
  d.setAttribute('scale', String(scale));
  d.setAttribute('xChannelSelector', 'R');
  d.setAttribute('yChannelSelector', 'G');
  d.setAttribute('result', `${result}d`);
  const c = document.createElementNS(SVG_NS, 'feColorMatrix');
  c.setAttribute('in', `${result}d`);
  c.setAttribute('type', 'matrix');
  const rows = [0, 1, 2].map((i) => (i === keep ? [0, 0, 0, 0, 0].map((_, j) => (j === i ? 1 : 0)) : [0, 0, 0, 0, 0]));
  c.setAttribute('values', [...rows.flat(), 0, 0, 0, 1, 0].join(' '));
  c.setAttribute('result', result);
  filter.append(d, c);
}

export default function GlassRuntime() {
  const defsRef = useRef(null);

  useEffect(() => {
    const brands = navigator.userAgentData?.brands ?? [];
    const isChromium = brands.some((b) => /Chromium/.test(b.brand));
    const root = document.documentElement;
    root.classList.toggle('no-refract', !isChromium);

    // pointer sheen
    const onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest('.glass') : null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    if (!isChromium) return () => document.removeEventListener('pointermove', onMove);

    // per-element bevel filters
    const defs = defsRef.current;
    const style = document.createElement('style');
    style.dataset.glass = '';
    document.head.appendChild(style);
    const known = new Map(); // element -> { id, key }
    let seq = 0;
    const pending = new Set();
    let raf = 0;

    const build = (el) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w < 4 || h < 4) return;
      const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      const bevel = Math.max(8, Math.min(22, radius * 0.9, h / 2));
      const key = `${w}x${h}r${Math.round(radius)}`;
      let rec = known.get(el);
      if (rec && rec.key === key) return;
      if (!rec) {
        rec = { id: `glass-${++seq}`, key: '' };
        known.set(el, rec);
        el.dataset.glassId = rec.id;
      }
      rec.key = key;

      const scale = Math.round(bevel * 1.7);
      const f = document.createElementNS(SVG_NS, 'filter');
      f.id = rec.id;
      for (const [k, v] of Object.entries({ x: 0, y: 0, width: w, height: h, filterUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' })) {
        f.setAttribute(k, String(v));
      }
      const img = document.createElementNS(SVG_NS, 'feImage');
      for (const [k, v] of Object.entries({ x: 0, y: 0, width: w, height: h, preserveAspectRatio: 'none', result: 'map' })) {
        img.setAttribute(k, String(v));
      }
      img.setAttribute('href', mapUrl(w, h, radius, bevel));
      f.append(img);
      // dispersion: red bends most, blue least
      channel(defs, f, scale, 0, 'r');
      channel(defs, f, Math.round(scale * 0.9), 1, 'g');
      channel(defs, f, Math.round(scale * 0.8), 2, 'b');
      const rg = document.createElementNS(SVG_NS, 'feBlend');
      rg.setAttribute('in', 'r');
      rg.setAttribute('in2', 'g');
      rg.setAttribute('mode', 'screen');
      rg.setAttribute('result', 'rg');
      const rgb = document.createElementNS(SVG_NS, 'feBlend');
      rgb.setAttribute('in', 'rg');
      rgb.setAttribute('in2', 'b');
      rgb.setAttribute('mode', 'screen');
      f.append(rg, rgb);
      defs.querySelector(`#${rec.id}`)?.remove();
      defs.append(f);
      writeStyle();
    };

    const writeStyle = () => {
      style.textContent = [...known.values()]
        .map(({ id }) => `[data-glass-id="${id}"]::before{filter:url(#${id})}`)
        .join('\n');
    };

    const flush = () => {
      raf = 0;
      pending.forEach((el) => (el.isConnected ? build(el) : forget(el)));
      pending.clear();
    };
    const queue = (el) => {
      pending.add(el);
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const forget = (el) => {
      const rec = known.get(el);
      if (!rec) return;
      defs.querySelector(`#${rec.id}`)?.remove();
      known.delete(el);
      resize.unobserve(el);
      writeStyle();
    };

    const resize = new ResizeObserver((entries) => entries.forEach((e) => queue(e.target)));
    const track = (el) => {
      if (known.has(el) || pending.has(el)) return;
      resize.observe(el);
      queue(el);
    };
    document.querySelectorAll('.glass').forEach(track);
    const mutations = new MutationObserver((list) => {
      for (const m of list) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.classList.contains('glass')) track(n);
          n.querySelectorAll?.('.glass').forEach(track);
        });
        m.removedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (known.has(n)) forget(n);
          n.querySelectorAll?.('.glass').forEach((el) => known.has(el) && forget(el));
        });
        if (m.type === 'attributes' && m.target.classList?.contains('glass')) track(m.target);
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      resize.disconnect();
      mutations.disconnect();
      style.remove();
      defs.replaceChildren();
    };
  }, []);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs ref={defsRef} />
      <filter id="mercury-goo" x="-30%" y="-60%" width="160%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </svg>
  );
}
