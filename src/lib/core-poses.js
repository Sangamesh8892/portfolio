/**
 * Where the "agent core" (a point-cloud sphere with a token ring) sits in each
 * story section. World units at depth z=1 with the camera at z=10.
 *
 * corePose(section, progress, { narrow, track }) -> { pos: [x,y,z], scale }
 * - 'work': rides the measured pipeline track (world coords) from first to last station.
 * - other sections: hold their pose, then blend toward the next over progress 0.8 -> 1.
 */
export const ORDER = ['hero', 'about', 'work', 'experience', 'close'];

export const CORE_POSES = {
  hero: { pos: [-3.2, -1.5, 1], scale: 0.95 }, // lower left: clear of the background cores
  about: { pos: [2.55, 0, 1], scale: 0.8 }, // behind the glass profile card
  work: { pos: [-3.3, -0.2, 1], scale: 0.32 },
  experience: { pos: [3.4, 0.2, 1], scale: 0.85 },
  close: { pos: [0, 1.5, 1], scale: 0.7 },
};

const DEFAULT_TRACK = { x0: -3.3, y0: -0.2, x1: 3.3, y1: -0.2 };
const clamp01 = (v) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function workPose(t, track) {
  const k = track || DEFAULT_TRACK;
  return { pos: [lerp(k.x0, k.x1, t), lerp(k.y0, k.y1, t), CORE_POSES.work.pos[2]], scale: CORE_POSES.work.scale };
}

export function corePose(section, progress, { narrow = false, track = null } = {}) {
  const t = clamp01(progress);
  let pose;
  if (section === 'work') {
    pose = workPose(t, track);
  } else {
    const name = CORE_POSES[section] ? section : 'hero';
    const here = CORE_POSES[name];
    const nextName = ORDER[ORDER.indexOf(name) + 1];
    if (!nextName || t < 0.8) {
      pose = { pos: [...here.pos], scale: here.scale };
    } else {
      const next = nextName === 'work' ? workPose(0, track) : CORE_POSES[nextName];
      const k = smooth((t - 0.8) / 0.2);
      pose = { pos: here.pos.map((v, i) => lerp(v, next.pos[i], k)), scale: lerp(here.scale, next.scale, k) };
    }
  }
  if (narrow) pose.scale *= 0.6;
  return pose;
}

/** Which of the five MVP stations the core has reached (0..4). */
export function stationIndex(progress, count = 5) {
  return Math.min(count - 1, Math.floor(clamp01(progress) * count));
}

/** Ease `cur` (mutated) toward `target` by k. visible=false shrinks the core to nothing. */
export function easeCore(cur, target, k, { visible = true } = {}) {
  const goal = visible ? target.scale : 0;
  for (let i = 0; i < 3; i++) cur.pos[i] = k >= 1 ? target.pos[i] : cur.pos[i] + (target.pos[i] - cur.pos[i]) * k;
  cur.scale = k >= 1 ? goal : cur.scale + (goal - cur.scale) * k;
  return cur;
}
