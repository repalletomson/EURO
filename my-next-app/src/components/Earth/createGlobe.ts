/**
 * createGlobe — the single WebGL context for the whole experience.
 *
 * Globe.gl owns the renderer, scene, camera and orbit controls. Every other
 * object in the experience (route, stars, architectural blocks, studio lights)
 * is added to this same scene — there is never a second canvas.
 *
 * Browser-only: import dynamically from a client component.
 */

import * as THREE from 'three';
import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import { CAMERAS } from '@/config/animationConfig';
import { GLOBE_VISUALS, type QualityPreset } from '@/config/globeConfig';

export interface GlobeHandle {
  globe: GlobeInstance;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement;
  /** 0 = invisible, 1 = fully lit Earth surface. */
  setEarthOpacity: (value: number) => void;
  showEarth: (visible: boolean) => void;
  setAtmosphereVisible: (visible: boolean) => void;
  destroy: () => void;
}

export function createGlobe(container: HTMLElement, preset: QualityPreset): GlobeHandle {
  const globe = new Globe(container, {
    waitForGlobeReady: false,
    rendererConfig: {
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    },
  });

  const renderer = globe.renderer();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.dprCap));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = preset.shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const camera = globe.camera() as THREE.PerspectiveCamera;
  camera.fov = 48;
  camera.updateProjectionMatrix();

  globe
    .width(container.clientWidth || window.innerWidth)
    .height(container.clientHeight || window.innerHeight)
    .backgroundColor('rgba(0,0,0,0)')
    .showGraticules(false)
    .showAtmosphere(true)
    .atmosphereColor(GLOBE_VISUALS.atmosphereColor)
    .atmosphereAltitude(GLOBE_VISUALS.atmosphereAltitude)
    .enablePointerInteraction(false);

  // The camera is entirely timeline-driven; never let orbit controls fight it.
  const controls = globe.controls();
  controls.enabled = false;

  globe.pointOfView(CAMERAS.opening, 0);

  const material = globe.globeMaterial() as THREE.MeshPhongMaterial;
  material.transparent = true;
  material.opacity = 0;
  material.depthWrite = false;

  const onResize = () => {
    globe.width(container.clientWidth || window.innerWidth);
    globe.height(container.clientHeight || window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  const setEarthOpacity = (value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    const mat = globe.globeMaterial() as THREE.MeshPhongMaterial;
    mat.opacity = clamped;
    mat.transparent = clamped < 1;
    mat.depthWrite = clamped >= 1;
    mat.needsUpdate = true;
  };

  const showEarth = (visible: boolean) => {
    globe.showGlobe(visible);
    if (visible) {
      // Re-apply opacity after toggling so the material recompiles correctly.
      setEarthOpacity(globe.globeMaterial().opacity);
    }
  };

  const destroy = () => {
    window.removeEventListener('resize', onResize);
    try {
      globe.enablePointerInteraction(false);
      globe.pauseAnimation();
      globe._destructor();
    } catch {
      /* Globe.gl teardown is best-effort */
    }
    container.innerHTML = '';
  };

  return {
    globe,
    scene: globe.scene(),
    camera,
    renderer,
    container,
    setEarthOpacity,
    showEarth,
    setAtmosphereVisible: (visible) => globe.showAtmosphere(visible),
    destroy,
  };
}
