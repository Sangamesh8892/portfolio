/** Helpers for showing a certificate's validity. Dates are 'YYYY-MM-DD' strings (UTC). */
const DAY = 86_400_000;
const parse = (d) => (d ? new Date(`${d}T00:00:00Z`) : null);

export function formatDate(d) {
  const date = parse(d);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/**
 * credentialStatus(issued, expires, now) ->
 *   { status: 'active' | 'expired' | 'unknown', used: 0..1 share of validity elapsed, daysLeft }
 */
export function credentialStatus(issued, expires, now = new Date()) {
  const a = parse(issued);
  const b = parse(expires);
  if (!a || !b || b <= a) return { status: 'unknown', used: 0, daysLeft: 0 };
  const t = now.getTime();
  const used = Math.min(1, Math.max(0, (t - a.getTime()) / (b.getTime() - a.getTime())));
  const daysLeft = Math.max(0, Math.ceil((b.getTime() - t) / DAY));
  return { status: t >= b.getTime() ? 'expired' : 'active', used, daysLeft };
}
