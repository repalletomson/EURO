/**
 * Architectural configuration for the EURO FINISHES Highrise Towers & Podium.
 *
 * Inspired by SAS Crown & Golden Mile (Hyderabad luxury high-rise development):
 *   - 8-10 Skyscraper Towers (20 to 50 floors) with textured window grids and floor slabs
 *   - Cladding finishes: Marmorino Ivory, Travertino Romano, Burnt Terracotta,
 *     Mushroom Taupe, Mineral Olive-Grey, Concrete, Champagne Bronze, Graphite
 *   - Architectural scale model grid podium platform
 *   - Sleek Dark Luxury background (#080D18) — NO cream/beige colors
 *   - ZERO trees or shrubs
 */

export type FinishName =
  | 'marmorinoIvory'
  | 'travertinoStone'
  | 'burntTerracotta'
  | 'mushroomTaupe'
  | 'mineralOliveGrey'
  | 'concreteSlab'
  | 'antiqueChampagne'
  | 'graphiteMetal'
  | 'podiumGrid';

export interface TowerSpec {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  floors: number;
  finish: FinishName;
  dropDelay: number;
  wave: number;
}

export const TOWERS_CLUSTER: TowerSpec[] = [
  // ── FALL 1 (3 Back Towers) ────────────────────────────────────────────────
  {
    id: 'tower-back-left',
    x: -8,
    z: -12,
    width: 6.4,
    depth: 6.0,
    height: 34,
    floors: 44,
    finish: 'mineralOliveGrey',
    dropDelay: 0.0,
    wave: 0,
  },
  {
    id: 'tower-back-center',
    x: 3.5,
    z: -14,
    width: 6.6,
    depth: 6.2,
    height: 36,
    floors: 46,
    finish: 'travertinoStone',
    dropDelay: 0.0,
    wave: 0,
  },
  {
    id: 'tower-back-right',
    x: 12,
    z: -11,
    width: 5.4,
    depth: 5.4,
    height: 26,
    floors: 32,
    finish: 'antiqueChampagne',
    dropDelay: 0.0,
    wave: 0,
  },

  // ── FALL 2 (2 Mid Flanking Towers) ────────────────────────────────────────
  {
    id: 'tower-mid-left',
    x: -14,
    z: -2,
    width: 6.0,
    depth: 5.8,
    height: 32,
    floors: 40,
    finish: 'mushroomTaupe',
    dropDelay: 0.33,
    wave: 1,
  },
  {
    id: 'tower-mid-right',
    x: 13.5,
    z: -1,
    width: 5.8,
    depth: 5.5,
    height: 30,
    floors: 38,
    finish: 'concreteSlab',
    dropDelay: 0.33,
    wave: 1,
  },

  // ── FALL 3 (3 Front & Landmark Crown Towers) ──────────────────────────────
  {
    id: 'tower-front-left',
    x: -8.5,
    z: 5,
    width: 6.2,
    depth: 5.6,
    height: 28,
    floors: 36,
    finish: 'travertinoStone',
    dropDelay: 0.66,
    wave: 2,
  },
  {
    id: 'tower-front-right',
    x: 7.5,
    z: 6,
    width: 5.5,
    depth: 5.2,
    height: 24,
    floors: 30,
    finish: 'burntTerracotta',
    dropDelay: 0.66,
    wave: 2,
  },
  {
    id: 'tower-crown',
    x: 0,
    z: -3,
    width: 6.8,
    depth: 6.2,
    height: 38,
    floors: 48,
    finish: 'marmorinoIvory',
    dropDelay: 0.66,
    wave: 2,
  },
];

export const ARCHITECTURE_COMPOSITION = {
  podiumSize: 52,
  clusterHeight: 38,
  widthFraction: 0.88,
  mobileWidthFraction: 0.94,
} as const;
