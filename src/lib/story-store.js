/**
 * Where the visitor is in the scroll story. Written by SmoothScroll / the MVP
 * ScrollTrigger, read by the dock (scrolling) and section-aware UI.
 * section: 'hero' | 'about' | 'work' | 'experience' | 'close'
 * progress: 0..1 within that section · scrolling: true while the page moves
 */
let story = { section: 'hero', progress: 0, scrolling: false };
const listeners = new Set();

export const getStory = () => story;

export function setStory(partial) {
  story = { ...story, ...partial };
  listeners.forEach((fn) => fn(story));
}

export function subscribeStory(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
