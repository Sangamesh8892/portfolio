'use client';

import MercuryToggle from '@/components/site/MercuryToggle';
import { scrollToId } from '@/components/story/SmoothScroll';
import { profile } from '@/data/portfolio';
import { openSheet } from '@/lib/sheet-store';

const LINKS = [
  ['about', 'About'],
  ['agents', 'Agents'],
  ['experience', 'Experience'],
];

/** Glass pill nav: mark, story anchors, the mercury theme switch, and Email me (opens the contact sheet). */
export default function SiteNav() {
  return (
    <nav className="site-nav glass" aria-label="Main">
      <a href="#top" className="site-mark" onClick={(e) => (e.preventDefault(), scrollToId('top'))}>
        <i>{profile.name.charAt(0)}</i>
        {profile.name}
      </a>
      <ul>
        {LINKS.map(([id, label]) => (
          <li key={id} className="hide-sm">
            <a href={`#${id}`} onClick={(e) => (e.preventDefault(), scrollToId(id))}>
              {label}
            </a>
          </li>
        ))}
        <li className="toggle">
          <MercuryToggle />
        </li>
        <li>
          <button type="button" className="cta" onClick={() => openSheet('contact')}>
            Email me
          </button>
        </li>
      </ul>
    </nav>
  );
}
