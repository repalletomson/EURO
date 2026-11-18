/**
 * Master GSAP Timeline for EURO FINISHES.
 *
 * Streamlined 10-Second Flow:
 *   Act I   (0.0 – 1.5s): Earth entrance & Europe orientation
 *   Act II  (1.5 – 3.0s): Europe → Hyderabad route & arrival pulse
 *   Act III (3.0 – 4.5s): Highrise towers fall cascading from the sky onto podium (full towers visible)
 *   Act IV  (4.5 – 6.8s): Immediate dramatic zoom into the central highrise building (ZERO delay!)
 *   Act V   (6.8 – 10.0s): Seamless transition to EURO text with live Earth as the O on dark luxury background
 */

import gsap from 'gsap';
import {
  CAMERAS,
  O_GLOBE_FIT,
  type CameraPose,
} from '@/config/animationConfig';
import { GLOBE_VISUALS } from '@/config/globeConfig';
import type { GlobeHandle } from '@/components/Earth/createGlobe';
import type { CameraHandle } from '@/components/Earth/cameraController';
import type { RouteHandle } from '@/components/Earth/routeAnimation';
import type { ArchitectureSceneHandle } from '@/components/Architecture/architectureScene';
import type { StarfieldHandle } from '@/components/Effects/Starfield';
import type { CloudLayerHandle } from '@/components/Earth/earthTextures';
import type { EuroWordmarkHandle } from '@/components/branding/EuroWordmark';

export interface MasterRefs {
  globe: GlobeHandle;
  camera: CameraHandle;
  route: RouteHandle;
  architecture: ArchitectureSceneHandle;
  stars: StarfieldHandle;
  clouds: CloudLayerHandle | null;
  wordmark: EuroWordmarkHandle;
  layers: {
    canvas: HTMLElement;
    ivory: HTMLElement;
    vignette: HTMLElement;
  };
  onComplete?: () => void;
}

export interface MasterController {
  timeline: gsap.core.Timeline;
  skip: () => void;
  applyFinalState: () => void;
  destroy: () => void;
  progress: () => number;
}

const DEG = Math.PI / 180;

export function cameraAzimuth(pose: CameraPose): number {
  const phi = (90 - pose.lat) * DEG;
  const theta = (90 - pose.lng) * DEG;
  const x = Math.sin(phi) * Math.cos(theta);
  const z = Math.sin(phi) * Math.sin(theta);
  return Math.atan2(x, z);
}

