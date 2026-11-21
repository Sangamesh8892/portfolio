import { education, experience } from '@/data/portfolio';

/** A timeline of glass cards. */
export default function Experience() {
  return (
    <section id="experience" data-story="experience" className="story-section experience">
      <div className="experience-inner">
        <p className="eyebrow">Experience</p>
        <h2>Where I've built it</h2>
        <ol className="timeline">
          {experience.map((x) => (
            <li key={x.role + x.org} className="timeline-item">
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-card glass">
                <div className="timeline-head">
                  <b>{x.role}</b>
                  <span>{x.org}</span>
                  {x.dates && x.dates !== 'TODO' && <time>{x.dates}</time>}
                </div>
                <ul>
                  {x.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <li className="timeline-item">
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-card glass">
              <div className="timeline-head">
                <b>{education.degree}</b>
                <span>{education.school}</span>
                <time>{education.dates}</time>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
