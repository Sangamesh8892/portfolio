'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Rich } from '@/components/story/Rich';
import { scrollToY } from '@/components/story/SmoothScroll';
import { featuredAgents as agents } from '@/data/portfolio';
import { openSheet } from '@/lib/sheet-store';
import { setStory } from '@/lib/story-store';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n) => String(n).padStart(2, '0');

function Bar({ file }) {
  return (
    <div className="ag-bar">
      <span className="ag-dots" aria-hidden="true"><b /><b /><b /></span>
      {file}
      <span className="ag-hint">illustrative</span>
    </div>
  );
}

/* ── demos: one per featured agent. data-a marks what the timeline animates ── */

function TsdDemo() {
  const secs = [['Design decisions', 'KB'], ['Object names', 'STD'], ['Data source', 'ADT'], ['Error handling', 'KB']];
  return (
    <>
      <Bar file="FSD → TSD.docx" />
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
        <div className="ag-time" data-a="time">
          <div className="ag-time-row">
            <span>By hand</span>
            <span className="ag-time-bar is-slow"><i data-a="slow" /></span>
            <b>10–15 h</b>
          </div>
          <div className="ag-time-row">
            <span>Agent</span>
            <span className="ag-time-bar"><i data-a="fast" /></span>
            <b className="is-em">5 min</b>
          </div>
        </div>
      </div>
    </>
  );
}

const CODE = [
  ['CLASS', ' zcl_sd_order_check ', 'DEFINITION PUBLIC FINAL', '.'],
  ['  METHODS', ' validate ', 'IMPORTING', ' is_order TYPE zs_order.'],
  ['ENDCLASS', '', '', '.'],
  ['CLASS', ' zcl_sd_order_check ', 'IMPLEMENTATION', '.'],
  ['  METHOD', ' validate', '', '.'],
  ['    SELECT SINGLE', ' credit_limit ', 'FROM', ' zi_customer'],
  ['      WHERE', ' customer = @is_order-customer', '', ''],
  ['      INTO', ' @DATA(lv_limit)', '', '.'],
  ['  ENDMETHOD', '', '', '.'],
  ['ENDCLASS', '', '', '.'],
];
function CodegenDemo() {
  return (
    <>
      <Bar file="zcl_sd_order_check.abap" />
      <div className="ag-stage">
        <div className="ag-codegen">
          <div className="ag-card" data-a="in">
            <span className="ag-lbl">Technical spec</span>
            {['Objects', 'Logic', 'Data access', 'Errors'].map((s) => <div key={s} className="ag-sec">{s}</div>)}
          </div>
          <span className="ag-arrow" data-a="arrow" aria-hidden="true">→</span>
          <pre className="ag-code" data-a="code">
            {CODE.map(([kw, a, kw2, b], i) => (
              <span key={i} className="ag-code-line" data-a="line">
                <span className="kw">{kw}</span>{a}<span className="kw">{kw2}</span>{b}
              </span>
            ))}
          </pre>
        </div>
        <div className="ag-checks" data-a="checks">
          {['Naming standard', 'Coding standard', 'Syntax check'].map((c) => <span key={c} className="ag-check" data-a="check">✓ {c}</span>)}
        </div>
      </div>
    </>
  );
}

const FINDINGS = [
  { line: 'SELECT * FROM zi_customer INTO TABLE lt_cust.', fix: 'SELECT customer, credit_limit FROM zi_customer INTO TABLE @lt_cust.', tag: 'Performance' },
  { line: 'LOOP AT lt_orders INTO ls_order. SELECT SINGLE …', fix: 'Read once before the loop, then use the internal table.', tag: 'DB in loop' },
  { line: 'CALL FUNCTION \'OBSOLETE_FM\' …', fix: 'Replaced with the released API.', tag: 'Obsolete' },
];
function RemediateDemo() {
  return (
    <>
      <Bar file="remediation_run" />
      <div className="ag-stage">
        <div className="ag-lbl">Findings in existing code</div>
        {FINDINGS.map((f) => (
          <div key={f.tag} className="ag-finding" data-a="finding">
            <div className="ag-finding-head">
              <span className="ag-tag">{f.tag}</span>
              <span className="ag-state" data-a="state" />
            </div>
            <code className="ag-old-code">{f.line}</code>
            <code className="ag-new-code" data-a="fix">{f.fix}</code>
          </div>
        ))}
        <div className="ag-badge" data-a="badge">3 findings fixed · re-checked · ready for review</div>
      </div>
    </>
  );
}

function GenericDemo({ agent }) {
  return (
    <>
      <Bar file={agent.id} />
      <div className="ag-stage">
        <div className="ag-gen">
          <div className="ag-card" data-a="in">
            <span className="ag-lbl">Input</span>
            <p><Rich text={agent.io?.in ?? '[what goes in]'} /></p>
          </div>
          <span className="ag-arrow" data-a="arrow" aria-hidden="true">→</span>
          <div className="ag-card" data-a="sec">
            <span className="ag-lbl">Output</span>
            <p><Rich text={agent.io?.out ?? '[what comes out]'} /></p>
          </div>
        </div>
      </div>
    </>
  );
}

const DEMOS = { tsd: TsdDemo, codegen: CodegenDemo, remediate: RemediateDemo, generic: GenericDemo };

