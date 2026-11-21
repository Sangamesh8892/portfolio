'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { mvp } from '@/data/portfolio';
import { setStory } from '@/lib/story-store';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The HITL SAP Automation Platform as five stations.
 * ≥768px: pinned for 3 screens of scroll; progress lights stations, then their
 * human checkpoints, then the side groups. The 3D agent core rides the measured track.
 * <768px: no pin, the same progress while scrolling past.
 * Reduced motion: everything lit, nothing pinned.
 */
export default function MvpPipeline() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const stations = [...el.querySelectorAll('[data-station]')];
      const groups = [...el.querySelectorAll('[data-group]')];
      const outcome = el.querySelector('[data-outcome]');
      const dots = el.querySelectorAll('[data-dot]');
      const n = stations.length;

      const apply = (p) => {
        stations.forEach((s, i) => {
          s.toggleAttribute('data-lit', p >= i / n - 1e-6);
          s.toggleAttribute('data-checked', p >= (i + 0.6) / n);
        });
        groups.forEach((g, j) => g.toggleAttribute('data-shown', p >= 0.1 + j * 0.2));
        outcome.toggleAttribute('data-shown', p >= 0.85);
        el.style.setProperty('--mvp-p', p.toFixed(4));
      };
      // first/last station dots in NDC, so the 3D core lines up with the layout at any size
      const ndc = (r) => [
        ((r.left + r.width / 2) / window.innerWidth) * 2 - 1,
        -(((r.top + r.height / 2) / window.innerHeight) * 2 - 1),
      ];
      const measure = () => {
        const [x0, y0] = ndc(dots[0].getBoundingClientRect());
        const [x1, y1] = ndc(dots[dots.length - 1].getBoundingClientRect());
        return { x0, y0, x1, y1 };
      };
      const onUpdate = (self) => {
        apply(self.progress);
        setStory({ section: 'work', progress: self.progress, track: measure() });
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        apply(1);
        return;
      }
      apply(0);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=300%', pin: true, anticipatePin: 1, onUpdate });
      });
      mm.add('(max-width: 767px)', () => {
        ScrollTrigger.create({ trigger: el, start: 'top 65%', end: 'bottom 70%', onUpdate });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="work" data-story="work" className="story-section mvp" ref={root}>
      <div className="mvp-inner">
        <header className="mvp-head">
          <p className="eyebrow">The MVP</p>
          <h2>{mvp.name}</h2>
          <p className="story-body">{mvp.intro}</p>
        </header>

        <div className="mvp-pipeline">
          <span className="mvp-track" aria-hidden="true">
            <span className="mvp-track-fill" />
          </span>
          <ol className="mvp-stations">
            {mvp.stations.map((s, i) => (
              <li key={s.id} data-station={i} className={`station glass ${s.id === 'tsd' ? 'is-core' : ''}`}>
                <span className="station-n">{String(i + 1).padStart(2, '0')}</span>
                <b>{s.label}</b>
                <small className="station-agent">{s.agent}</small>
                <p>{s.does}</p>
                <span className="checkpoint">Human checkpoint ✓</span>
                <span className="station-dot" data-dot aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>

        <div className="mvp-groups">
          {mvp.groups.map((g) => (
            <div key={g.title} data-group className="group glass">
              <small>{g.title}</small>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
          <ul data-outcome className="outcome">
            {mvp.outcome.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
