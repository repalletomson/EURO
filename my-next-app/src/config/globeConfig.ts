/**
 * Globe.gl appearance, texture sources and quality presets.
 */

export const EARTH_TEXTURES = {
  day: '/textures/earth-day.jpg',
  normal: '/textures/earth-normal.jpg',
  specular: '/textures/earth-specular.jpg',
  clouds: '/textures/earth-clouds.png',
} as const;

export const GLOBE_VISUALS = {
  atmosphereColor: '#4E7FB4',
  atmosphereAltitude: 0.15,
  /** Bump depth for the normal map — subtle, never cartoonish. */
  bumpScale: 4,
  specularColor: '#22344C',
  shininess: 14,
  /** Cloud shell radius as a multiple of the globe radius. */
  cloudRadiusFactor: 1.004,
  cloudOpacity: 0.38,
  starColor: '#F5F1E9',
  /** Arc tower height in globe-radius units. */
  routeAltitude: 0.24,
  routeStroke: 0.45,
} as const;

export interface QualityPreset {
  /** Hard cap on device pixel ratio. */
  dprCap: number;
  /** Number of background stars. */
  starCount: number;
  /** Render the cloud shell. */
  clouds: boolean;
  /** Enable shadow casting for the architectural blocks. */
  shadows: boolean;
  /** Shadow map resolution. */
  shadowMapSize: number;
  /** Pixel size of the procedurally generated finish maps. */
  finishMapSize: number;
}

export const QUALITY_DESKTOP: QualityPreset = {
  dprCap: 2,
  starCount: 1800,
  clouds: true,
  shadows: true,
  shadowMapSize: 2048,
  finishMapSize: 256,
};

export const QUALITY_MOBILE: QualityPreset = {
  dprCap: 1.5,
  starCount: 700,
  clouds: true,
  shadows: true,
  shadowMapSize: 1024,
  finishMapSize: 128,
};

export function getQualityPreset(): QualityPreset {
  if (typeof window === 'undefined') return QUALITY_DESKTOP;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 760;
  return coarse || small ? QUALITY_MOBILE : QUALITY_DESKTOP;
}
