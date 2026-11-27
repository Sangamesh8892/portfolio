'use client';

import { Rich } from '@/components/story/Rich';
import { agents } from '@/data/portfolio';
import { openSheet } from '@/lib/sheet-store';

/** Every agent as a glass card; tapping one opens its full details in a sheet. */
export default function AgentGrid() {
  return (
    <section id="all-agents" className="agent-grid-section" aria-labelledby="all-agents-title">
      <p className="eyebrow">All agents · {agents.length}</p>
      <h2 id="all-agents-title">Every agent I’ve built</h2>
      <ul className="agent-grid">
        {agents.map((a) => {
          const lead = a.results[0];
          return (
            <li key={a.id}>
              <button type="button" className="agent-card glass" onClick={() => openSheet(`agent:${a.id}`)}>
                <span className="agent-card-top">
                  <span className={`ag-status${a.live ? ' is-live' : ''}`}><Rich text={a.status} /></span>
                  {a.featured && <span className="agent-card-flag">Featured</span>}
                </span>
                <b className="agent-card-name">{a.name}</b>
                <span className="agent-card-line"><Rich text={a.oneLiner} /></span>
                <span className="agent-card-io">
                  <Rich text={a.io.in} /> <i aria-hidden="true">→</i> <Rich text={a.io.out} />
                </span>
                <span className="agent-card-foot">
                  <span className="agent-card-stat"><b><Rich text={lead.big} /></b> <Rich text={lead.text} /></span>
                  <span className="agent-card-open" aria-hidden="true">Details →</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
