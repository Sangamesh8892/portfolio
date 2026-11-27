import { Fragment } from 'react';
import { richParts } from '@/lib/rich-text';

/** Copy with **bold** and [placeholder] support (see src/lib/rich-text.js). */
export function Rich({ text }) {
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
