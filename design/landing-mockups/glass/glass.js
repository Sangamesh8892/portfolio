/* Shared runtime for the B2 glass mockups:
   1. the SVG refraction filter that .glass::before uses (same idea as liquid-glass-react)
   2. Chromium check (edge refraction only works there; others keep the blur)
   3. pointer sheen on glass surfaces
   4. starts the real, unchanged FluidCursor */
(function () {
  // 1. refraction filter
  document.body.insertAdjacentHTML('afterbegin', `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <filter id="liquid" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="11" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="2.5" result="map"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="46" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </svg>`);

  // 2. Chromium only gets refraction
  const isChromium = !!(navigator.userAgentData && navigator.userAgentData.brands &&
    navigator.userAgentData.brands.some(b => /Chromium/.test(b.brand)));
  if (!isChromium) document.documentElement.classList.add('no-refract');

  // 3. sheen follows the pointer across glass
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest && e.target.closest('.glass');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });

  // 4. the real FluidCursor, unchanged
  if (window.fluidCursor) window.fluidCursor();
})();
