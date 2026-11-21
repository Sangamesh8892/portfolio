'use client';

import { FileText } from 'lucide-react';
import CopyEmailButton from '@/components/dock/CopyEmailButton';
import { profile } from '@/data/portfolio';
import { openSheet } from '@/lib/sheet-store';

export default function Close() {
  return (
    <section id="contact" data-story="close" className="story-section story-close">
      <p className="eyebrow">Next</p>
      <h2>
        Let's build agents <em>that ship.</em>
      </h2>
      <div className="close-actions">
        <CopyEmailButton className="btn-brand" />
        <button type="button" className="btn-glass glass" onClick={() => openSheet('resume')}>
          <FileText size={18} aria-hidden="true" />
          <span>Résumé</span>
        </button>
      </div>
      <p className="close-foot">
        © {new Date().getFullYear()} {profile.name} · Bengaluru
      </p>
    </section>
  );
}
