import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicFile = (p) => fileURLToPath(new URL(`../public${p}`, import.meta.url));

test('both Claude certificates ship their PDF, a full image and a thumbnail', () => {
  for (const name of ['Claude Certified Architect – Professional', 'Claude Certified Developer – Foundations']) {
    const c = certifications.find((x) => x.name === name);
    for (const key of ['pdf', 'image', 'thumb']) {
      assert.ok(c[key], `${name} is missing ${key}`);
      assert.ok(c[key].startsWith('/certificates/'), `${key} should live in /public/certificates`);
      assert.ok(existsSync(publicFile(c[key])), `${c[key]} not found in /public`);
    }
  }
});
import { certifications } from '../src/data/portfolio.js';
import { credentialStatus, formatDate } from '../src/lib/credential.js';

const CREDLY = /^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}$/;

test('the Architect certificate is listed first with its Credly link and dates', () => {
  const c = certifications[0];
  assert.equal(c.name, 'Claude Certified Architect – Professional');
  assert.equal(c.verifyUrl, 'https://www.credly.com/badges/95d9aa76-255b-4a17-a29c-5a35a6ba1977');
  assert.equal(c.issued, '2026-11-01');
  assert.equal(c.expires, '2027-11-01');
});

test('the Developer Foundations certificate has its Credly link and dates', () => {
  const c = certifications.find((x) => x.name === 'Claude Certified Developer – Foundations');
  assert.equal(c.verifyUrl, 'https://www.credly.com/badges/a3cdd74c-50b7-4e2f-8fa7-ef2072be1873');
  assert.equal(c.issued, '2026-09-12');
  assert.equal(c.expires, '2027-09-12');
});

test('every verify link that exists is a Credly badge URL', () => {
  for (const c of certifications) if (c.verifyUrl) assert.match(c.verifyUrl, CREDLY);
});

test('a certificate without a link or dates is allowed (shown without a verify button)', () => {
  const aws = certifications.find((x) => x.issuer === 'AWS');
  assert.equal(aws.verifyUrl, null);
});

test('formatDate prints a short readable date', () => {
  assert.equal(formatDate('2027-11-01'), 'Nov 1, 2027');
});

test('credentialStatus: active, with share of validity used and days left', () => {
  const s = credentialStatus('2026-11-01', '2027-11-01', new Date('2027-05-02T00:00:00Z'));
  assert.equal(s.status, 'active');
  assert.ok(s.used > 0.49 && s.used < 0.51, `used ${s.used}`);
  assert.equal(s.daysLeft, 183);
});

test('credentialStatus: expired after the expiry date, used clamps to 1', () => {
  const s = credentialStatus('2026-11-01', '2027-11-01', new Date('2028-01-01T00:00:00Z'));
  assert.equal(s.status, 'expired');
  assert.equal(s.used, 1);
  assert.equal(s.daysLeft, 0);
});

test('credentialStatus: missing dates give an unknown status', () => {
  const s = credentialStatus(null, null, new Date());
  assert.equal(s.status, 'unknown');
  assert.equal(s.used, 0);
});
