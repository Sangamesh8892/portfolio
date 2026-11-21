/* Cursor-reactive 3D grounds for the B2 glass mockups.
   start(mode, colours): mode = 'silk' | 'orbs' | 'field'.
   Sits UNDER the FluidCursor canvas; never replaces it. */
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

const col = (hex) => new THREE.Color(hex);

export function start(mode, c) {
  const canvas = document.getElementById('bg3d');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { canvas.remove(); return; } // CSS ground shows instead
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  // c is either one palette, or { dark: {...}, light: {...} } following <html data-theme>
  const palette = () => (c.dark ? c[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'] : c);
  let pal = palette();
  const clear = col(pal.bg), clearTarget = col(pal.bg);
  renderer.setClearColor(clear, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // pointer: target + eased value in NDC (-1..1), plus speed
  const ptr = { tx: 0, ty: 0, x: 0, y: 0, speed: 0, lastX: 0, lastY: 0, active: false };
  addEventListener('pointermove', (e) => {
    ptr.tx = (e.clientX / innerWidth) * 2 - 1;
    ptr.ty = -(e.clientY / innerHeight) * 2 + 1;
    ptr.active = true;
  }, { passive: true });

  const S = SCENES[mode](scene, camera, pal);
  addEventListener('themechange', () => {
    pal = palette();
    clearTarget.set(pal.bg);
    S.setTheme && S.setTheme(pal);
    if (reduce) requestAnimationFrame(frame);
  });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    S.resize && S.resize(w, h);
  }
  addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  let raf = 0;
  function frame() {
    const t = reduce ? 4 : clock.getElapsedTime();
    ptr.x += (ptr.tx - ptr.x) * 0.06;
    ptr.y += (ptr.ty - ptr.y) * 0.06;
    const dx = ptr.x - ptr.lastX, dy = ptr.y - ptr.lastY;
    ptr.speed += (Math.min(Math.hypot(dx, dy) * 30, 1) - ptr.speed) * 0.08;
    ptr.lastX = ptr.x; ptr.lastY = ptr.y;
    const k = reduce ? 1 : 0.1; // colour easing toward the current theme (snaps under reduced motion)
    clear.lerp(clearTarget, k);
    renderer.setClearColor(clear, 1);
    S.update(t, ptr, k);
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  frame();
  if (reduce) addEventListener('pointermove', () => requestAnimationFrame(frame), { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (reduce) return;
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(frame);
  });
}

const SCENES = {
  /* ---------- 1. SILK: a lit fabric surface that folds under the cursor ---------- */
  silk(scene, camera, c) {
    camera.position.set(0, 0, 9);
    const geo = new THREE.PlaneGeometry(1, 1, 220, 140);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(99, 99) }, uLift: { value: 0 },
        cA: { value: col(c.bg) }, cB: { value: col(c.mid) }, cC: { value: col(c.accent) },
      },
      vertexShader: NOISE + /* glsl */ `
        uniform float uTime; uniform vec2 uMouse; uniform float uLift;
        varying vec3 vPos; varying vec3 vN; varying float vH; varying vec2 vUv;
        float H(vec2 q){
          float n = snoise(vec3(q.x*.16, q.y*.22, uTime*.07)) + .25*snoise(vec3(q.x*.4, q.y*.5, uTime*.11));
          float d = distance(q, uMouse);
          return n*.95 + exp(-d*d*.28) * (.75 + uLift*.6);
        }
        void main(){
          vec3 p = (modelMatrix * vec4(position,1.)).xyz;
          float h = H(p.xy), e = .04;
          vN = normalize(vec3(H(p.xy - vec2(e,0.)) - H(p.xy + vec2(e,0.)), H(p.xy - vec2(0.,e)) - H(p.xy + vec2(0.,e)), 2.*e));
          p.z += h;
          vH = h; vPos = p; vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * vec4(p,1.);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 cA, cB, cC;
        varying vec3 vPos; varying vec3 vN; varying float vH; varying vec2 vUv;
        void main(){
          vec3 N = normalize(vN);
          vec3 L = normalize(vec3(-.45,.6,.75));
          vec3 V = normalize(cameraPosition - vPos);
          float diff = clamp(dot(N,L),0.,1.);
          float spec = pow(max(dot(N, normalize(L+V)),0.), 40.) * .5;
          float edge = smoothstep(.12,.6, length((vUv-.5)*vec2(1.,1.25)));   // calmer centre for the text
          vec3 base = mix(cA, cB, smoothstep(-.3,1.,vH) * mix(.45,1.,edge));
          base = mix(base, cC, smoothstep(.55,1.25,vH) * mix(.25,.9,edge));
          vec3 colr = base * (.8 + .28*diff) + spec*.18;
          gl_FragColor = vec4(colr, 1.);
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    let halfW = 1, halfH = 1;
    return {
      resize(w, h) {
        halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        halfW = halfH * camera.aspect;
        mesh.scale.set(halfW * 2 * 1.35, halfH * 2 * 1.35, 1);
      },
      update(t, p) {
        mat.uniforms.uTime.value = t;
        mat.uniforms.uMouse.value.set(p.active ? p.x * halfW : 99, p.active ? p.y * halfH : 99);
        mat.uniforms.uLift.value = p.speed;
        camera.position.x = p.x * .5; camera.position.y = p.y * .35;
        camera.lookAt(0, 0, 0);
      },
    };
  },

  /* ---------- 2. ORBS: glossy morphing blobs that lean toward the cursor ---------- */
  orbs(scene, camera, c) {
    camera.position.set(0, 0, 10);
    const geo = new THREE.IcosahedronGeometry(1, 40);
    const make = (seed) => new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uAmp: { value: .18 }, uSeed: { value: seed },
        cDeep: { value: col(c.deep) }, cBody: { value: col(c.mid) }, cRim: { value: col(c.accent) },
      },
      vertexShader: NOISE + /* glsl */ `
        uniform float uTime, uAmp, uSeed;
        varying vec3 vN; varying vec3 vV; varying float vH;
        vec3 D(vec3 d){ float n = snoise(d*.85 + vec3(uSeed, uTime*.2, uSeed*.5)); return d*(1. + uAmp*n); }
        void main(){
          vec3 d = normalize(position);
          vec3 t1 = normalize(cross(d, abs(d.y) < .99 ? vec3(0.,1.,0.) : vec3(1.,0.,0.)));
          vec3 t2 = cross(d, t1);
          vec3 p0 = D(d), p1 = D(normalize(d + t1*.01)), p2 = D(normalize(d + t2*.01));
          vec3 n = normalize(cross(p1-p0, p2-p0));
          vH = length(p0) - 1.;
          vec4 mv = modelViewMatrix * vec4(p0,1.);
          vN = normalize(normalMatrix * n); vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 cDeep, cBody, cRim; uniform float uAmp;
        varying vec3 vN; varying vec3 vV; varying float vH;
        void main(){
          vec3 N = normalize(vN);
          vec3 L = normalize(vec3(.5,.7,.6));
          float diff = clamp(dot(N,L)*.5+.5, 0., 1.);
          float fres = pow(1. - clamp(dot(N, vV),0.,1.), 2.6);
          float spec = pow(max(dot(N, normalize(L+vV)),0.), 90.);
          vec3 body = mix(cDeep, cBody, diff + vH*1.2);
          vec3 colr = body + cRim*fres*1.05 + vec3(spec)*.65;
          gl_FragColor = vec4(colr, 1.);
        }`,
    });
    const blobs = [
      { s: 1.75, x: -5.6, y: 1.9, z: -2.5, k: .55, seed: 1.3 },
      { s: 1.25, x: 5.9, y: -1.9, z: -1.2, k: .8, seed: 7.1 },
      { s: .5, x: 4.1, y: 2.6, z: .8, k: 1.2, seed: 3.7 },
      { s: .34, x: -4.2, y: -2.7, z: 1.2, k: 1.4, seed: 9.9 },
    ].map((b) => { const m = new THREE.Mesh(geo, make(b.seed)); m.scale.setScalar(b.s); scene.add(m); return { ...b, m }; });
    let spread = 1;
    return {
      resize(w, h) {
        spread = Math.min(1, (w / h) * .7);               // keep orbs on the screen edges, off the text
        const k = w < 700 ? .62 : 1;
        for (const b of blobs) b.m.scale.setScalar(b.s * k);
      },
      update(t, p) {
        for (const b of blobs) {
          const mat = b.m.material;
          mat.uniforms.uTime.value = t;
          mat.uniforms.uAmp.value = .12 + p.speed * .16;
          b.m.position.set(b.x * spread + p.x * b.k, b.y + Math.sin(t * .4 + b.seed) * .18 + p.y * b.k * .7, b.z);
          b.m.rotation.y = t * .08 + b.seed; b.m.rotation.x = p.y * .3;
        }
      },
    };
  },

  /* ---------- 2b. NEURAL: two latent-space cores, an agent graph, tokens flowing,
     and attention lines from the cursor to the nodes it is near ---------- */
  neural(scene, camera, pal) {
    camera.position.set(0, 0, 10);
    const PR = Math.min(devicePixelRatio, 1.75);
    const KEYS = ['core', 'coreHot', 'node', 'edge', 'hot', 'pulse', 'bg'];
    const cur = {}, tgt = {};
    let additive = false, alpha = 1;
    const mats = [];
    const setTheme = (p) => {
      for (const k of KEYS) { tgt[k] = col(p[k]); if (!cur[k]) cur[k] = col(p[k]); }
      additive = !!p.additive; alpha = p.alpha ?? 1;
      if (typeof haloMat !== 'undefined') haloMat.uniforms.uGlow.value = p.glow ?? .4;
      for (const m of mats) { m.blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending; m.needsUpdate = true; if (m.uniforms && m.uniforms.uAlpha) m.uniforms.uAlpha.value = alpha; }
    };
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const track = (m) => { mats.push(m); return m; };

    /* --- latent cores: fibonacci point spheres + an orbiting token ring --- */
    const coreVS = NOISE + /* glsl */ `
      attribute float aR;
      uniform float uTime, uAmp, uSeed, uPR, uSize;
      varying float vHot; varying float vFade;
      void main(){
        vec3 d = normalize(position);
        float n = snoise(d*1.5 + vec3(uSeed, uTime*.28, 0.));
        vec3 p = d*(1. + uAmp*n);
        vec4 mv = modelViewMatrix * vec4(p,1.);
        vec3 vn = normalize(normalMatrix * d);
        vFade = .22 + .78*smoothstep(-.5,.9,vn.z);
        vHot = smoothstep(.1,.7,n);
        gl_PointSize = uSize * uPR * (10. / -mv.z) * (.6 + .8*aR);
        gl_Position = projectionMatrix * mv;
      }`;
    const coreFS = /* glsl */ `
      uniform vec3 cA, cB; uniform float uAlpha;
      varying float vHot; varying float vFade;
      void main(){
        float r = length(gl_PointCoord - .5); if (r > .5) discard;
        gl_FragColor = vec4(mix(cA, cB, vHot), smoothstep(.5,.12,r) * vFade * uAlpha);
      }`;
    const coreMat = (amp, size, s) => track(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uAmp: { value: amp }, uSeed: { value: s }, uPR: { value: PR }, uSize: { value: size }, uAlpha: { value: 1 },
        cA: { value: null }, cB: { value: null } },
      vertexShader: coreVS, fragmentShader: coreFS,
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
        const a = (i / n) * Math.PI * 2 + rnd() * .02;
        p.set([Math.cos(a), (rnd() - .5) * .05, Math.sin(a)], i * 3);
      }
      return p;
    };
    const haloMat = track(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { cA: { value: null }, uAlpha: { value: 1 }, uGlow: { value: .4 } },
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: /* glsl */ `uniform vec3 cA; uniform float uAlpha, uGlow; varying vec2 vUv;
        void main(){ float d = length(vUv - .5) * 2.; float a = pow(max(1. - d, 0.), 2.2) * uGlow;
          gl_FragColor = vec4(cA, a * uAlpha); }`,
    }));
    const CORES = [
      { r: 1.7, x: -5.5, y: 1.75, z: -2.2, k: .5, n: 2600, s: 1.3, tilt: .55 },
      { r: 1.15, x: 5.7, y: -1.85, z: -1.0, k: .75, n: 1600, s: 6.1, tilt: -.65 },
    ].map((c) => {
      const g = new THREE.Group();
      const sphere = new THREE.Points(pointsGeo(fib(c.n)), coreMat(.12, 3.4, c.s));
      sphere.scale.setScalar(c.r);
      const orbit = new THREE.Points(pointsGeo(ring(Math.round(c.n / 9))), coreMat(.015, 3.6, c.s + 3));
      orbit.scale.setScalar(c.r * 1.6);
      const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloMat);
      halo.scale.setScalar(c.r * 4.2); halo.position.z = -.2;
      g.add(halo, sphere, orbit);
      scene.add(g);
      return { ...c, g, sphere, orbit };
    });

    /* --- agent graph: nodes around the edges of the screen, centre kept clear for the text --- */
    const nodes = [];
    while (nodes.length < 64) {
      const x = (rnd() * 2 - 1) * 7.6, y = (rnd() * 2 - 1) * 4.1, z = -3 + rnd() * 4;
      if ((x / 3.4) ** 2 + (y / 2.5) ** 2 < 1) continue;
      if (CORES.some((c) => Math.hypot(x - c.x, y - c.y, z - c.z) < c.r * 1.8)) continue;
      nodes.push({ x, y, z, ph: rnd() * 6.28, glow: 0 });
    }
    const NN = nodes.length, N = NN + CORES.length;
    const edges = [], seen = new Set();
    const addE = (a, b) => { const key = a < b ? `${a}-${b}` : `${b}-${a}`; if (a !== b && !seen.has(key)) { seen.add(key); edges.push([a, b]); } };
    const d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
    nodes.forEach((n, i) => nodes.map((m, j) => [j, d2(n, m)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => addE(i, j)));
    CORES.forEach((c, ci) => nodes.map((m, j) => [j, d2(c, m)]).sort((a, b) => a[1] - b[1]).slice(0, 7).forEach(([j]) => addE(NN + ci, j)));
    const adj = Array.from({ length: N }, () => []);
    edges.forEach(([a, b], e) => { adj[a].push(e); adj[b].push(e); });

    const W = Array.from({ length: N }, () => new THREE.Vector3()); // world positions, per frame
    const tmp = new THREE.Vector3();
    const endpoint = (a, b, out) => { // a core's edge starts on its surface, not its centre
      out.copy(W[a]);
      if (a >= NN) { const c = CORES[a - NN]; tmp.subVectors(W[b], W[a]).normalize().multiplyScalar(c.r * c.g.scale.x * 1.02); out.add(tmp); }
      return out;
    };

    const edgePos = new Float32Array(edges.length * 6), edgeCol = new Float32Array(edges.length * 6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeCol, 3));
    scene.add(new THREE.LineSegments(edgeGeo, track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }))));

    const dotVS = /* glsl */ `
      attribute float aA; uniform float uPR, uSize;
      varying float vA;
      void main(){ vA = aA; vec4 mv = modelViewMatrix * vec4(position,1.);
        gl_PointSize = uSize * (.55 + aA) * uPR * (10. / -mv.z); gl_Position = projectionMatrix * mv; }`;
    const dotFS = /* glsl */ `
      uniform vec3 cA, cB; uniform float uMix, uAlpha; varying float vA;
      void main(){ float r = length(gl_PointCoord - .5); if (r > .5) discard;
        vec3 c = mix(cA, cB, uMix > .5 ? vA : 0.);
        float a = uMix > .5 ? .75 + .25*vA : vA;
        gl_FragColor = vec4(c, smoothstep(.5,.2,r) * a * uAlpha); }`;
    const dotMat = (size, mixMode) => track(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uPR: { value: PR }, uSize: { value: size }, uMix: { value: mixMode }, uAlpha: { value: 1 }, cA: { value: null }, cB: { value: null } },
      vertexShader: dotVS, fragmentShader: dotFS,
    }));
    const dotGeo = (n) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(n), 1));
      return g;
    };
    const nodeGeo = dotGeo(NN), nodeMat = dotMat(4.8, 1);
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    /* --- tokens: pulses that hop from edge to edge, each with a short tail --- */
    const P = 34, TAIL = [0, .045, .09], TAIL_A = [1, .5, .22];
    const pulses = Array.from({ length: P }, () => ({ e: Math.floor(rnd() * edges.length), fwd: rnd() > .5, t: rnd(), sp: .35 + rnd() * .35 }));
    const pulseGeo = dotGeo(P * TAIL.length), pulseMat = dotMat(4.2, 0);
    scene.add(new THREE.Points(pulseGeo, pulseMat));

    /* --- attention: lines from the cursor to the nodes it is near --- */
    const A = 6, attnPos = new Float32Array(A * 6), attnCol = new Float32Array(A * 6);
    const attnGeo = new THREE.BufferGeometry();
    attnGeo.setAttribute('position', new THREE.BufferAttribute(attnPos, 3));
    attnGeo.setAttribute('color', new THREE.BufferAttribute(attnCol, 3));
    scene.add(new THREE.LineSegments(attnGeo, track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }))));

    setTheme(pal);
    const bindColours = () => {
      for (const c of CORES) {
        c.sphere.material.uniforms.cA.value = cur.core; c.sphere.material.uniforms.cB.value = cur.coreHot;
        c.orbit.material.uniforms.cA.value = cur.core; c.orbit.material.uniforms.cB.value = cur.coreHot;
      }
      haloMat.uniforms.cA.value = cur.core;
      nodeMat.uniforms.cA.value = cur.node; nodeMat.uniforms.cB.value = cur.hot;
      pulseMat.uniforms.cA.value = cur.pulse; pulseMat.uniforms.cB.value = cur.pulse;
    };
    bindColours();

    let spread = 1, halfW = 1, halfH = 1, coreK = 1, last = 0;
    const C = new THREE.Vector3(), a3 = new THREE.Vector3(), b3 = new THREE.Vector3(), mixC = new THREE.Color(), eC = new THREE.Color();
    const writeCol = (arr, i, s) => { mixC.copy(cur.bg).lerp(s.c, s.k); arr[i] = mixC.r; arr[i + 1] = mixC.g; arr[i + 2] = mixC.b; };

    return {
      setTheme,
      resize(w, h) {
        spread = Math.min(1, (w / h) * .7);
        coreK = w < 700 ? .62 : 1;
        halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        halfW = halfH * camera.aspect;
      },
      update(t, p, k) {
        const dt = Math.min(t - last, .05); last = t;
        for (const key of KEYS) cur[key].lerp(tgt[key], k);

        // cores lean toward the cursor and breathe faster when it moves fast
        CORES.forEach((c, i) => {
          c.g.scale.setScalar(coreK);
          c.g.position.set(c.x * spread + p.x * c.k, c.y + Math.sin(t * .4 + c.s) * .15 + p.y * c.k * .7, c.z);
          c.sphere.rotation.y = t * .06 + c.s;
          c.orbit.rotation.set(c.tilt + p.y * .15, t * .3 * (i ? -1 : 1), .2);
          for (const m of [c.sphere.material, c.orbit.material]) m.uniforms.uTime.value = t;
          c.sphere.material.uniforms.uAmp.value = .1 + p.speed * .16;
          W[NN + i].copy(c.g.position);
        });

        // nodes drift a little; glow when the cursor is near
        C.set(p.x * halfW, p.y * halfH, 0);
        const np = nodeGeo.attributes.position.array, na = nodeGeo.attributes.aA.array;
        nodes.forEach((n, i) => {
          W[i].set(n.x * spread + Math.sin(t * .3 + n.ph) * .08, n.y + Math.cos(t * .25 + n.ph) * .08, n.z);
          const g = p.active ? Math.max(0, 1 - Math.hypot(W[i].x - C.x, W[i].y - C.y) / 2.6) : 0;
          n.glow += (g - n.glow) * .12;
          np.set([W[i].x, W[i].y, W[i].z], i * 3); na[i] = n.glow;
        });
        nodeGeo.attributes.position.needsUpdate = true; nodeGeo.attributes.aA.needsUpdate = true;

        // graph edges, brighter where they touch a glowing node
        edges.forEach(([a, b], e) => {
          endpoint(a, b, a3); endpoint(b, a, b3);
          edgePos.set([a3.x, a3.y, a3.z, b3.x, b3.y, b3.z], e * 6);
          const ga = a < NN ? nodes[a].glow : 0, gb = b < NN ? nodes[b].glow : 0;
          const depth = .35 + .4 * Math.min(1, Math.max(0, (Math.min(a3.z, b3.z) + 3) / 4));
          writeCol(edgeCol, e * 6, { c: eC.copy(cur.edge).lerp(cur.hot, ga * .7), k: depth });
          writeCol(edgeCol, e * 6 + 3, { c: eC.copy(cur.edge).lerp(cur.hot, gb * .7), k: depth });
        });
        edgeGeo.attributes.position.needsUpdate = true; edgeGeo.attributes.color.needsUpdate = true;

        // tokens hop along the graph
        const pp = pulseGeo.attributes.position.array, pa = pulseGeo.attributes.aA.array;
        pulses.forEach((q, i) => {
          const [a, b] = edges[q.e], from = q.fwd ? a : b, to = q.fwd ? b : a;
          endpoint(from, to, a3); endpoint(to, from, b3);
          q.t += dt * q.sp * (2.2 / Math.max(a3.distanceTo(b3), .8));
          if (q.t >= 1) {
            const opts = adj[to].filter((e) => e !== q.e), next = opts.length ? opts[Math.floor(rnd() * opts.length)] : q.e;
            q.fwd = edges[next][0] === to; q.e = next; q.t = 0;
          }
          TAIL.forEach((off, j) => {
            const tt = Math.max(0, q.t - off);
            tmp.lerpVectors(a3, b3, tt);
            pp.set([tmp.x, tmp.y, tmp.z], (i * TAIL.length + j) * 3);
            pa[i * TAIL.length + j] = q.t - off < 0 ? 0 : TAIL_A[j];
          });
        });
        pulseGeo.attributes.position.needsUpdate = true; pulseGeo.attributes.aA.needsUpdate = true;

        // attention lines: cursor -> nearest glowing nodes
        const near = nodes.map((n, i) => [i, n.glow]).filter(([, g]) => g > .04).sort((x, y) => y[1] - x[1]).slice(0, A);
        for (let s = 0; s < A; s++) {
          const hit = near[s];
          const tgtP = hit ? W[hit[0]] : C;
          attnPos.set([C.x, C.y, C.z, tgtP.x, tgtP.y, tgtP.z], s * 6);
          const g = hit ? hit[1] : 0;
          writeCol(attnCol, s * 6, { c: cur.hot, k: g * .25 });
          writeCol(attnCol, s * 6 + 3, { c: cur.hot, k: g * .85 });
        }
        attnGeo.attributes.position.needsUpdate = true; attnGeo.attributes.color.needsUpdate = true;
      },
    };
  },

  /* ---------- 3. FIELD: a dot terrain that ripples where the cursor lands ---------- */
  field(scene, camera, c) {
    camera.position.set(0, 3.4, 10);
    camera.lookAt(0, -.4, -2);
    const NX = 230, NZ = 120, W = 34, Dp = 22;
    const pos = new Float32Array(NX * NZ * 3);
    let i = 0;
    for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) {
      pos[i++] = (x / (NX - 1) - .5) * W; pos[i++] = 0; pos[i++] = (z / (NZ - 1)) * -Dp + 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: {
        uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(99, 99) }, uHit: { value: 0 },
        uPR: { value: Math.min(devicePixelRatio, 1.75) },
        cDot: { value: col(c.mid) }, cHot: { value: col(c.accent) }, cBg: { value: col(c.bg) },
      },
      vertexShader: NOISE + /* glsl */ `
        uniform float uTime, uHit, uPR; uniform vec2 uMouse;
        varying float vHot; varying float vFog; varying float vH;
        void main(){
          vec3 p = position;
          float d = distance(p.xz, uMouse);
          float wave = sin(p.x*.32 + uTime*.55)*.18 + snoise(vec3(p.x*.09, p.z*.11, uTime*.08))*.75;
          float lift = exp(-d*d*.09) * 1.5 * uHit;
          float ring = sin(d*1.9 - uTime*3.2) * exp(-d*.32) * .32 * uHit;
          p.y = wave + lift + ring;
          vH = wave; vHot = clamp(exp(-d*d*.07)*uHit, 0., 1.);
          vec4 mv = modelViewMatrix * vec4(p,1.);
          vFog = smoothstep(26., 6., -mv.z);
          gl_PointSize = (1.7 + vHot*1.4 + max(wave,0.)*.6) * uPR * (11. / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 cDot, cHot, cBg;
        varying float vHot; varying float vFog; varying float vH;
        void main(){
          float r = length(gl_PointCoord - .5); if (r > .5) discard;
          vec3 colr = mix(cDot, cHot, vHot);
          float a = smoothstep(.5,.2,r) * vFog * (.42 + vHot*.5 + max(vH,0.)*.25);
          gl_FragColor = vec4(colr, a);
        }`,
    });
    scene.add(new THREE.Points(geo, mat));
    const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
    const target = new THREE.Vector2(99, 99), ndc = new THREE.Vector2();
    let hitAmt = 0;
    return {
      update(t, p) {
        mat.uniforms.uTime.value = t;
        let on = 0;
        if (p.active) {
          ndc.set(p.x, p.y); ray.setFromCamera(ndc, camera);
          if (ray.ray.intersectPlane(plane, hit) && hit.z > -Dp + 6) { target.set(hit.x, hit.z); on = 1; }
        }
        hitAmt += (on - hitAmt) * .05;
        mat.uniforms.uMouse.value.lerp(target, .12);
        mat.uniforms.uHit.value = hitAmt;
        camera.position.x = p.x * .6;
        camera.lookAt(0, -.4, -2);
      },
    };
  },
};
