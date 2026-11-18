/**
 * Brand identity tokens for EUR FINISHES.
 * Single source of truth for colours, typography and brand copy.
 * 
 * Direction: Modern Architectural Minimalism + Muted Olive Accent
 */

export const BRAND = {
  // Master Brand Colours
  chalk: '#F4F3EE',              // Architectural Chalk: Main light backgrounds
  porcelain: '#FBFAF6',          // Porcelain White: Cards and navigation
  stone: '#E5E4DC',              // Mineral Stone: Secondary surfaces
  ink: '#222722',                // Architectural Ink: Primary text and dark sections
  deepOlive: '#29332B',          // Deep Olive: Dark brand surfaces
  signatureOlive: '#65704F',     // Signature Olive: Primary accent and buttons
  softSage: '#AAB39A',           // Soft Sage: Decorative highlights

  // Supporting colours
  secondaryText: '#62685F',
  darkSecondaryText: '#C7CDC0',
  lightBorder: '#D8D9D0',
  darkBorder: '#424B41',
  oliveHover: '#505C3F',
  subtleOlive: '#EDF0E8',
  white: '#FFFFFF',

  // Compatibility / Scene Aliases
  midnight: '#222722',
  ivory: '#F4F3EE',
  graphite: '#222722',
  champagne: '#AAB39A',
  travertine: '#E5E4DC',
  oliveGrey: '#62685F',
  terracotta: '#65704F',

  space: '#222722',
  text: '#222722',
  accent: '#65704F',

  // Typography
  serifFont: 'var(--font-playfair), Georgia, serif',
  sansFont: 'var(--font-geist-sans), system-ui, sans-serif',

  // Name & tagline
  name: 'EUR FINISHES',
  wordmark: 'EUR',
  subBrand: 'FINISHES',
  tagline: 'ARCHITECTURAL SURFACE ATELIER',
} as const;

/** Studio background used behind the 3D scene. */
export const STUDIO_BACKGROUND = {
  center: '#29332B',
  edge: '#222722',
} as const;

export type BrandColor = keyof typeof BRAND;
