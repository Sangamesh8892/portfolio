import { about, hero, profile } from '@/data/portfolio';

/** Story text on the left, a glass profile card on the right. */
export default function About() {
  return (
    <section id="about" data-story="about" className="story-section split about">
      <div className="split-text">
        <p className="eyebrow">About</p>
        <h2>{about.lead}</h2>
        {about.body.map((p) => (
          <p key={p} className="story-body">
            {p}
          </p>
        ))}
      </div>

      <aside className="about-card glass" aria-label="Quick facts">
        <div className="about-card-head">
          <img src={hero.avatarImage} alt="" width={56} height={56} />
          <div>
            <b>{profile.name}</b>
            <small>{profile.subtitle}</small>
          </div>
        </div>
        <dl className="about-facts">
          {about.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </section>
  );
}
