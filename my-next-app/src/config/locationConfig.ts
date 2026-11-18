/**
 * Geographic configuration for the Europe → Hyderabad journey.
 *
 * Europe is the Italian / European craft origin for EURO FINISHES.
 * Hyderabad is the Indian destination (Latitude: 17.3850, Longitude: 78.4867).
 */

export interface GeoLocation {
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
}

export const LOCATIONS = {
  europe: {
    lat: 44.5,
    lng: 10.5,
    label: 'EUROPE',
    sublabel: 'CRAFTED IN ITALY',
  },
  hyderabad: {
    lat: 17.385,
    lng: 78.4867,
    label: 'HYDERABAD',
    sublabel: 'INDIA',
  },
} as const satisfies Record<string, GeoLocation>;

export const ROUTE_MIDPOINT = {
  lat: (LOCATIONS.europe.lat + LOCATIONS.hyderabad.lat) / 2,
  lng: (LOCATIONS.europe.lng + LOCATIONS.hyderabad.lng) / 2,
} as const;
