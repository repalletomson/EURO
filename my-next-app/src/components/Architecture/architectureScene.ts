/**
 * Architecture Scene Assembly.
 *
 * Integrates the highrise skyscraper tower cluster and architectural podium
 * into Globe.gl's Three.js scene with a sleek Dark Luxury background (#080D18).
 * Ensures complete tower heights and crowns are fully visible with comfortable margins.
 */

import * as THREE from 'three';
import { ARCHITECTURE_COMPOSITION } from '@/config/architectureConfig';
import type { QualityPreset } from '@/config/globeConfig';
import type { GlobeHandle } from '@/components/Earth/createGlobe';
import { createArchitecturalComplex, type ArchitecturalComplexHandle } from './architecturalComplex';
import { createFinishLibrary, type FinishLibrary } from './blockMaterials';
import { createStudioLighting, type LightingHandle } from '@/components/Effects/Lighting';

export interface ArchitectureFit {
  distance: number;
  fov: number;
  aspect: number;
  azimuth: number;
  widthFraction?: number;
}

export interface ArchitectureSceneHandle {
  group: THREE.Group;
  materials: FinishLibrary;
  complex: ArchitecturalComplexHandle;
  lighting: LightingHandle;
  setRise: (value: number) => void;
  setOpacity: (value: number) => void;
  setVisible: (value: boolean) => void;
  setShadows: (enabled: boolean) => void;
  setLightIntensity: (value: number) => void;
  setEarthLightIntensity: (value: number) => void;
  setDetailRake: (value: number) => void;
  setFloorOpacity: (value: number) => void;
  refit: (fit: ArchitectureFit) => void;
  dispose: () => void;
}

export function createArchitectureScene(
  globe: GlobeHandle,
  preset: QualityPreset,
): ArchitectureSceneHandle {
  const { scene, renderer } = globe;
  const materials = createFinishLibrary(preset.finishMapSize);
  const complex = createArchitecturalComplex(materials, preset);

  const group = new THREE.Group();
  group.visible = false;
  group.add(complex.group);
  scene.add(group);

  // High-contrast architectural scale-model lighting
  const lighting = createStudioLighting(scene, 180, preset.shadowMapSize, globe.globe.lights());

  // Dark luxury environment map
  let environment: THREE.Texture | null = null;
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#0A0E17');

    const envSun = new THREE.DirectionalLight('#E6EDF5', 2.0);
    envSun.position.set(40, 60, 30);
    envScene.add(envSun);
    envScene.add(new THREE.AmbientLight('#1E2532', 0.8));

    environment = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = environment;

    pmrem.dispose();
  } catch {
    environment = null;
  }

  return {
    group,
    materials,
    complex,
    lighting,
    setRise: (value) => complex.setRise(value),
    setOpacity: (value) => {
      complex.setOpacity(value);
      materials.setOpacity(value);
    },
    setVisible: (value) => {
      group.visible = value;
    },
    setShadows: (enabled) => {
      complex.setShadows(enabled);
      lighting.setShadows(enabled);
    },
    setLightIntensity: (value) => lighting.setIntensity(value),
    setEarthLightIntensity: (value) => lighting.setEarthIntensity(value),
    setDetailRake: (value) => lighting.setDetailRake(value),
    setFloorOpacity: () => {},
    refit: ({ distance, fov, aspect, azimuth, widthFraction }) => {
      const visibleHeight = 2 * distance * Math.tan((fov * Math.PI) / 360);
      const visibleWidth = visibleHeight * aspect;
      const fraction = widthFraction ?? ARCHITECTURE_COMPOSITION.widthFraction;

      // Constrain scale by BOTH width and height so the full building cluster fits comfortably
      const targetWidth = ARCHITECTURE_COMPOSITION.podiumSize * 1.35;
      const targetHeight = ARCHITECTURE_COMPOSITION.clusterHeight * 1.45;

      const scaleX = (visibleWidth * fraction) / targetWidth;
      const scaleY = (visibleHeight * fraction) / targetHeight;
      const scale = Math.min(scaleX, scaleY);

      group.rotation.y = azimuth;
      group.scale.setScalar(scale);
      // Vertically center the tower cluster so all crowns and podium are completely in view
      group.position.y = -(ARCHITECTURE_COMPOSITION.clusterHeight * scale) * 0.44;
    },
    dispose: () => {
      scene.remove(group);
      complex.dispose();
      materials.dispose();
      lighting.dispose();
      if (environment) {
        scene.environment = null;
        environment.dispose();
      }
    },
  };
}
