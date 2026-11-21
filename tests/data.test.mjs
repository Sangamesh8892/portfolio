import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  about,
  certifications,
  contact,
  dock,
  education,
  experience,
  mvp,
} from '../src/data/portfolio.js';

test('MVP pipeline has the five stations in order', () => {
  assert.deepEqual(
    mvp.stations.map((s) => s.label),
    ['User story', 'Functional spec', 'Technical spec', 'ABAP code', 'Test cases']
  );
});

test('the technical-spec station is the TSD agent', () => {
  assert.match(mvp.stations[2].agent, /TSD/);
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
  assert.ok(!JSON.stringify({ about, mvp, experience }).includes('@'));
});
