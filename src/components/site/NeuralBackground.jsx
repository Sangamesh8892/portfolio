'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { subscribeStory } from '@/lib/story-store';
import { NEURAL_PALETTES } from '@/lib/theme-palettes';

const paletteFor = (theme) => NEURAL_PALETTES[theme === 'dark' ? 'dark' : 'light'];

/**
 * Full-screen 3D neural layer over the colour field, shared by every page.
 * three.js loads after first paint. It steps back (.is-quiet) while the agent
 * chapters are on screen, so their demos stay easy to read.
 */
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
      // fade in after the first frame, so it doesn't pop in mid-intro
      requestAnimationFrame(() => requestAnimationFrame(() => canvasRef.current?.classList.add('is-ready')));
    });
    const unsubscribe = subscribeStory((s) => canvasRef.current?.classList.toggle('is-quiet', !!s.quiet));
    return () => {
      cancelled = true;
      unsubscribe();
      scene?.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resolvedTheme) sceneRef.current?.setPalette(paletteFor(resolvedTheme));
  }, [resolvedTheme]);

  return <canvas ref={canvasRef} className="neural-bg" aria-hidden="true" />;
}
