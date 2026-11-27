'use client';

import { ICONS } from '@/components/site/icons';
import { hero, questionDrawer, quickQuestions } from '@/data/portfolio';
import { openSheet } from '@/lib/sheet-store';

const questionCount = new Set([
  ...questionDrawer.categories.flatMap((c) => c.questions),
  ...quickQuestions.map((q) => q.question),
]).size;

/** B2 hero: memoji, headline, and the five glass tiles (they become the sticky dock on scroll). */
export default function Hero() {
  return (
    <section id="top" data-story="hero" className="hero story-hero" data-enter>
      <div className="hero-avatar glass">
        <img src={hero.avatarImage} alt="Sangamesh's memoji" width={156} height={156} />
      </div>

      <span className="hero-notice glass">
        <span className="hero-dot" />
        {hero.notice}
      </span>

      <h1>
        <span className="h1-line">{hero.titleLine}</span>
        <span className="h1-line">
          {hero.titleLead} <em>{hero.titleEmphasis}</em>
        </span>
      </h1>

      <p className="hero-lead">{hero.lead}</p>

      <div className="tiles" data-hero-tiles>
        {quickQuestions.map(({ label, hint, answerId, color, icon }, i) => {
          const Icon = ICONS[icon];
          return (
            <button
              key={label}
              type="button"
              className={`tile glass ${i === 0 ? 'main' : ''}`}
              data-icon={icon}
              style={i === 0 ? { '--i': i } : { '--c': color, '--i': i }}
              onClick={() => openSheet(answerId)}
            >
              <span className="tile-ic">
                {/* two layers: the intro animates the svg, hover animates the wrapper */}
                <span className="tile-ic-g">
                  <Icon size={19} strokeWidth={2} />
                </span>
              </span>
              <span>
                <b>{label}</b>
                <small>{hint}</small>
              </span>
            </button>
          );
        })}
      </div>

      <span className="hero-more">
        or browse{' '}
        <button type="button" className="link-btn" onClick={() => openSheet('questions')}>
          all {questionCount} questions
        </button>{' '}
        →
      </span>
    </section>
  );
}
