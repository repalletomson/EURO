'use client';

/**
 * Client-only dynamic import of BrandPreloader.
 * This file is imported from the Next.js Server Component (page.tsx) using
 * next/dynamic so the Three.js scene is never evaluated on the server.
 */
import dynamic from 'next/dynamic';

const BrandPreloader = dynamic(() => import('./BrandPreloader'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100svh',
        background: '#080D18',
      }}
      aria-hidden="true"
    />
  ),
});

export default BrandPreloader;
