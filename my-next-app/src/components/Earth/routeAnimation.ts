/**
 * Europe → Hyderabad route.
 *
 * The arc itself is a Globe.gl arc layer, drawn progressively through
 * `arcDashLength` (GSAP owns the progress value). The travelling light is a
 * small mesh that follows the identical cubic-bezier the arc is built from,
 * so the glow always sits exactly on the drawn head. Labels are DOM nodes
 * projected with `globe.getScreenCoords`, keeping typography crisp.
 */

import * as THREE from 'three';
import type { GlobeInstance } from 'globe.gl';
import { BRAND } from '@/config/brandConfig';
import { GLOBE_VISUALS } from '@/config/globeConfig';
import { LOCATIONS } from '@/config/locationConfig';
import { slerpLatLng } from '@/lib/geo';

export interface RouteHandle {
  /** 0 = nothing drawn, 1 = full arc. */
  setProgress: (value: number) => void;
  setOriginReveal: (value: number) => void;
  setDestinationReveal: (value: number) => void;
  /** Fade the whole route (arc alpha, marker size, labels). */
  setFade: (value: number) => void;
  /** Position the traveller and labels — call once per frame while visible. */
  update: () => void;
  reset: () => void;
  destroy: () => void;
}

interface MarkerDatum {
  lat: number;
  lng: number;
  color: string;
  radius: number;
}

const MARKER_RADIUS_DEG = 0.62;

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.25, 'rgba(245,241,233,0.85)');
    gradient.addColorStop(0.55, 'rgba(183,165,139,0.28)');
    gradient.addColorStop(1, 'rgba(183,165,139,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLabel(
  overlay: HTMLElement,
  title: string,
  subtitle?: string,
): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'route-label';
  const dot = document.createElement('span');
  dot.className = 'route-label__dot';
  const body = document.createElement('span');
  body.className = 'route-label__body';
  const name = document.createElement('span');
  name.className = 'route-label__name';
  name.textContent = title;
  body.appendChild(name);
  if (subtitle) {
    const sub = document.createElement('span');
    sub.className = 'route-label__sub';
    sub.textContent = subtitle;
    body.appendChild(sub);
  }
  el.append(dot, body);
  overlay.appendChild(el);
  return el;
}

/**
 * Reproduces the exact cubic bezier Three-globe uses for an arc with
 * `arcAltitude` so the traveller can ride the drawn line.
 */
function createArcCurve(globe: GlobeInstance, altitude: number): THREE.CubicBezierCurve3 {
  const start = globe.getCoords(LOCATIONS.europe.lat, LOCATIONS.europe.lng, 0);
  const end = globe.getCoords(LOCATIONS.hyderabad.lat, LOCATIONS.hyderabad.lng, 0);
  const controlAltitude = altitude * 1.5;
  const mid1 = slerpLatLng(LOCATIONS.europe, LOCATIONS.hyderabad, 0.25);
  const mid2 = slerpLatLng(LOCATIONS.europe, LOCATIONS.hyderabad, 0.75);
  const c1 = globe.getCoords(mid1.lat, mid1.lng, controlAltitude);
  const c2 = globe.getCoords(mid2.lat, mid2.lng, controlAltitude);

  return new THREE.CubicBezierCurve3(
    new THREE.Vector3(start.x, start.y, start.z),
    new THREE.Vector3(c1.x, c1.y, c1.z),
    new THREE.Vector3(c2.x, c2.y, c2.z),
    new THREE.Vector3(end.x, end.y, end.z),
  );
}