/* ── choreography: each chapter owns timeline time [i, i + 1) ── */

const $$ = (root, sel) => [...root.querySelectorAll(sel)];

function fadeUp(tl, els, at, step = 0.04, d = 0.08) {
  els.forEach((el, k) => tl.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: d }, at + k * step));
}
function pop(tl, els, at, step = 0) {
  tl.fromTo(els, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.06, ease: 'back.out(2.5)', stagger: step }, at);
}

const PLAY = {
  tsd(c, tl, t) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.16);
    tl.fromTo($$(c, '[data-a="in"] .ag-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.06, stagger: 0.02 }, t + 0.2);
    tl.fromTo($$(c, '[data-a="arrow"]'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.05 }, t + 0.3);
    fadeUp(tl, $$(c, '[data-a="sec"]'), t + 0.34, 0.06);
    tl.fromTo($$(c, '.ag-cite'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.05, ease: 'back.out(3)', stagger: 0.06 }, t + 0.38);
    fadeUp(tl, $$(c, '[data-a="time"]'), t + 0.58);
    tl.fromTo($$(c, '[data-a="slow"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: 'none' }, t + 0.6);
    tl.fromTo($$(c, '[data-a="fast"]'), { scaleX: 0 }, { scaleX: 0.04, duration: 0.03 }, t + 0.62);
  },
  codegen(c, tl, t, { mark }) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.16);
    tl.fromTo($$(c, '[data-a="arrow"]'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.05 }, t + 0.24);
    fadeUp(tl, $$(c, '[data-a="code"]'), t + 0.26);
    $$(c, '[data-a="line"]').forEach((l, k) => mark(l, t + 0.3 + k * 0.035, 'is-on'));
    fadeUp(tl, $$(c, '[data-a="checks"]'), t + 0.66);
    pop(tl, $$(c, '[data-a="check"]'), t + 0.68, 0.04);
  },
  remediate(c, tl, t, { mark }) {
    const fs = $$(c, '[data-a="finding"]');
    fadeUp(tl, fs, t + 0.16, 0.05);
    fs.forEach((f, k) => {
      mark(f, t + 0.36 + k * 0.1, 'is-fixed');
    });
    pop(tl, $$(c, '[data-a="badge"]'), t + 0.7);
  },
  generic(c, tl, t) {
    fadeUp(tl, $$(c, '[data-a="in"]'), t + 0.16);
    tl.fromTo($$(c, '[data-a="arrow"]'), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.05 }, t + 0.3);
    fadeUp(tl, $$(c, '[data-a="sec"]'), t + 0.36);
  },
};

/**
 * Featured agents (src/data/portfolio.js → agents, featured: true): one pinned
 * chapter each. Scroll scrubs the chapter's live demo, then hands over to the
 * next. Without JS, or under reduced motion, the chapters simply stack.
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

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onUpdate: sync });
      const helpers = { mark: (node, at, cls) => node && marks.push({ el: node, at, cls }) };

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
        end: () => `+=${Math.round(window.innerHeight * 1.3 * n)}`,
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
    <>
    <header id="agents" className="agents-intro">
      <p className="eyebrow" data-reveal>My work</p>
      <h2 data-reveal="mask" style={{ '--d': 1 }}>Agents I’ve <em>built</em></h2>
      <p className="story-body" data-reveal style={{ '--d': 3 }}>
        Each one takes a slow, manual part of SAP delivery and hands it to an agent, with a person checking the result.
        Scroll through the main ones first; every agent is listed after them.
      </p>
    </header>
    <section data-story="agents" className="agents" ref={root} aria-label="Agents I've built">
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
          <span className="ag-grows">The main agents · all of them below</span>
        </div>

        <div className="ag-chapters">
          {agents.map((a, i) => {
            const Demo = DEMOS[a.demo] ?? GenericDemo;
            const [lead, ...more] = a.results;
            return (
              <article key={a.id} id={`agent-${a.id}`} className="ag-chapter">
                <div className="ag-info">
                  <span className="ag-no" data-i>Agent {pad(i + 1)}</span>
                  <h2 data-i>{a.name}</h2>
                  <span className={`ag-status${a.live ? ' is-live' : ''}`} data-i><Rich text={a.status} /></span>
                  <p className="ag-lede" data-i><Rich text={a.lede} /></p>
                  <div className="ag-facts">
                    <div className="ag-fact is-result is-wide glass" data-f>
                      <div className="ag-stats">
                        {[lead, ...more].map((r) => (
                          <p key={r.big + r.text}><b><Rich text={r.big} /></b><Rich text={r.text} /></p>
                        ))}
                      </div>
                    </div>
                    <div className="ag-fact glass" data-f>
                      <h3>Client</h3>
                      <p><Rich text={a.client} /></p>
                    </div>
                    <div className="ag-fact glass" data-f>
                      <h3>Input → output</h3>
                      <p><Rich text={a.io.in} /> → <Rich text={a.io.out} /></p>
                    </div>
                  </div>
                  <button type="button" className="ag-more" data-f onClick={() => openSheet(`agent:${a.id}`)}>
                    Full details <span aria-hidden="true">→</span>
                  </button>
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
    </>
  );
}
