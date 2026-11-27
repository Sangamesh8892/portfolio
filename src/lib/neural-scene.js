/**
 * GenAI "neural" background: two latent-space cores (point spheres with orbit
 * rings and a soft halo), an agent graph with token pulses hopping along its
 * edges, and attention lines from the cursor to the nodes it is near.
 * The canvas is transparent, so the CSS colour field (ColorField) shows through.
 *
 * createNeuralScene(canvas, palette) -> { setPalette(palette), destroy() }
 * Colours ease toward a new palette; under reduced motion it renders one still
 * frame and re-renders only on pointer move or a palette change.
 */
import * as THREE from 'three';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const KEYS = ['bg', 'core', 'coreHot', 'node', 'edge', 'hot', 'pulse'];

export function createNeuralScene(canvas, palette) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null; // no WebGL: the CSS background shows instead
  }
  const PR = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.75);
  renderer.setPixelRatio(PR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = 0, raf = 0, running = true;

  /* ---------- palette (current colours ease toward target) ---------- */
  const cur = {}, tgt = {};
  const mats = [];
  const track = (m) => (mats.push(m), m);
  let additive = false;
  function applyPalette(p) {
    for (const k of KEYS) {
      tgt[k] = new THREE.Color(p[k]);
      if (!cur[k]) cur[k] = new THREE.Color(p[k]);
    }
    additive = !!p.additive;
    for (const m of mats) {
      m.blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending;
      m.needsUpdate = true;
      if (m.uniforms?.uAlpha) m.uniforms.uAlpha.value = p.alpha ?? 1;
      if (m.uniforms?.uGlow) m.uniforms.uGlow.value = p.glow ?? 0.4;
    }
  }

  /* ---------- seeded random, so the layout is the same every visit ---------- */
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  /* ---------- latent cores ---------- */
  const coreMat = (amp, size, s) =>
    track(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: {
        uTime: { value: 0 }, uAmp: { value: amp }, uSeed: { value: s }, uPR: { value: PR },
        uSize: { value: size }, uAlpha: { value: 1 }, cA: { value: null }, cB: { value: null },
      },
      vertexShader: NOISE + /* glsl */ `
        attribute float aR;
        uniform float uTime, uAmp, uSeed, uPR, uSize;
        varying float vHot; varying float vFade;
        void main(){
          vec3 d = normalize(position);
          float n = snoise(d*1.5 + vec3(uSeed, uTime*.28, 0.));
          vec4 mv = modelViewMatrix * vec4(d*(1. + uAmp*n), 1.);
          vec3 vn = normalize(normalMatrix * d);
          vFade = .22 + .78*smoothstep(-.5,.9,vn.z);
          vHot = smoothstep(.1,.7,n);
          gl_PointSize = uSize * uPR * (10. / -mv.z) * (.6 + .8*aR);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 cA, cB; uniform float uAlpha;
        varying float vHot; varying float vFade;
        void main(){
          float r = length(gl_PointCoord - .5); if (r > .5) discard;
          gl_FragColor = vec4(mix(cA, cB, vHot), smoothstep(.5,.12,r) * vFade * uAlpha);
        }`,
    }));
  const haloMat = track(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { cA: { value: null }, uAlpha: { value: 1 }, uGlow: { value: 0.4 } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: /* glsl */ `uniform vec3 cA; uniform float uAlpha, uGlow; varying vec2 vUv;
      void main(){ float d = length(vUv - .5) * 2.; gl_FragColor = vec4(cA, pow(max(1. - d, 0.), 2.2) * uGlow * uAlpha); }`,
  }));
  const pointsGeo = (pos) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aR', new THREE.BufferAttribute(Float32Array.from({ length: pos.length / 3 }, rnd), 1));
    return g;
  };
  const fib = (n) => {
    const p = new Float32Array(n * 3), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
      p.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
    }
    return p;
  };
  const ring = (n) => {
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.02;
      p.set([Math.cos(a), (rnd() - 0.5) * 0.05, Math.sin(a)], i * 3);
    }
    return p;
  };
  const haloGeo = new THREE.PlaneGeometry(1, 1);
  const CORES = [
    { r: 1.7, x: -5.5, y: 1.75, z: -2.2, k: 0.5, n: 2600, s: 1.3, tilt: 0.55 },
    { r: 1.15, x: 5.7, y: -1.85, z: -1.0, k: 0.75, n: 1600, s: 6.1, tilt: -0.65 },
  ].map((c) => {
    const g = new THREE.Group();
    const sphere = new THREE.Points(pointsGeo(fib(c.n)), coreMat(0.12, 3.4, c.s));
    sphere.scale.setScalar(c.r);
    const orbit = new THREE.Points(pointsGeo(ring(Math.round(c.n / 9))), coreMat(0.015, 3.6, c.s + 3));
    orbit.scale.setScalar(c.r * 1.6);
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.scale.setScalar(c.r * 4.2);
    halo.position.z = -0.2;
    g.add(halo, sphere, orbit);
    scene.add(g);
    return { ...c, g, sphere, orbit };
  });

  /* ---------- agent graph (centre kept clear for the headline) ---------- */
  const nodes = [];
  while (nodes.length < 48) {
    const x = (rnd() * 2 - 1) * 7.6, y = (rnd() * 2 - 1) * 4.1, z = -3 + rnd() * 4;
    if ((x / 3.4) ** 2 + (y / 2.5) ** 2 < 1) continue;
    if (CORES.some((c) => Math.hypot(x - c.x, y - c.y, z - c.z) < c.r * 1.8)) continue;
    nodes.push({ x, y, z, ph: rnd() * 6.28, glow: 0 });
  }
  const NN = nodes.length, N = NN + CORES.length;
  const edges = [], seen = new Set();
  const addE = (a, b) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a !== b && !seen.has(key)) { seen.add(key); edges.push([a, b]); }
  };
  const d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
  nodes.forEach((n, i) =>
    nodes.map((m, j) => [j, d2(n, m)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => addE(i, j)));
  CORES.forEach((c, ci) =>
    nodes.map((m, j) => [j, d2(c, m)]).sort((a, b) => a[1] - b[1]).slice(0, 7).forEach(([j]) => addE(NN + ci, j)));
  const adj = Array.from({ length: N }, () => []);
  edges.forEach(([a, b], e) => { adj[a].push(e); adj[b].push(e); });

  const W = Array.from({ length: N }, () => new THREE.Vector3());
  const tmp = new THREE.Vector3();
  const endpoint = (a, b, out) => {
    out.copy(W[a]);
    if (a >= NN) {
      const c = CORES[a - NN];
      tmp.subVectors(W[b], W[a]).normalize().multiplyScalar(c.r * c.g.scale.x * 1.02);
      out.add(tmp);
    }
    return out;
  };

  const lineSet = (count) => {
    const pos = new Float32Array(count * 6), colr = new Float32Array(count * 6);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colr, 3));
    scene.add(new THREE.LineSegments(g, track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }))));
    return { g, pos, colr };
  };
  const edgeL = lineSet(edges.length);

  const dotMat = (size, mixMode) =>
    track(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uPR: { value: PR }, uSize: { value: size }, uMix: { value: mixMode }, uAlpha: { value: 1 }, cA: { value: null }, cB: { value: null } },
      vertexShader: /* glsl */ `
        attribute float aA; uniform float uPR, uSize; varying float vA;
        void main(){ vA = aA; vec4 mv = modelViewMatrix * vec4(position,1.);
          gl_PointSize = uSize * (.55 + aA) * uPR * (10. / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 cA, cB; uniform float uMix, uAlpha; varying float vA;
        void main(){ float r = length(gl_PointCoord - .5); if (r > .5) discard;
          vec3 c = mix(cA, cB, uMix > .5 ? vA : 0.);
          float a = uMix > .5 ? .75 + .25*vA : vA;
          gl_FragColor = vec4(c, smoothstep(.5,.2,r) * a * uAlpha); }`,
    }));
  const dotGeo = (n) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(n), 1));
    return g;
  };
  const nodeGeo = dotGeo(NN), nodeMat = dotMat(4.8, 1);
  scene.add(new THREE.Points(nodeGeo, nodeMat));

  /* ---------- tokens ---------- */
  const P = 34, TAIL = [0, 0.045, 0.09], TAIL_A = [1, 0.5, 0.22];
  const pulses = Array.from({ length: P }, () => ({ e: Math.floor(rnd() * edges.length), fwd: rnd() > 0.5, t: rnd(), sp: 0.35 + rnd() * 0.35 }));
  const pulseGeo = dotGeo(P * TAIL.length), pulseMat = dotMat(4.2, 0);
  scene.add(new THREE.Points(pulseGeo, pulseMat));

  /* ---------- attention lines ---------- */
  const A = 6;
  const attnL = lineSet(A);

  applyPalette(palette);
  for (const c of CORES) {
    for (const m of [c.sphere.material, c.orbit.material]) { m.uniforms.cA.value = cur.core; m.uniforms.cB.value = cur.coreHot; }
  }
  haloMat.uniforms.cA.value = cur.core;
  nodeMat.uniforms.cA.value = cur.node; nodeMat.uniforms.cB.value = cur.hot;
  pulseMat.uniforms.cA.value = cur.pulse; pulseMat.uniforms.cB.value = cur.pulse;
  const clear = cur.bg;

  /* ---------- input + sizing ---------- */
  const ptr = { tx: 0, ty: 0, x: 0, y: 0, lx: 0, ly: 0, speed: 0, active: false };
  const onMove = (e) => {
    ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    ptr.active = true;
    if (reduce) requestFrame();
  };
  let spread = 1, halfW = 1, halfH = 1, coreK = 1;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    spread = Math.min(1, (w / h) * 0.7);
    coreK = w < 700 ? 0.62 : 1;
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
    if (reduce) requestFrame();
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', resize);
  resize();

  /* ---------- frame ---------- */
  const C = new THREE.Vector3(), a3 = new THREE.Vector3(), b3 = new THREE.Vector3();
  const mixC = new THREE.Color(), eC = new THREE.Color();
  const writeCol = (arr, i, c, k) => {
    mixC.copy(cur.bg).lerp(c, k);
    arr[i] = mixC.r; arr[i + 1] = mixC.g; arr[i + 2] = mixC.b;
  };
  const clock = new THREE.Clock();

  function frame() {
    raf = 0;
    const t = reduce ? 4 : clock.getElapsedTime();
    const dt = reduce ? 0 : Math.min(t - last, 0.05);
    last = t;
    const k = reduce ? 1 : 0.1;
    for (const key of KEYS) cur[key].lerp(tgt[key], k);
    renderer.setClearColor(clear, 0); // transparent: the CSS colour field shows through

    ptr.x += (ptr.tx - ptr.x) * (reduce ? 1 : 0.06);
    ptr.y += (ptr.ty - ptr.y) * (reduce ? 1 : 0.06);
    ptr.speed += (Math.min(Math.hypot(ptr.x - ptr.lx, ptr.y - ptr.ly) * 30, 1) - ptr.speed) * 0.08;
    ptr.lx = ptr.x; ptr.ly = ptr.y;

    CORES.forEach((c, i) => {
      c.g.scale.setScalar(coreK);
      c.g.position.set(c.x * spread + ptr.x * c.k, c.y + Math.sin(t * 0.4 + c.s) * 0.15 + ptr.y * c.k * 0.7, c.z);
      c.sphere.rotation.y = t * 0.06 + c.s;
      c.orbit.rotation.set(c.tilt + ptr.y * 0.15, t * 0.3 * (i ? -1 : 1), 0.2);
      c.sphere.material.uniforms.uTime.value = t;
      c.orbit.material.uniforms.uTime.value = t;
      c.sphere.material.uniforms.uAmp.value = 0.1 + ptr.speed * 0.16;
      W[NN + i].copy(c.g.position);
    });

    C.set(ptr.x * halfW, ptr.y * halfH, 0);
    const np = nodeGeo.attributes.position.array, na = nodeGeo.attributes.aA.array;
    nodes.forEach((n, i) => {
      W[i].set(n.x * spread + Math.sin(t * 0.3 + n.ph) * 0.08, n.y + Math.cos(t * 0.25 + n.ph) * 0.08, n.z);
      const g = ptr.active ? Math.max(0, 1 - Math.hypot(W[i].x - C.x, W[i].y - C.y) / 2.6) : 0;
      n.glow += (g - n.glow) * (reduce ? 1 : 0.12);
      np[i * 3] = W[i].x; np[i * 3 + 1] = W[i].y; np[i * 3 + 2] = W[i].z;
      na[i] = n.glow;
    });
    nodeGeo.attributes.position.needsUpdate = true;
    nodeGeo.attributes.aA.needsUpdate = true;

    edges.forEach(([a, b], e) => {
      endpoint(a, b, a3); endpoint(b, a, b3);
      edgeL.pos.set([a3.x, a3.y, a3.z, b3.x, b3.y, b3.z], e * 6);
      const ga = a < NN ? nodes[a].glow : 0, gb = b < NN ? nodes[b].glow : 0;
      const depth = 0.35 + 0.4 * Math.min(1, Math.max(0, (Math.min(a3.z, b3.z) + 3) / 4));
      writeCol(edgeL.colr, e * 6, eC.copy(cur.edge).lerp(cur.hot, ga * 0.7), depth);
      writeCol(edgeL.colr, e * 6 + 3, eC.copy(cur.edge).lerp(cur.hot, gb * 0.7), depth);
    });
    edgeL.g.attributes.position.needsUpdate = true;
    edgeL.g.attributes.color.needsUpdate = true;

    const pp = pulseGeo.attributes.position.array, pa = pulseGeo.attributes.aA.array;
    pulses.forEach((q, i) => {
      const [a, b] = edges[q.e], from = q.fwd ? a : b, to = q.fwd ? b : a;
      endpoint(from, to, a3); endpoint(to, from, b3);
      q.t += dt * q.sp * (2.2 / Math.max(a3.distanceTo(b3), 0.8));
      if (q.t >= 1) {
        const opts = adj[to].filter((e) => e !== q.e);
        const next = opts.length ? opts[Math.floor(rnd() * opts.length)] : q.e;
        q.fwd = edges[next][0] === to; q.e = next; q.t = 0;
      }
      TAIL.forEach((off, j) => {
        tmp.lerpVectors(a3, b3, Math.max(0, q.t - off));
        const idx = i * TAIL.length + j;
        pp[idx * 3] = tmp.x; pp[idx * 3 + 1] = tmp.y; pp[idx * 3 + 2] = tmp.z;
        pa[idx] = q.t - off < 0 ? 0 : TAIL_A[j];
      });
    });
    pulseGeo.attributes.position.needsUpdate = true;
    pulseGeo.attributes.aA.needsUpdate = true;

    const near = nodes.map((n, i) => [i, n.glow]).filter(([, g]) => g > 0.04).sort((x, y) => y[1] - x[1]).slice(0, A);
    for (let s = 0; s < A; s++) {
      const hit = near[s], to = hit ? W[hit[0]] : C, g = hit ? hit[1] : 0;
      attnL.pos.set([C.x, C.y, C.z, to.x, to.y, to.z], s * 6);
      writeCol(attnL.colr, s * 6, cur.hot, g * 0.25);
      writeCol(attnL.colr, s * 6 + 3, cur.hot, g * 0.85);
    }
    attnL.g.attributes.position.needsUpdate = true;
    attnL.g.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
    if (!reduce && running) raf = requestAnimationFrame(frame);
  }
  function requestFrame() { if (!raf && running) raf = requestAnimationFrame(frame); }
  const onVisibility = () => {
    if (reduce) return;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else requestFrame();
  };
  document.addEventListener('visibilitychange', onVisibility);
  requestFrame();

  return {
    setPalette(p) {
      applyPalette(p);
      if (reduce) requestFrame();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse((o) => { o.geometry?.dispose(); });
      mats.forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
}
