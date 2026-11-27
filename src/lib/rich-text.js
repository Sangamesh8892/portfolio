/**
 * Splits short copy into parts for rendering:
 *   **bold**        -> { type: 'bold', text }
 *   [placeholder]   -> { type: 'placeholder', text }  (content still to be filled in)
 *   anything else   -> { type: 'text', text }
 */
export function richParts(input) {
  const parts = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]/g;
  const s = String(input ?? '');
  let last = 0;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m.index > last) parts.push({ type: 'text', text: s.slice(last, m.index) });
    parts.push(m[1] !== undefined ? { type: 'bold', text: m[1] } : { type: 'placeholder', text: m[2] });
    last = re.lastIndex;
  }
  if (last < s.length) parts.push({ type: 'text', text: s.slice(last) });
  return parts;
}

/** True when the copy still holds a [placeholder]. */
export const hasPlaceholder = (input) => /\[[^\]]+\]/.test(String(input ?? ''));
