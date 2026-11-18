/**
 * Small geodesic helpers used by the route and the traveller marker.
 * All angles are degrees at the API boundary; radians internally.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/** Convert lat/lng to a unit vector so we can slerp across the sphere. */
export function toUnitVector({ lat, lng }: LatLng): [number, number, number] {
  const phi = lat * DEG;
  const lambda = lng * DEG;
  return [
    Math.cos(phi) * Math.cos(lambda),
    Math.cos(phi) * Math.sin(lambda),
    Math.sin(phi),
  ];
}

/**
 * Spherical linear interpolation between two coordinates.
 * Returns the shorter great-circle path, matching Globe.gl's geodesics.
 */
export function slerpLatLng(from: LatLng, to: LatLng, t: number): LatLng {
  const [x1, y1, z1] = toUnitVector(from);
  const [x2, y2, z2] = toUnitVector(to);
  const dot = Math.min(1, Math.max(-1, x1 * x2 + y1 * y2 + z1 * z2));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return { lat: from.lat, lng: from.lng };

  const sinOmega = Math.sin(omega);
  const a = Math.sin((1 - t) * omega) / sinOmega;
  const b = Math.sin(t * omega) / sinOmega;

  const x = a * x1 + b * x2;
  const y = a * y1 + b * y2;
  const z = a * z1 + b * z2;

  return {
    lat: Math.asin(Math.min(1, Math.max(-1, z))) * RAD,
    lng: Math.atan2(y, x) * RAD,
  };
}

/** Angular distance in radians between two coordinates. */
export function angularDistance(from: LatLng, to: LatLng): number {
  const [x1, y1, z1] = toUnitVector(from);
  const [x2, y2, z2] = toUnitVector(to);
  const dot = Math.min(1, Math.max(-1, x1 * x2 + y1 * y2 + z1 * z2));
  return Math.acos(dot);
}
