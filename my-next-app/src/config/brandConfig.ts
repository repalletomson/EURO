/**
 * Brand identity tokens for EURO FINISHES.
 * Single source of truth for colours, typography and brand copy.
 */

export const BRAND = {
  // Core palette
  midnight: '#080D18',
  ivory: '#F5F1E9',
  graphite: '#292A2C',
  champagne: '#B7A58B',
  travertine: '#DDD3C4',
  oliveGrey: '#77766E',
  terracotta: '#8C4939',
  white: '#FFFFFF',

  // Aliases used across the scene code
  space: '#080D18',
  text: '#292A2C',
  accent: '#B7A58B',

  // Typography
  serifFont: 'Georgia, "Times New Roman", serif',
  sansFont: 'var(--font-geist-sans), system-ui, sans-serif',

  // Name & tagline
  name: 'EURO FINISHES',
  wordmark: 'EURO',
  subBrand: 'FINISHES',
  tagline: 'ITALIAN TEXTURE WALL PAINT',
} as const;

/** Warm ivory studio backdrop used behind the tile composition. */
export const STUDIO_BACKGROUND = {
  center: '#F7F3EB',
  edge: '#E6DDCC',
} as const;

export type BrandColor = keyof typeof BRAND;
