'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useRef } from 'react';
import { scrollToY } from '@/components/story/SmoothScroll';
import { agents } from '@/data/portfolio';
import { richParts } from '@/lib/rich-text';
import { setStory } from '@/lib/story-store';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n) => String(n).padStart(2, '0');

/** Copy with **bold** and [placeholder] support (see src/lib/rich-text.js). */
function Rich({ text }) {
  return richParts(text).map((p, i) =>
    p.type === 'bold' ? (
      <b key={i}>{p.text}</b>
    ) : p.type === 'placeholder' ? (
      <em key={i} className="ph">{p.text}</em>
    ) : (
      <Fragment key={i}>{p.text}</Fragment>
    )
  );
}

function Bar({ file }) {
  return (
    <div className="ag-bar">
      <span className="ag-dots" aria-hidden="true"><b /><b /><b /></span>
      {file}
      <span className="ag-hint">illustrative</span>
    </div>
  );
}

/* ── demos: one per kind of agent. data-a marks what the timeline animates ── */

function TsdDemo() {
  const secs = [['Design pattern', 'KB'], ['Object names', 'STD'], ['Data source', 'ADT'], ['Error handling', 'KB']];
  return (
    <>
      <Bar file="fsd_to_tsd" />
      <div className="ag-stage">
        <div className="ag-tsd">
          <div className="ag-card" data-a="in">
            <span className="ag-lbl">Functional spec</span>
            {[90, 75, 84, 60, 70].map((w) => <i key={w} className="ag-line" style={{ width: `${w}%` }} />)}
          </div>
          <span className="ag-arrow" data-a="arrow" aria-hidden="true">→</span>
          <div className="ag-card">
            <span className="ag-lbl">Technical spec</span>
            {secs.map(([label, cite]) => (
              <div key={label} className="ag-sec" data-a="sec">
                {label} <span className="ag-cite">{cite}</span>
              </div>
            ))}
          </div>
        </div>
        <div data-a="meterwrap">
          <div className="ag-lbl">First-draft accuracy · 80–90%</div>
          <div className="ag-meter"><i data-a="meter" /></div>
        </div>
      </div>
    </>
  );
}

const EDIT_PROMPT = 'Make the error handling stricter: log and stop on failure.';
function EditDemo() {
  return (
    <>
      <Bar file="TSD_draft.docx" />
      <div className="ag-stage">
        <div className="ag-prompt" data-a="prompt">
          <em aria-hidden="true">›</em>
          <span data-type={EDIT_PROMPT}>{EDIT_PROMPT}</span>
        </div>
        <div className="ag-para is-quiet">1 · Design pattern: daily background job.</div>
        <div className="ag-para is-quiet">2 · Objects follow the client naming standard.</div>
        <div className="ag-para" data-a="target">
          3 · Error handling: <span className="ag-old" data-a="old">empty results are skipped silently.</span>{' '}
          <span className="ag-new" data-a="new">failures are logged and the run stops for review.</span>
        </div>
        <div className="ag-para is-quiet">4 · Output sent to the collections team.</div>
        <div className="ag-badge" data-a="badge">edited in place · 1 section · nothing regenerated</div>
      </div>
    </>
  );
}

function RouteDemo() {
  const lanes = [
    ['SAP AI Core', 'auth · token refreshed', 'auth ✓'],
    ['Azure', 'regional deployment', 'ready'],
    ['Google Cloud', 'fallback', 'ready'],
  ];
  return (
    <>
      <Bar file="model_router" />
      <div className="ag-stage">
        <div className="ag-route">
          <div className="ag-card ag-req" data-a="in">
            <span className="ag-lbl">Request</span>
            task: draft_tsd<br />needs: long context<br />policy: client data stays in region
          </div>
          <div className="ag-lanes">
            {lanes.map(([name, note, state]) => (
              <div key={name} className="ag-lane" data-a="lane">
                <span>{name}<small>{note}</small></span>
                <span className="ag-auth">{state}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ag-badge" data-a="badge">routed → SAP AI Core · same interface for every agent</div>
      </div>
    </>
  );
}

const CHUNKS = [
  ['Naming standard §4: classes', 0.9, 0.85, true],
  ['FI report pattern: playbook', 0.45, 0.9, true],
  ['Coding standard: exceptions', 0.3, 0.55, false],
  ['Old spec: invoice report', 0.7, 0.4, true],
  ['Glossary: FI terms', 0.2, 0.3, false],
];
function RetrievalDemo() {
  return (
    <>
      <Bar file="retrieve" />
      <div className="ag-stage">
        <div className="ag-query" data-a="in">“naming rules for FI report classes”</div>
        <div className="ag-cols" data-a="in" aria-hidden="true"><span>chunk</span><span>bm25</span><span>semantic</span></div>
        <div className="ag-chunks">
          {CHUNKS.map(([text, bm25, sem, top]) => (
            <div key={text} className="ag-chunk" data-a="chunk" data-top={top ? '1' : '0'}>
              <span>{text}</span>
              <span className="ag-score"><i data-b={bm25} style={{ '--b': bm25 }} /></span>
              <span className="ag-score"><i data-b={sem} style={{ '--b': sem }} /></span>
            </div>
          ))}
        </div>
        <div className="ag-badge" data-a="badge">reranked → top 3 kept · tight token budget</div>
      </div>
    </>
  );
}

function GenericDemo({ agent }) {
  const lines = agent.output?.lines ?? ['[what comes out]'];
  return (
    <>
      <Bar file={agent.file ?? agent.id} />
      <div className="ag-stage">
        <div className="ag-gen">
          <div className="ag-card" data-a="in">
            <span className="ag-lbl">{agent.input?.label ?? 'Input'}</span>
            <p><Rich text={agent.input?.text ?? '[what goes in]'} /></p>
          </div>
          <span className="ag-arrow" data-a="arrow" aria-hidden="true">→</span>
          <div className="ag-card">
            <span className="ag-lbl">{agent.output?.label ?? 'Output'}</span>
            <ul>{lines.map((l) => <li key={l} data-a="sec"><Rich text={l} /></li>)}</ul>
          </div>
        </div>
      </div>
    </>
  );
}

const DEMOS = { tsd: TsdDemo, edit: EditDemo, route: RouteDemo, retrieval: RetrievalDemo, generic: GenericDemo };

/* ── choreography: each chapter owns timeline time [i, i + 1) ── */

const $$ = (root, sel) => [...root.querySelectorAll(sel)];

function fadeUp(tl, els, at, step = 0.04, d = 0.08) {
  els.forEach((el, k) => tl.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: d }, at + k * step));
}
function pop(tl, els, at) {
  tl.fromTo(els, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'back.out(2.5)' }, at);
}

