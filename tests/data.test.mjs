import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  about,
  agents,
  certifications,
  contact,
  dock,
  education,
  experience,
} from '../src/data/portfolio.js';
import { hasPlaceholder, richParts } from '../src/lib/rich-text.js';

const DEMOS = ['tsd', 'edit', 'route', 'retrieval', 'generic'];

test('every agent has the fields its chapter renders', () => {
  assert.ok(agents.length > 0);
  for (const a of agents) {
    for (const key of ['id', 'name', 'status', 'lede', 'client', 'domain']) {
      assert.equal(typeof a[key], 'string', `${a.id ?? a.name}: ${key}`);
      assert.ok(a[key].length > 0, `${a.id}: empty ${key}`);
    }
    assert.equal(typeof a.result?.big, 'string', `${a.id}: result.big`);
    assert.equal(typeof a.result?.text, 'string', `${a.id}: result.text`);
    assert.ok(Array.isArray(a.stack) && a.stack.length > 0, `${a.id}: stack`);
    assert.ok(DEMOS.includes(a.demo), `${a.id}: unknown demo "${a.demo}"`);
  }
});

test('agent ids are unique', () => {
  const ids = agents.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('the FSD → TSD agent keeps its real 80–90% result', () => {
  const tsd = agents.find((a) => a.id === 'fsd-tsd');
  assert.equal(tsd.result.big, '80–90%');
  assert.equal(hasPlaceholder(tsd.result.big), false);
});

test('richParts splits bold and placeholders', () => {
  assert.deepEqual(richParts('Give it a **spec** for [Client]!'), [
    { type: 'text', text: 'Give it a ' },
    { type: 'bold', text: 'spec' },
    { type: 'text', text: ' for ' },
    { type: 'placeholder', text: 'Client' },
    { type: 'text', text: '!' },
  ]);
  assert.deepEqual(richParts('plain'), [{ type: 'text', text: 'plain' }]);
  assert.deepEqual(richParts(''), []);
});

test('the sticky dock repeats the five hero tiles, in order', () => {
  assert.deepEqual(
    dock.map((d) => d.label),
    ['Agents', 'Me', 'Stack', 'Certs', 'Contact']
  );
  assert.deepEqual(
    dock.map((d) => d.id),
    ['projects', 'about', 'skills', 'certifications', 'contact']
  );
});

test('all three certifications are listed by exact name', () => {
  const names = certifications.map((c) => c.name);
  for (const n of [
    'Claude Certified Architect – Professional',
    'Claude Certified Developer – Foundations',
    'AWS Certified Generative AI Developer – Professional',
  ]) {
    assert.ok(names.includes(n), `missing certification: ${n}`);
  }
});

test('first experience entry is the TCS role', () => {
  assert.equal(experience[0].org, 'Tata Consultancy Services');
  assert.equal(experience[0].dates, 'Apr 2026 – Present');
});

test('education is the B.E. at Jain College', () => {
  assert.equal(education.school, 'Jain College of Engineering and Technology, Hubballi');
});

test('the email lives only in contact, never in story copy', () => {
  assert.equal(contact.email, 'sangamesh8894@gmail.com');
  assert.ok(!JSON.stringify({ about, agents, experience }).includes('@'));
});
