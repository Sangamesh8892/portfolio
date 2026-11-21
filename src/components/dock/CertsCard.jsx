'use client';

import { AnimatePresence, LayoutGroup, motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Award, Download, Expand, FileText, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BorderBeam } from '@/components/ui/border-beam';
import { certifications } from '@/data/portfolio';
import { credentialStatus, formatDate } from '@/lib/credential';

/*
 * Certifications sheet.
 * List: each credential card shows the real certificate as a thumbnail, its validity and a Verify button.
 * Detail: clicking a certificate morphs the thumbnail (shared layoutId) into the full certificate,
 * with Verify on Credly · Open PDF · Download. Choreography: the certificate is the lead (spring,
 * 0.5s, no bounce); the title and actions follow 120ms behind; going back reverses the morph.
 */
const SPRING = { type: 'spring', duration: 0.5, bounce: 0 };
const slug = (c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function CertsCard() {
  const reduce = useReducedMotion();
  const [openName, setOpenName] = useState(null);
  const selected = certifications.find((c) => c.name === openName);

  // warm the full-size images so the morph never waits on a download
  useEffect(() => {
    certifications.forEach((c) => {
      if (c.image) new window.Image().src = c.image;
    });
  }, []);

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : SPRING}>
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          {selected ? (
            <CertDetail key="detail" cert={selected} onBack={() => setOpenName(null)} />
          ) : (
            <CertList key="list" reduce={reduce} onOpen={setOpenName} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}

function CertList({ reduce, onOpen }) {
  const verified = certifications.filter((c) => c.verifyUrl).length;
  const now = new Date();
  return (
    <motion.div className="certs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
      <p className="eyebrow">Verified credentials</p>
      <h2>Certifications</h2>
      <p className="certs-sub">
        {verified} verified on Credly{certifications.length > verified ? ` · ${certifications.length - verified} more` : ''}
      </p>

      <ul>
        {certifications.map((c, i) => {
          const s = credentialStatus(c.issued, c.expires, now);
          return (
            <li key={c.name} className={`cred glass ${i === 0 ? 'is-lead' : ''} ${c.thumb ? 'has-thumb' : ''}`} style={{ '--used': s.used, '--i': i }}>
              {i === 0 && !reduce && (
                <span className="cred-beam" aria-hidden="true">
                  <BorderBeam size={90} duration={7} borderWidth={1.5} colorFrom="var(--brand)" colorTo="var(--em)" />
                </span>
              )}

              {c.thumb ? (
                <button type="button" className="cred-thumb" onClick={() => onOpen(c.name)} aria-label={`View certificate: ${c.name}`}>
                  <motion.img layoutId={`cert-${slug(c)}`} src={c.thumb} srcSet={`${c.thumb} 560w, ${c.image} 1600w`} sizes="200px"
                    alt="" width={560} height={433} draggable={false} />
                  <span className="cred-thumb-hint" aria-hidden="true">
                    <Expand size={14} /> View
                  </span>
                </button>
              ) : (
                <span className="cred-seal" aria-hidden="true">
                  <Award size={24} strokeWidth={1.8} />
                </span>
              )}

              <div className="cred-main">
                <span className="cred-title">
                  <b>{c.name}</b>
                  <span className="cred-level">{c.level}</span>
                </span>
                <span className="cred-meta">
                  {c.issuer}
                  {c.issued && <> · Issued {formatDate(c.issued)}</>}
                </span>
                {s.status !== 'unknown' ? (
                  <div className="cred-validity">
                    <span className="cred-bar" aria-hidden="true">
                      <span className="cred-bar-fill" />
                    </span>
                    <span className="cred-state">
                      <span className={`cred-dot is-${s.status}`} aria-hidden="true" />
                      {s.status === 'active'
                        ? `Active · valid until ${formatDate(c.expires)} (${s.daysLeft} days left)`
                        : `Expired ${formatDate(c.expires)}`}
                    </span>
                  </div>
                ) : (
                  <span className="cred-state is-muted">Credential link coming soon</span>
                )}
                {c.verifyUrl && <VerifyLink cert={c} />}
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function CertDetail({ cert, onBack }) {
  const heading = useRef(null);
  const s = credentialStatus(cert.issued, cert.expires);
  // move focus into the new view without drawing a ring on the back button after a mouse click
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  return (
    <motion.div className="cert-detail" exit={{ opacity: 1 }}>
      <motion.button type="button" className="questions-back" onClick={onBack}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
        <ArrowLeft size={16} aria-hidden="true" /> All certifications
      </motion.button>

      <div className="cert-paper">
        <motion.img layoutId={`cert-${slug(cert)}`} src={cert.image} alt={`${cert.name} certificate, issued to Sangameshwar Jalihal`}
          width={1600} height={1237} draggable={false} />
      </div>

      <motion.div className="cert-info"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.3, ease: [0.23, 1, 0.32, 1] } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}>
        <span className="cred-title">
          <h3 ref={heading} tabIndex={-1} className="cert-name">{cert.name}</h3>
          <span className="cred-level">{cert.level}</span>
        </span>
        <span className="cred-meta">
          {cert.issuer} · Issued {formatDate(cert.issued)} · Valid until {formatDate(cert.expires)}
          {s.status === 'active' && ` · ${s.daysLeft} days left`}
        </span>
        <div className="cert-actions">
          <VerifyLink cert={cert} primary />
          <a className="cred-verify" href={cert.pdf} target="_blank" rel="noopener noreferrer" aria-label={`Open ${cert.name} PDF (new tab)`}>
            <FileText size={16} aria-hidden="true" />
            <span>Open PDF</span>
          </a>
          <a className="cred-verify" href={cert.pdf} download aria-label={`Download ${cert.name} PDF`}>
            <Download size={16} aria-hidden="true" />
            <span>Download</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VerifyLink({ cert, primary = false }) {
  return (
    <a className={`cred-verify ${primary ? 'is-primary' : ''}`} href={cert.verifyUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`Verify ${cert.name} on Credly (opens in a new tab)`}>
      <ShieldCheck size={16} aria-hidden="true" />
      <span>Verify on Credly</span>
      <ArrowUpRight size={15} className="cred-verify-arrow" aria-hidden="true" />
    </a>
  );
}
