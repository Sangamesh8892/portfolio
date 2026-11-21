'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { NEURAL_PALETTES } from '@/lib/theme-palettes';

const paletteFor = (theme) => NEURAL_PALETTES[theme === 'dark' ? 'dark' : 'light'];

/** Full-screen 3D background shared by every page. three.js loads after first paint. */
export default function NeuralBackground() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let scene = null;
    let cancelled = false;
    import('@/lib/neural-scene').then(({ createNeuralScene }) => {
      if (cancelled || !canvasRef.current) return;
      const isDark = document.documentElement.classList.contains('dark');
      scene = createNeuralScene(canvasRef.current, paletteFor(isDark ? 'dark' : 'light'));
      sceneRef.current = scene;
    });
    return () => {
      cancelled = true;
      scene?.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resolvedTheme) sceneRef.current?.setPalette(paletteFor(resolvedTheme));
  }, [resolvedTheme]);

  return <canvas ref={canvasRef} className="neural-bg" aria-hidden="true" />;
}
