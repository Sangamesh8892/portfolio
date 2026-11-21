import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getStory, setStory, subscribeStory } from '../src/lib/story-store.js';
import { closeSheet, getSheet, openSheet, subscribeSheet } from '../src/lib/sheet-store.js';

test('setStory merges a partial update and keeps the section', () => {
  setStory({ section: 'about', progress: 0 });
  setStory({ progress: 0.5 });
  assert.equal(getStory().section, 'about');
  assert.equal(getStory().progress, 0.5);
});

test('story subscribers are notified once per update and can unsubscribe', () => {
  let calls = 0;
  const off = subscribeStory(() => calls++);
  setStory({ progress: 0.1 });
  assert.equal(calls, 1);
  off();
  setStory({ progress: 0.2 });
  assert.equal(calls, 1);
});

test('sheet store opens and closes one sheet at a time', () => {
  let seen = [];
  const off = subscribeSheet(() => seen.push(getSheet()));
  openSheet('certs');
  assert.equal(getSheet(), 'certs');
  openSheet('contact');
  assert.equal(getSheet(), 'contact');
  closeSheet();
  assert.equal(getSheet(), null);
  assert.deepEqual(seen, ['certs', 'contact', null]);
  off();
});
