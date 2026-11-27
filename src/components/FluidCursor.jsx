'use client';
import { useEffect, useState } from 'react';

import fluidCursor from '@/hooks/use-FluidCursor';

/**
 * Colour-splash cursor. Runs only for a real mouse (on phones a scroll swipe
 * would paint over the text being read) and never under reduced motion.
 */
const FluidCursor = () => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setOn(finePointer && !reduce);
  }, []);

  useEffect(() => {
    if (on) fluidCursor();
  }, [on]);

  if (!on) return null;
  return (
    <div className="fixed top-0 left-0 z-0">
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
