/**
 * Displacement map for thick-glass edges (the look of the visionpictures reference).
 * The middle of the glass is flat (no bend). Inside a bevel band along the
 * rounded-rect edge, the backdrop bends inward, strongest at the very edge.
 *
 * glassMap(w, h, { radius, bevel }) -> { width, height, data: Uint8ClampedArray RGBA }
 *   R = 128 + dx*127, G = 128 + dy*127 (feDisplacementMap channels), B = 128, A = 255.
 */
export function glassMap(w, h, { radius = 16, bevel = 12 } = {}) {
  const width = Math.max(1, Math.round(w));
  const height = Math.max(1, Math.round(h));
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const b = Math.max(1, bevel);
  const hx = width / 2 - r;
  const hy = height / 2 - r;
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - width / 2;
      const py = y + 0.5 - height / 2;
      const qx = Math.abs(px) - hx;
      const qy = Math.abs(py) - hy;
      // signed distance to the rounded rect (negative inside)
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const sdf = outside + Math.min(Math.max(qx, qy), 0) - r;
      const dist = -sdf;

      let dx = 0;
      let dy = 0;
      if (dist >= 0 && dist < b) {
        // outward normal of the nearest edge
        let nx;
        let ny;
        if (qx > 0 && qy > 0) {
          const len = Math.hypot(qx, qy) || 1;
          nx = (qx / len) * Math.sign(px);
          ny = (qy / len) * Math.sign(py);
        } else if (qx > qy) {
          nx = Math.sign(px);
          ny = 0;
        } else {
          nx = 0;
          ny = Math.sign(py);
        }
        const t = 1 - dist / b;
        const m = t * t; // ease: strongest at the rim
        dx = -nx * m; // bend inward, like a thick rounded edge
        dy = -ny * m;
      }

      const i = (y * width + x) * 4;
      data[i] = Math.round(128 + dx * 127);
      data[i + 1] = Math.round(128 + dy * 127);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  return { width, height, data };
}
