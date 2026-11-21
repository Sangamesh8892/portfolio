import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyText } from '../src/lib/copy-text.js';

function fakeDocument(execResult) {
  const appended = [];
  return {
    appended,
    createElement: () => ({ style: {}, setAttribute() {}, select() {}, remove() {} }),
    body: { appendChild: (el) => appended.push(el) },
    execCommand: (cmd) => (cmd === 'copy' ? execResult : false),
  };
}

test('uses the Clipboard API when it works', async () => {
  let written = null;
  const env = { navigator: { clipboard: { writeText: async (t) => (written = t) } }, document: fakeDocument(false) };
  assert.equal(await copyText('hi@x.dev', env), true);
  assert.equal(written, 'hi@x.dev');
});

test('falls back to execCommand when the Clipboard API rejects', async () => {
  const env = {
    navigator: { clipboard: { writeText: async () => { throw new Error('denied'); } } },
    document: fakeDocument(true),
  };
  assert.equal(await copyText('hi@x.dev', env), true);
});

test('falls back to execCommand when there is no Clipboard API', async () => {
  const env = { navigator: {}, document: fakeDocument(true) };
  assert.equal(await copyText('hi@x.dev', env), true);
});

test('reports failure when nothing can copy', async () => {
  const env = { navigator: {}, document: fakeDocument(false) };
  assert.equal(await copyText('hi@x.dev', env), false);
});
