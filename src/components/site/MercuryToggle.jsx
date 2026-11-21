'use client';

import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

/*
 * Liquid-mercury theme switch.
 * - A chrome droplet slides between sun (light) and moon (dark).
 * - It stretches with its own speed; a smaller trailing droplet lags behind and the
 *   #mercury-goo filter (GlassRuntime) merges them, so it splits and re-forms like mercury.
 * - Crisp specular highlights ride on top, outside the goo filter.
 * - Click, Space/Enter, or drag the droplet. Reduced motion: it moves without springing.
 */
const TRACK_W = 68;
const KNOB = 26;
const PAD = 5;
const TRAVEL = TRACK_W - KNOB - PAD * 2;

const MAIN_SPRING = { stiffness: 520, damping: 32, mass: 0.9 };
const TRAIL_SPRING = { stiffness: 170, damping: 16, mass: 1 };
const PRESS_SPRING = { stiffness: 600, damping: 28 };

export default function MercuryToggle({ className = '' }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const target = isDark ? TRAVEL : 0;

  const x = useSpring(target, MAIN_SPRING);
  const trail = useSpring(target, TRAIL_SPRING);
  const press = useSpring(1, PRESS_SPRING);
  const dragging = useRef(false);
  const drag = useRef(null);
  const suppressClick = useRef(false);

  // speed -> stretch along the travel, squash across it
  const vx = useVelocity(x);
  const stretch = useTransform(vx, [-900, 0, 900], [1.42, 1, 1.42], { clamp: true });
  const squash = useTransform(vx, [-900, 0, 900], [0.8, 1, 0.8], { clamp: true });
  const scaleX = useTransform([stretch, press], ([s, p]) => s * p);
  const scaleY = useTransform([squash, press], ([s, p]) => s * (2 - p));
  // the trailing droplet only shows once it separates from the main one
  const gap = useTransform([x, trail], ([a, b]) => Math.abs(a - b));
  const trailScale = useTransform(gap, [0, 2, 26], [0.35, 0.55, 0.82], { clamp: true });

  useEffect(() => {
    if (dragging.current) return;
    if (reduce) {
      x.jump(target);
      trail.jump(target);
    } else {
      x.set(target);
      trail.set(target);
    }
  }, [target, reduce, x, trail]);

  const applyTheme = (dark) => {
    const root = document.documentElement;
    root.classList.add('theming');
    setTheme(dark ? 'dark' : 'light');
    window.setTimeout(() => root.classList.remove('theming'), 360);
  };

  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    applyTheme(!isDark);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    press.set(0.9);
    drag.current = { startX: e.clientX, from: x.get() };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    if (!dragging.current && Math.abs(dx) < 3) return;
    dragging.current = true;
    const v = Math.min(TRAVEL, Math.max(0, drag.current.from + dx));
    x.set(v); // springs toward the finger: a liquid lag, never a jump
    trail.set(v);
  };
  const endPress = () => {
    press.set(1);
    if (dragging.current) {
      const goDark = x.get() + vx.get() * 0.08 > TRAVEL / 2;
      suppressClick.current = true;
      dragging.current = false;
      if (goDark !== isDark) applyTheme(goDark);
      else {
        x.set(target);
        trail.set(target);
      }
    }
    drag.current = null;
  };

  const nudge = (dir) => {
    if (dragging.current || reduce) return;
    x.set(target + dir);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      className={`mercury ${isDark ? 'is-dark' : ''} ${mounted ? '' : 'is-pending'} ${className}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onPointerEnter={(e) => e.pointerType === 'mouse' && nudge(isDark ? -3 : 3)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && nudge(0)}
    >
      <span className="mercury-track" aria-hidden="true">
        <svg className="mercury-icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg className="mercury-icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>

      <span className="mercury-goo" aria-hidden="true">
        <motion.span className="mercury-drop trail" style={{ x: trail, scale: trailScale }} />
        <motion.span className="mercury-drop main" style={{ x, scaleX, scaleY }} />
      </span>

      <motion.span className="mercury-shine" aria-hidden="true" style={{ x, scaleX, scaleY }} />
    </button>
  );
}
