import { useSyncExternalStore } from 'react';

/** Which glass sheet is open: a dock id ('stack' | 'certs' | 'contact' | 'resume' | 'questions') or null. */
let sheet = null;
const listeners = new Set();

export const getSheet = () => sheet;

function set(next) {
  sheet = next;
  listeners.forEach((fn) => fn(sheet));
}

export const openSheet = (id) => set(id);
export const closeSheet = () => set(null);

export function subscribeSheet(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** React hook: [openId, openSheet, closeSheet] */
export function useSheet() {
  const id = useSyncExternalStore(subscribeSheet, getSheet, () => null);
  return [id, openSheet, closeSheet];
}