export function createRouteLayer(globe: GlobeInstance, overlay: HTMLElement): RouteHandle {
  const scene = globe.scene();
  const arcAltitude = GLOBE_VISUALS.routeAltitude;

  // ── Arc ────────────────────────────────────────────────────────────────────
  const arcDatum = {
    startLat: LOCATIONS.europe.lat,
    startLng: LOCATIONS.europe.lng,
    endLat: LOCATIONS.hyderabad.lat,
    endLng: LOCATIONS.hyderabad.lng,
    color: `rgba(183,165,139,0.9)`,
  };

  let progress = 0;
  let fade = 1;

  globe
    .arcsData([arcDatum])
    .arcStartLat('startLat')
    .arcStartLng('startLng')
    .arcEndLat('endLat')
    .arcEndLng('endLng')
    .arcColor('color')
    .arcAltitude(arcAltitude)
    .arcStroke(GLOBE_VISUALS.routeStroke)
    .arcCurveResolution(96)
    .arcCircularResolution(8)
    .arcDashLength(0)
    .arcDashGap(1)
    .arcDashInitialGap(0)
    .arcDashAnimateTime(0)
    .arcsTransitionDuration(0);

  // ── Markers ────────────────────────────────────────────────────────────────
  const markers: MarkerDatum[] = [
    {
      lat: LOCATIONS.europe.lat,
      lng: LOCATIONS.europe.lng,
      color: BRAND.champagne,
      radius: 0,
    },
    {
      lat: LOCATIONS.hyderabad.lat,
      lng: LOCATIONS.hyderabad.lng,
      color: BRAND.travertine,
      radius: 0,
    },
  ];

  globe
    .pointsData(markers)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor('color')
    .pointAltitude(0.012)
    .pointRadius('radius')
    .pointResolution(20)
    .pointsMerge(false)
    .pointsTransitionDuration(0);

  // ── Destination pulse ──────────────────────────────────────────────────────
  globe
    .ringsData([])
    .ringLat('lat')
    .ringLng('lng')
    .ringAltitude(0.01)
    .ringColor(() => (t: number) => `rgba(183,165,139,${(1 - t) * 0.55})`)
    .ringMaxRadius(2.6)
    .ringPropagationSpeed(1.4)
    .ringRepeatPeriod(1100)
    .ringResolution(64);

  // ── Traveller ──────────────────────────────────────────────────────────────
  const curve = createArcCurve(globe, arcAltitude);
  const traveller = new THREE.Group();
  traveller.visible = false;

  const glowTexture = makeGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: BRAND.travertine,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.setScalar(11);

  const coreGeometry = new THREE.SphereGeometry(0.9, 16, 16);
  const coreMaterial = new THREE.MeshBasicMaterial({ color: BRAND.ivory });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  traveller.add(glow, core);
  scene.add(traveller);

  // ── Labels ─────────────────────────────────────────────────────────────────
  const originLabel = createLabel(overlay, LOCATIONS.europe.label);
  const destinationLabel = createLabel(overlay, LOCATIONS.hyderabad.label, LOCATIONS.hyderabad.sublabel);

  let originReveal = 0;
  let destinationReveal = 0;

  const pushMarkers = () => {
    globe.pointsData([...markers]);
  };

  const placeLabel = (el: HTMLDivElement, lat: number, lng: number, reveal: number) => {
    const point = globe.getCoords(lat, lng, 0.01);
    const camera = globe.camera().position;
    const facing =
      point.x * (camera.x - point.x) +
        point.y * (camera.y - point.y) +
        point.z * (camera.z - point.z) >
      0;

    const opacity = facing ? reveal * fade : 0;
    if (opacity <= 0.01) {
      el.style.opacity = '0';
      return;
    }
    const screen = globe.getScreenCoords(lat, lng, 0.01);
    el.style.opacity = String(opacity);
    el.style.transform = `translate3d(${screen.x}px, ${screen.y - 18}px, 0) translate(-50%, -100%)`;
  };

  return {
    setProgress: (value) => {
      progress = Math.min(1, Math.max(0, value));
      globe.arcDashLength(progress).arcDashGap(1);
    },

    setOriginReveal: (value) => {
      originReveal = Math.min(1, Math.max(0, value));
      markers[0].radius = MARKER_RADIUS_DEG * originReveal;
      pushMarkers();
    },

    setDestinationReveal: (value) => {
      destinationReveal = Math.min(1, Math.max(0, value));
      markers[1].radius = MARKER_RADIUS_DEG * destinationReveal;
      pushMarkers();

      const pulses = destinationReveal > 0.5 ? [LOCATIONS.hyderabad] : [];
      if (globe.ringsData().length !== pulses.length) globe.ringsData(pulses);
    },

    setFade: (value) => {
      fade = Math.min(1, Math.max(0, value));
      arcDatum.color = `rgba(183,165,139,${(0.9 * fade).toFixed(3)})`;
      globe.arcColor('color');
      glowMaterial.opacity = fade;
      coreMaterial.opacity = fade;
      coreMaterial.transparent = fade < 1;
      if (fade <= 0.001) {
        markers[0].radius = 0;
        markers[1].radius = 0;
        pushMarkers();
        globe.ringsData([]);
        traveller.visible = false;
      }
    },

    update: () => {
      if (progress > 0 && fade > 0.01) {
        traveller.visible = true;
        traveller.position.copy(curve.getPoint(progress));
      } else {
        traveller.visible = false;
      }
      placeLabel(originLabel, LOCATIONS.europe.lat, LOCATIONS.europe.lng, originReveal);
      placeLabel(
        destinationLabel,
        LOCATIONS.hyderabad.lat,
        LOCATIONS.hyderabad.lng,
        destinationReveal,
      );
    },

    reset: () => {
      progress = 0;
      fade = 1;
      originReveal = 0;
      destinationReveal = 0;
      markers.forEach((marker) => {
        marker.radius = 0;
      });
      arcDatum.color = 'rgba(183,165,139,0.9)';
      globe
        .arcColor('color')
        .arcDashLength(0)
        .arcDashGap(1)
        .pointsData([...markers])
        .ringsData([]);
      traveller.visible = false;
      originLabel.style.opacity = '0';
      destinationLabel.style.opacity = '0';
    },

    destroy: () => {
      globe.arcsData([]).pointsData([]).ringsData([]);
      scene.remove(traveller);
      coreGeometry.dispose();
      coreMaterial.dispose();
      glowTexture.dispose();
      glowMaterial.dispose();
      originLabel.remove();
      destinationLabel.remove();
    },
  };
}
