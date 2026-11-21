import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CORE_POSES, easeCore, corePose, stationIndex } from '../src/lib/core-poses.js';

const wide = { narrow: false };

test('each section holds its own pose mid-way', () => {
  for (const s of ['hero', 'about', 'experience', 'close']) {
    assert.deepEqual(corePose(s, 0.5, wide).pos, CORE_POSES[s].pos);
  }
});

test('in the MVP the core follows a measured track from first to last station', () => {
  const track = { x0: -3, y0: -0.5, x1: 3, y1: -0.5 };
  assert.deepEqual(corePose('work', 0, { ...wide, track }).pos.slice(0, 2), [-3, -0.5]);
  assert.deepEqual(corePose('work', 1, { ...wide, track }).pos.slice(0, 2), [3, -0.5]);
  assert.equal(corePose('work', 0.5, { ...wide, track }).pos[0], 0);
});

test('without a track the MVP falls back to a default line', () => {
  const a = corePose('work', 0, wide).pos[0];
  const b = corePose('work', 1, wide).pos[0];
  assert.ok(a < 0 && b > 0);
});

test('the end of a section blends toward the next pose', () => {
  const x = corePose('hero', 0.9, wide).pos[0];
  const [a, b] = [CORE_POSES.hero.pos[0], CORE_POSES.about.pos[0]];
  assert.ok(x < Math.max(a, b) && x > Math.min(a, b));
});

test('narrow screens shrink the core', () => {
  assert.ok(corePose('hero', 0, { narrow: true }).scale < corePose('hero', 0, wide).scale);
});

test('poses stay finite for out-of-range progress and unknown sections', () => {
  for (const s of ['hero', 'about', 'work', 'experience', 'close', 'nope']) {
    for (const p of [-1, 0, 0.5, 1, 2, NaN]) {
      const { pos, scale } = corePose(s, p, wide);
      for (const v of [...pos, scale]) assert.ok(Number.isFinite(v), `${s}@${p}`);
    }
  }
});

test('stationIndex counts which of five stations the core has reached', () => {
  assert.equal(stationIndex(0), 0);
  assert.equal(stationIndex(0.19), 0);
  assert.equal(stationIndex(0.2), 1);
  assert.equal(stationIndex(0.99), 4);
  assert.equal(stationIndex(1), 4);
  assert.equal(stationIndex(NaN), 0);
});

test('easeCore moves toward the target; hidden shrinks to zero', () => {
  const cur = { pos: [0, 0, 0], scale: 1 };
  easeCore(cur, { pos: [10, 0, 0], scale: 2 }, 0.1);
  assert.ok(cur.pos[0] > 0 && cur.pos[0] < 10);
  easeCore(cur, { pos: [10, 0, 0], scale: 2 }, 1, { visible: false });
  assert.equal(cur.scale, 0);
  assert.equal(cur.pos[0], 10);
});
