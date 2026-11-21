/**
 * Copy text to the clipboard. Tries the Clipboard API, then a hidden textarea +
 * execCommand('copy'). Resolves true only if a copy actually happened.
 */
export async function copyText(text, env = globalThis) {
  try {
    if (env.navigator?.clipboard?.writeText) {
      await env.navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // denied or unavailable: fall through to the legacy path
  }
  try {
    const doc = env.document;
    if (!doc?.execCommand) return false;
    const ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    doc.body.appendChild(ta);
    ta.select();
    const ok = doc.execCommand('copy');
    ta.remove();
    return !!ok;
  } catch {
    return false;
  }
}