const PLAY = {
  tsd(c, tl, t) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.16);
    tl.fromTo($$(c, '[data-a="in"] .ag-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.06, stagger: 0.02 }, t + 0.2);
    tl.fromTo($$(c, '[data-a="arrow"]'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.05 }, t + 0.3);
    fadeUp(tl, $$(c, '[data-a="sec"]'), t + 0.34, 0.07);
    tl.fromTo($$(c, '.ag-cite'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(3)', stagger: 0.07 }, t + 0.4);
    fadeUp(tl, $$(c, '[data-a="meterwrap"]'), t + 0.62);
    tl.fromTo($$(c, '[data-a="meter"]'), { scaleX: 0 }, { scaleX: 0.86, duration: 0.14, ease: 'power3.out' }, t + 0.64);
  },
  edit(c, tl, t, { type, mark }) {
    fadeUp(tl, $$(c, '.ag-para'), t + 0.14, 0.03);
    fadeUp(tl, $$(c, '[data-a="prompt"]'), t + 0.22);
    type(c.querySelector('[data-type]'), t + 0.26, 0.22);
    mark(c.querySelector('[data-a="target"]'), t + 0.5, 'is-hit');
    mark(c.querySelector('[data-a="old"]'), t + 0.54, 'is-struck');
    tl.fromTo($$(c, '[data-a="new"]'), { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.08 }, t + 0.6);
    pop(tl, $$(c, '[data-a="badge"]'), t + 0.7);
  },
  route(c, tl, t, { mark }) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.16);
    const lanes = $$(c, '[data-a="lane"]');
    fadeUp(tl, lanes, t + 0.24, 0.05);
    mark(lanes[0], t + 0.42, 'is-picked');
    lanes.slice(1).forEach((l) => mark(l, t + 0.5, 'is-dim'));
    pop(tl, $$(c, '[data-a="badge"]'), t + 0.6);
  },
  retrieval(c, tl, t, { mark }) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.14);
    const chunks = $$(c, '[data-a="chunk"]');
    fadeUp(tl, chunks, t + 0.22, 0.03);
    chunks.forEach((ch, k) =>
      $$(ch, '.ag-score i').forEach((bar, j) =>
        tl.fromTo(bar, { scaleX: 0 }, { scaleX: Number(bar.dataset.b), duration: 0.08 }, t + 0.32 + j * 0.06 + k * 0.015)
      )
    );
    chunks.forEach((ch) => mark(ch, t + 0.56, ch.dataset.top === '1' ? 'is-picked' : 'is-dim'));
    pop(tl, $$(c, '[data-a="badge"]'), t + 0.66);
  },
  generic(c, tl, t) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.16);
    tl.fromTo($$(c, '[data-a="arrow"]'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.05 }, t + 0.3);
    fadeUp(tl, $$(c, '[data-a="sec"]'), t + 0.36, 0.07);
  },
};

/**
 * Agents I've built: one pinned chapter per agent (src/data/portfolio.js → agents).
 * Scroll scrubs each chapter's live demo, then hands over to the next agent.
 * Without JS, or under reduced motion, the chapters simply stack, fully shown.
 */
