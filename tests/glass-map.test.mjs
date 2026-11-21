import { test } from 'node:test';
import assert from 'node:assert/strict';
import { glassMap } from '../src/lib/glass-map.js';

const px = (m, x, y) => {
  const i = (y * m.width + x) * 4;
  return [m.data[i], m.data[i + 1], m.data[i + 2], m.data[i + 3]];
};

test('map has one RGBA pixel per cell', () => {
  const m = glassMap(40, 20, { radius: 8, bevel: 6 });
  assert.equal(m.width, 40);
  assert.equal(m.height, 20);
  assert.equal(m.data.length, 40 * 20 * 4);
});

test('the flat middle of the glass does not bend', () => {
  const m = glassMap(100, 60, { radius: 12, bevel: 10 });
  const [r, g] = px(m, 50, 30);
  assert.equal(r, 128);
  assert.equal(g, 128);
});

test('the left and right bevels bend horizontally, in opposite directions', () => {
  const m = glassMap(100, 60, { radius: 12, bevel: 10 });
  const [rl, gl] = px(m, 1, 30);
  const [rr, gr] = px(m, 98, 30);
  assert.notEqual(rl, 128);
  assert.ok(Math.abs(gl - 128) <= 1, 'no vertical bend on a straight side');
  assert.ok(Math.abs(rl + rr - 256) <= 2, 'mirror-symmetric');
  assert.ok(Math.abs(gr - 128) <= 1);
});

test('the top bevel bends vertically', () => {
  const m = glassMap(100, 60, { radius: 12, bevel: 10 });
  const [r, g] = px(m, 50, 1);
  assert.ok(Math.abs(r - 128) <= 1);
  assert.notEqual(g, 128);
});

test('the bend is strongest at the very edge and fades inward', () => {
  const m = glassMap(100, 60, { radius: 12, bevel: 10 });
  const edge = Math.abs(px(m, 0, 30)[0] - 128);
  const mid = Math.abs(px(m, 5, 30)[0] - 128);
  const inside = Math.abs(px(m, 12, 30)[0] - 128);
  assert.ok(edge > mid && mid > inside, `${edge} > ${mid} > ${inside}`);
  assert.equal(inside, 0);
});

test('a pill (radius larger than half the height) still produces a valid map', () => {
  const m = glassMap(200, 44, { radius: 999, bevel: 12 });
  for (const v of m.data) assert.ok(Number.isFinite(v) && v >= 0 && v <= 255);
  assert.deepEqual(px(m, 100, 22).slice(0, 2), [128, 128]);
});
