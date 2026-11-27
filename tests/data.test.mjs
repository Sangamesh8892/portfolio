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
  featuredAgents,
} from '../src/data/portfolio.js';
import { hasPlaceholder, richParts } from '../src/lib/rich-text.js';

const DEMOS = ['tsd', 'codegen', 'remediate', 'generic'];

test('every agent has the fields its card, chapter and sheet render', () => {
  assert.ok(agents.length > 0);
  for (const a of agents) {
    for (const key of ['id', 'name', 'status', 'oneLiner', 'lede', 'problem', 'human', 'client', 'domain']) {
      assert.equal(typeof a[key], 'string', `${a.id ?? a.name}: ${key}`);
      assert.ok(a[key].length > 0, `${a.id}: empty ${key}`);
    }
    assert.equal(typeof a.io?.in, 'string', `${a.id}: io.in`);
    assert.equal(typeof a.io?.out, 'string', `${a.id}: io.out`);
    assert.ok(a.results.length > 0, `${a.id}: results`);
    for (const r of a.results) assert.ok(typeof r.big === 'string' && typeof r.text === 'string', `${a.id}: result shape`);
    for (const key of ['howItWorks', 'features', 'deployedOn', 'stack']) assert.ok(Array.isArray(a[key]), `${a.id}: ${key}`);
    assert.ok(a.stack.length > 0, `${a.id}: stack`);
  }
});

test('featured agents each have a known demo', () => {
  assert.ok(featuredAgents.length > 0 && featuredAgents.length <= 4);
  for (const a of featuredAgents) assert.ok(DEMOS.includes(a.demo), `${a.id}: unknown demo "${a.demo}"`);
});

test('agent ids are unique', () => {
  const ids = agents.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('the Technical Spec agent keeps its real numbers', () => {
  const tsd = agents.find((a) => a.id === 'technical-spec');
  assert.ok(tsd.featured);
  assert.deepEqual(tsd.results.map((r) => r.big), ['5 min', '80–90%', '3–4 h']);
  assert.equal(hasPlaceholder(tsd.lede), false);
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
