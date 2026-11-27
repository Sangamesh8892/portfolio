import { Rich } from '@/components/story/Rich';
import { agents } from '@/data/portfolio';

/** Full details for one agent, shown in the glass sheet (id: 'agent:<agent id>'). */
export default function AgentDetail({ id }) {
  const a = agents.find((x) => x.id === id);
  if (!a) return null;
  const rows = [
    ['Input → output', <><Rich text={a.io.in} /> → <Rich text={a.io.out} /></>],
    ['Before', <Rich text={a.problem} />],
    ['The person still', <Rich text={a.human} />],
    ['Client', <Rich text={a.client} />],
    ['Domain', <Rich text={a.domain} />],
    ['Deployed on', a.deployedOn.map((d, i) => <span key={d}>{i > 0 && ' · '}<Rich text={d} /></span>)],
  ];

  return (
    <div className="agent-detail">
      <span className={`ag-status${a.live ? ' is-live' : ''}`}><Rich text={a.status} /></span>
      <p className="agent-detail-lede"><Rich text={a.lede} /></p>

      <div className="agent-detail-stats">
        {a.results.map((r) => (
          <p key={r.big + r.text}><b><Rich text={r.big} /></b><Rich text={r.text} /></p>
        ))}
      </div>

      <dl className="agent-detail-rows">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <h3>How it works</h3>
      <ul className="agent-detail-steps">
        {a.howItWorks.map((s) => <li key={s}><Rich text={s} /></li>)}
      </ul>

      {a.features.length > 0 && (
        <>
          <h3>Features</h3>
          <div className="ag-chips">{a.features.map((f) => <span key={f}><Rich text={f} /></span>)}</div>
        </>
      )}

      <h3>Stack</h3>
      <div className="ag-chips">{a.stack.map((s) => <span key={s}><Rich text={s} /></span>)}</div>
    </div>
  );
}
