'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { ICONS } from '@/components/site/icons';
import { dock } from '@/data/portfolio';
import { openSheet } from '@/lib/sheet-store';
import { getStory, subscribeStory } from '@/lib/story-store';

const getScrolling = () => getStory().scrolling;

/**
 * Sticky footer dock with the same five as the hero tiles.
 * It stays tucked away while the hero tiles are on screen, slides up once they
 * scroll off, and eases down a little while the page is moving. Always clickable when shown.
 */
export default function GlassDock() {
  const scrolling = useSyncExternalStore(subscribeStory, getScrolling, () => false);
  const [tilesVisible, setTilesVisible] = useState(true);

  useEffect(() => {
    const tiles = document.querySelector('[data-hero-tiles]');
    if (!tiles) {
      setTilesVisible(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setTilesVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(tiles);
    return () => io.disconnect();
  }, []);

  const hidden = tilesVisible;
  return (
    <nav
      className={`dock glass ${scrolling ? 'is-scrolling' : ''} ${hidden ? 'is-hidden' : ''}`}
      aria-label="Quick questions"
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
    >
      {dock.map(({ id, label, icon }) => {
        const Icon = ICONS[icon];
        return (
          <button key={id} type="button" className="dock-item" onClick={() => openSheet(id)} aria-label={label}>
            <Icon size={18} strokeWidth={2} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