export default function AgentChapters() {
  const root = useRef(null);
  const trigger = useRef(null);
  const n = agents.length;

  useGSAP(
    () => {
      const el = root.current;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      el.classList.add('is-pinned');

      const chapters = $$(el, '.ag-chapter');
      const tabs = $$(el, '.ag-tab');
      const tabBox = el.querySelector('.ag-tabs');
      const countEl = el.querySelector('[data-count]');
      const marks = []; // { el, at, cls }: class on while timeline time >= at (scrubs both ways)
      const typed = []; // { el, full }: restored on cleanup

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onUpdate: sync });
      const helpers = {
        mark: (node, at, cls) => node && marks.push({ el: node, at, cls }),
        type: (node, at, dur) => {
          if (!node) return;
          const full = node.dataset.type;
          typed.push({ el: node, full });
          const o = { p: 0 };
          tl.to(o, { p: 1, duration: dur, ease: 'none', onUpdate: () => { node.textContent = full.slice(0, Math.round(o.p * full.length)); } }, at);
        },
      };

      chapters.forEach((c, i) => {
        tl.set(c, { visibility: 'visible' }, i === 0 ? 0 : i - 0.001);
        if (i > 0) tl.fromTo(c, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.12 }, i);
        fadeUp(tl, $$(c, '[data-i]'), i + 0.02, 0.025, 0.1);
        fadeUp(tl, $$(c, '[data-f]'), i + 0.12, 0.04, 0.1);
        tl.fromTo(c.querySelector('.ag-demo'), { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.12 }, i + 0.04);
        (PLAY[agents[i].demo] ?? PLAY.generic)(c, tl, i, helpers);
        tl.fromTo(tabs[i].querySelector('i'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, i);
        if (i < n - 1) tl.to(c, { autoAlpha: 0, y: -60, duration: 0.1, ease: 'power2.in' }, i + 0.9);
      });
      tl.to({}, { duration: 0.1 }, n - 0.1);

      let current = -1;
      function sync() {
        const time = tl.time();
        for (const m of marks) m.el.classList.toggle(m.cls, time >= m.at);
        const i = Math.max(0, Math.min(n - 1, Math.floor(time)));
        if (i === current) return;
        current = i;
        countEl.textContent = pad(i + 1);
        tabs.forEach((b, k) => {
          b.classList.toggle('is-on', k === i);
          b.setAttribute('aria-current', k === i ? 'step' : 'false');
        });
        const tab = tabs[i];
        tabBox.scrollTo({ left: tab.offsetLeft - (tabBox.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
      }

      trigger.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 1.5 * n)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
        // the 3D background steps back while the demos are on screen
        onToggle: (self) => setStory({ quiet: self.isActive }),
      });
      sync();

      return () => {
        el.classList.remove('is-pinned');
        typed.forEach(({ el: node, full }) => { node.textContent = full; });
        marks.forEach(({ el: node, cls }) => node.classList.remove(cls));
        trigger.current = null;
        setStory({ quiet: false });
      };
    },
    { scope: root }
  );

  /** Tabs jump to the point where that agent's demo has fully played. */
  const jump = (i) => {
    const st = trigger.current;
    if (!st) return document.getElementById(`agent-${agents[i].id}`)?.scrollIntoView({ block: 'start' });
    scrollToY(st.start + (st.end - st.start) * ((i + 0.75) / n));
  };

  return (
    <section id="agents" data-story="agents" className="agents" ref={root} aria-label="Agents I've built">
      <div className="ag-inner">
        <div className="ag-top">
          <span className="ag-count" aria-hidden="true"><b data-count>01</b> / {pad(n)}</span>
          <div className="ag-tabs" role="navigation" aria-label="Jump to an agent">
            {agents.map((a, i) => (
              <button key={a.id} type="button" className="ag-tab" onClick={() => jump(i)}>
                {a.name}
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
          <span className="ag-grows">New agents land here as I build them</span>
        </div>

        <div className="ag-chapters">
          {agents.map((a, i) => {
            const Demo = DEMOS[a.demo] ?? GenericDemo;
            return (
              <article key={a.id} id={`agent-${a.id}`} className="ag-chapter">
                <div className="ag-info">
                  <span className="ag-no" data-i>Agent {pad(i + 1)}</span>
                  <h2 data-i>{a.name}</h2>
                  <span className={`ag-status${a.live ? ' is-live' : ''}`} data-i><Rich text={a.status} /></span>
                  <p className="ag-lede" data-i><Rich text={a.lede} /></p>
                  <div className="ag-facts">
                    <div className="ag-fact is-result glass" data-f>
                      <h3>Result</h3>
                      <p><b><Rich text={a.result.big} /></b><Rich text={a.result.text} /></p>
                    </div>
                    <div className="ag-fact glass" data-f>
                      <h3>Client · domain</h3>
                      <p><Rich text={a.client} /><br /><span className="ag-soft"><Rich text={a.domain} /></span></p>
                    </div>
                    <div className="ag-fact is-wide glass" data-f>
                      <h3>Stack</h3>
                      <div className="ag-chips">{a.stack.map((s) => <span key={s}>{s}</span>)}</div>
                    </div>
                  </div>
                </div>
                <div className="ag-demo glass" aria-hidden="true">
                  <Demo agent={a} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
