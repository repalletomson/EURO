/**
 * Master animation configuration for the EURO FINISHES experience.
 *
 * Streamlined 10-Second Flow:
 *   0.0 – 1.5s: Earth entrance & Europe orientation
 *   1.5 – 3.0s: Europe → Hyderabad route & arrival pulse
 *   3.0 – 4.5s: Complete highrise towers fall cascading from the sky onto podium
 *   4.5 – 6.8s: Immediate zoom into the central Marmorino luxury highrise (zero delay!)
 *   6.8 – 8.5s: Live Earth becomes the O in EURO wordmark on dark luxury backdrop
 *   8.5 – 10.0s: Final elegant brand typography lockup
 */

export const DURATIONS = {
  // Act I — Earth entrance & Europe framing (0.0 – 1.5s)
  earthEntrance: 1.5,

  // Act II — Route to Hyderabad & arrival (1.5 – 3.0s)
  europeMarker: 0.35,
  routeDraw: 1.15,
  destinationReveal: 0.35,

  // Act III — Earth-to-skyfall transition (3.0 – 4.5s)
  earthToSkyfall: 1.5,

  // Act IV — Immediate Zoom into building (4.5 – 6.8s) — Zero dead time!
  buildingZoom: 2.3,

  // Act V — Brand reveal (6.8 – 10.0s)
  globeReturn: 0.5,
  globeToO: 0.6,
  letterReveal: 0.35,
  finishesReveal: 0.3,
  taglineReveal: 0.3,
} as const;

export const EASE = {
  smooth: 'power2.inOut',
  out: 'power2.out',
  in: 'power2.in',
  elegant: 'power3.inOut',
  camera: 'power2.inOut',
  zoom: 'power2.inOut',
  markerPop: 'back.out(1.8)',
} as const;

export interface CameraPose {
  lat: number;
  lng: number;
  altitude: number;
}

/** Globe.gl camera poses — `altitude` is in globe-radius units. */
export const CAMERAS = {
  /** Cinematic opening — Europe entering the frame under natural daylight. */
  opening: { lat: 38, lng: 0, altitude: 2.3 },
  /** Push-in and orientation towards Europe. */
  europe: { lat: 46, lng: 8, altitude: 1.85 },
  /** Hyderabad arrival framing at the end of the journey. */
  india: { lat: 20, lng: 76, altitude: 1.7 },
  /** Zoom towards Hyderabad surface during sky-fall transition. */
  transitionApproach: { lat: 24, lng: 75.5, altitude: 1.05 },
  /** Wide framing: complete towers from base to crown visible with breathing room. */
  archStart: { lat: 24, lng: 75.5, altitude: 1.05 },
  archFullCluster: { lat: 24, lng: 75.5, altitude: 1.05 },
  /** Immediate zoom into the central Marmorino luxury highrise facade. */
  archBuildingZoom: { lat: 18.5, lng: 78.0, altitude: 0.22 },
  /** Latitude/longitude the globe is viewed from for the final O brand lockup. */
  brand: { lat: 20, lng: 78, altitude: 1.85 },
} satisfies Record<string, CameraPose>;

export const O_GLOBE_FIT = 0.96;
export const GLOBE_RETURN_ALTITUDE = 4.2;
