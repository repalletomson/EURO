'use client';

import { useSyncExternalStore } from 'react';

/**
 * Returns true if the user has requested reduced motion
 * via prefers-reduced-motion: reduce.
 *
 * Uses useSyncExternalStore for SSR-safe, lint-compliant
 * subscription to the media query.
 */
function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