export function buildMasterTimeline(
  refs: MasterRefs,
  options: { reducedMotion?: boolean } = {},
): MasterController {
  const { globe, camera, route, architecture, stars, clouds, wordmark, layers } = refs;

  const measureLockup = () => {
    const slot = wordmark.measureOSlot();
    const radius = Math.max(18, (slot?.width ?? 96) / 2) * O_GLOBE_FIT;
    return {
      radius,
      altitude: camera.altitudeForScreenRadius(radius),
      offsetX: slot ? slot.left + slot.width / 2 - window.innerWidth / 2 : 0,
      offsetY: slot ? slot.top + slot.height / 2 - window.innerHeight / 2 : 0,
    };
  };

  let lockup = measureLockup();
  const slotRadius = lockup.radius;
  const brandAltitude = lockup.altitude;
  const offsetX = lockup.offsetX;
  const offsetY = lockup.offsetY;

  // Animation proxies
  const pov: CameraPose = { ...CAMERAS.opening };
  const earth = { opacity: 1 };
  const starfield = { opacity: 1 };
  const cloudState = { opacity: GLOBE_VISUALS.cloudOpacity };
  const tint = { darkBackdrop: 0, vignette: 1 };
  const origin = { reveal: 0 };
  const destination = { reveal: 0 };
  const path = { progress: 0, fade: 1 };
  const archRise = { value: 0 };
  const daylight = { value: 0 };
  const archAlpha = { value: 0 };
  const oState = { x: 0, y: 0 };

  let atmosphereOn = true;

  const applyPov = () => camera.setPose(pov);
  const applyEarth = () => {
    globe.setEarthOpacity(earth.opacity);
    const shouldShow = earth.opacity > 0.15;
    if (shouldShow !== atmosphereOn) {
      atmosphereOn = shouldShow;
      globe.setAtmosphereVisible(shouldShow);
    }
  };
  const applyCanvas = () => {
    layers.canvas.style.transform =
      oState.x === 0 && oState.y === 0 ? '' : `translate3d(${oState.x}px, ${oState.y}px, 0)`;
  };

  // Initial scene state — Earth visible immediately at time zero
  camera.setPose(pov);
  globe.showEarth(true);
  globe.setAtmosphereVisible(true);
  globe.setEarthOpacity(1);
  stars.setOpacity(1);
  clouds?.setOpacity(GLOBE_VISUALS.cloudOpacity);
  route.reset();
  architecture.setVisible(false);
  architecture.setRise(0);
  architecture.setOpacity(0);
  architecture.setLightIntensity(0);
  architecture.setEarthLightIntensity(1);
  layers.ivory.style.opacity = '0';
  layers.vignette.style.opacity = '1';
  layers.canvas.style.clipPath = '';
  layers.canvas.style.transform = '';
  gsap.set(wordmark.oSlot, { opacity: 0 });
  gsap.set(wordmark.letters, { opacity: 0, y: 18 });
  gsap.set(wordmark.finishes, { opacity: 0, y: 12 });
  gsap.set(wordmark.divider, { opacity: 0, scaleX: 0 });
  gsap.set(wordmark.tagline, { opacity: 0, y: 8 });

  const applyFinalState = () => {
    lockup = measureLockup();
    earth.opacity = 1;
    globe.showEarth(true);
    globe.setEarthOpacity(1);
    globe.setAtmosphereVisible(true);
    atmosphereOn = true;
    stars.setOpacity(0);
    clouds?.setOpacity(0);
    route.setProgress(1);
    route.setDestinationReveal(1);
    route.setOriginReveal(1);
    route.setFade(0);
    architecture.setVisible(false);
    architecture.setLightIntensity(0);
    architecture.setEarthLightIntensity(1);
    layers.ivory.style.backgroundImage = '';
    layers.ivory.style.opacity = '1';
    layers.vignette.style.opacity = '0';
    camera.setPose({
      lat: CAMERAS.brand.lat,
      lng: CAMERAS.brand.lng,
      altitude: lockup.altitude,
    });
    oState.x = lockup.offsetX;
    oState.y = lockup.offsetY;
    layers.canvas.style.clipPath = `circle(${lockup.radius}px at 50% 50%)`;
    applyCanvas();
    gsap.set(wordmark.oSlot, { opacity: 1 });
    gsap.set(wordmark.letters, { opacity: 1, y: 0 });
    gsap.set(wordmark.finishes, { opacity: 1, y: 0 });
    gsap.set(wordmark.divider, { opacity: 0.85, scaleX: 1 });
    gsap.set(wordmark.tagline, { opacity: 1, y: 0 });
  };

  if (options.reducedMotion) {
    applyFinalState();
    const timeline = gsap.timeline({ paused: true });
    return {
      timeline,
      skip: applyFinalState,
      applyFinalState,
      destroy: () => timeline.kill(),
      progress: () => 1,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — EXACT 10.0 SECONDS TOTAL
  // ═══════════════════════════════════════════════════════════════════════════
  const tl = gsap.timeline({
    paused: true,
    onComplete: () => refs.onComplete?.(),
  });

  // ── ACT I: EARTH ENTRANCE & EUROPE ORIENTATION (0.0 – 1.5s) ───────────────
  tl.addLabel('earth-intro', 0)
    .to(
      pov,
      {
        lat: CAMERAS.europe.lat,
        lng: CAMERAS.europe.lng,
        altitude: CAMERAS.europe.altitude,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: applyPov,
      },
      0,
    );

  // ── ACT II: ROUTE TO HYDERABAD & ARRIVAL (1.5 – 3.0s) ─────────────────────
  tl.addLabel('europe-route', 1.5)
    .to(
      origin,
      {
        reveal: 1,
        duration: 0.35,
        ease: 'back.out(1.8)',
        onUpdate: () => route.setOriginReveal(origin.reveal),
      },
      1.5,
    )
    .to(
      path,
      {
        progress: 1,
        duration: 1.15,
        ease: 'power1.inOut',
        onUpdate: () => route.setProgress(path.progress),
      },
      1.6,
    )
    .to(
      pov,
      {
        lat: CAMERAS.india.lat,
        lng: CAMERAS.india.lng,
        altitude: CAMERAS.india.altitude,
        duration: 1.25,
        ease: 'power2.inOut',
        onUpdate: applyPov,
      },
      1.6,
    )
    .to(
      destination,
      {
        reveal: 1,
        duration: 0.35,
        ease: 'back.out(1.8)',
        onUpdate: () => route.setDestinationReveal(destination.reveal),
      },
      2.65,
    );

  // ── ACT III: HIGHRISE SKY-FALL (3.0 – 4.5s) ──────────────────────────────
  // Wide camera view: full building cluster from podium to crowns completely visible
  tl.addLabel('sky-fall', 3.0)
    .to(
      pov,
      {
        lat: CAMERAS.archFullCluster.lat,
        lng: CAMERAS.archFullCluster.lng,
        altitude: CAMERAS.archFullCluster.altitude,
        duration: 1.4,
        ease: 'power2.inOut',
        onUpdate: applyPov,
      },
      3.0,
    )
    .call(
      () => {
        // Completely hide the Earth, atmosphere, clouds and route so the globe is NEVER visible behind the buildings
        globe.showEarth(false);
        globe.setAtmosphereVisible(false);
        atmosphereOn = false;
        earth.opacity = 0;
        globe.setEarthOpacity(0);
        clouds?.setOpacity(0);
        route.setFade(0);
        architecture.setVisible(true);
        architecture.setRise(0);
        architecture.setOpacity(0);
        architecture.setShadows(true);
      },
      [],
      3.05,
    )
    .to(
      archAlpha,
      {
        value: 1,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => architecture.setOpacity(archAlpha.value),
      },
      3.1,
    )
    .to(
      archRise,
      {
        value: 1,
        duration: 1.7,
        ease: 'none',
        onUpdate: () => architecture.setRise(archRise.value),
      },
      3.1,
    )
    .to(
      daylight,
      {
        value: 1,
        duration: 0.7,
        ease: 'power2.out',
        onUpdate: () => architecture.setLightIntensity(daylight.value),
      },
      3.15,
    )
    .to(
      starfield,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onUpdate: () => stars.setOpacity(starfield.opacity),
      },
      3.05,
    )
    // Dynamic ground impact camera rumble as the 3rd wave slams into the ground
    .to(
      pov,
      {
        altitude: CAMERAS.archFullCluster.altitude - 0.035,
        duration: 0.1,
        ease: 'power2.out',
        onUpdate: applyPov,
      },
      4.65,
    )
    .to(
      pov,
      {
        altitude: CAMERAS.archFullCluster.altitude,
        duration: 0.18,
        ease: 'power2.out',
        onUpdate: applyPov,
      },
      4.75,
    );

  // ── ACT IV: SHOWCASE ZOOM IN & SMOOTH ZOOM OUT (4.8 – 6.4s) ───────────────
  // Smoothly swoops into the building facade, then zooms out as buildings fade completely!
  tl.addLabel('building-zoom', 4.8)
    .to(
      pov,
      {
        lat: CAMERAS.archBuildingZoom.lat,
        lng: CAMERAS.archBuildingZoom.lng,
        altitude: CAMERAS.archBuildingZoom.altitude,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: applyPov,
      },
      4.8,
    )
    // Zoom out back towards brand position while fading buildings out completely
    .to(
      pov,
      {
        lat: CAMERAS.brand.lat,
        lng: CAMERAS.brand.lng,
        altitude: brandAltitude,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: applyPov,
      },
      5.6,
    )
    .to(
      archAlpha,
      {
        value: 0,
        duration: 0.7,
        ease: 'power2.in',
        onUpdate: () => architecture.setOpacity(archAlpha.value),
      },
      5.7,
    )
    .to(
      daylight,
      {
        value: 0,
        duration: 0.6,
        ease: 'power2.in',
        onUpdate: () => architecture.setLightIntensity(daylight.value),
      },
      5.8,
    );

  // ── ACT V: EURO TEXT-BY-TEXT & LIVE EARTH-AS-O REVEAL (6.4 – 10.0s) ────────
  // On clean, pristine dark luxury backdrop (#080D18) — high contrast, 100% visible!
  tl.addLabel('brand-reveal', 6.4)
    .call(
      () => {
        // Ensure buildings are completely removed
        architecture.setVisible(false);
        layers.ivory.style.backgroundImage = '';
        layers.ivory.style.opacity = '1';

        // Prepare live rotating Earth inside the borderless O slot
        globe.showEarth(true);
        globe.setAtmosphereVisible(true);
        atmosphereOn = true;
        earth.opacity = 1;
        globe.setEarthOpacity(1);

        camera.setPose({
          lat: CAMERAS.brand.lat,
          lng: CAMERAS.brand.lng,
          altitude: brandAltitude,
        });

        layers.canvas.style.clipPath = `circle(${slotRadius}px at 50% 50%)`;
        oState.x = offsetX;
        oState.y = offsetY;
        applyCanvas();
      },
      [],
      6.4,
    )
    // TEXT-BY-TEXT / LETTER-BY-LETTER ANIMATION:
    // Letter 'E'
    .to(
      wordmark.letters[0],
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      6.5,
    )
    // Letter 'U'
    .to(
      wordmark.letters[1],
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      6.72,
    )
    // Letter 'R'
    .to(
      wordmark.letters[2],
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      6.94,
    )
    // Live rotating Earth 'O' slot (borderless)
    .to(
      wordmark.oSlot,
      {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
      },
      7.16,
    )
    // 'FINISHES'
    .to(
      wordmark.finishes,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      7.45,
    )
    // Champagne divider line
    .to(
      wordmark.divider,
      {
        opacity: 0.85,
        scaleX: 1,
        duration: 0.45,
        ease: 'power2.out',
      },
      7.75,
    )
    // Tagline: 'ITALIAN TEXTURE WALL PAINT'
    .to(
      wordmark.tagline,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      8.0,
    )
    .to({}, { duration: 1.5 }, 8.5)
    .addLabel('complete', 10.0);

  return {
    timeline: tl,
    skip: () => {
      tl.pause();
      applyFinalState();
      refs.onComplete?.();
    },
    applyFinalState,
    destroy: () => {
      tl.kill();
      gsap.killTweensOf([
        pov,
        earth,
        starfield,
        cloudState,
        tint,
        origin,
        destination,
        path,
        archRise,
        daylight,
        archAlpha,
        oState,
      ]);
    },
    progress: () => tl.progress(),
  };
}
