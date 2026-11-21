'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { contact } from '@/data/portfolio';
import { copyText } from '@/lib/copy-text';

/**
 * The only way the site exposes the email: copy it to the clipboard.
 * The address is shown as text only if copying fails, so the visitor can still get it.
 */
export default function CopyEmailButton({ className = '', label = 'Copy email' }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const ok = await copyText(contact.email);
    if (ok) {
      setCopied(true);
      toast.success('Email copied');
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      toast(`Couldn't copy, it's ${contact.email}`);
    }
  };

  return (
    <button type="button" onClick={onClick} className={`copy-email ${className}`} aria-live="polite">
      {copied ? <Check size={18} /> : <Copy size={18} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}
