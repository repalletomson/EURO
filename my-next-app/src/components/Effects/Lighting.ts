/**
 * High-Contrast Architectural Highrise Lighting Rig.
 *
 * Direct match to the architectural scale model reference:
 *  - Crisp Key Directional Sun casting geometric shadows across the podium grid.
 *  - Deep dark ambient fill (#10141C) keeping shadows and background sleek and dark.
 *  - Dedicated raking light for the close-up facade finish detail shot.
 *  - ZERO cream/beige ambient tint.
 */

import * as THREE from 'three';

export interface LightingHandle {
  setIntensity: (value: number) => void;
  setEarthIntensity: (value: number) => void;
  setDetailRake: (value: number) => void;
  setShadows: (enabled: boolean) => void;
  dispose: () => void;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function createStudioLighting(
  scene: THREE.Scene,
  extent: number,
  shadowMapSize: number,
  earthLights: THREE.Light[],
): LightingHandle {
  const earthBase = earthLights.map((light) => light.intensity);

  // Deep dark architectural ambient fill (no cream tints)
  const hemisphere = new THREE.HemisphereLight('#2D3748', '#0F1218', 0.65);
  const ambient = new THREE.AmbientLight('#141822', 0.45);

  // Crisp Primary Key Sun (Casts the long geometric shadows seen in reference)
  const sun = new THREE.DirectionalLight('#F0F4FA', 2.8);
  sun.position.set(extent * 0.75, extent * 1.35, extent * 0.75);
  sun.target.position.set(0, 10, 0);

  // Secondary soft cool rim fill
  const rim = new THREE.DirectionalLight('#485A75', 0.85);
  rim.position.set(-extent * 0.8, extent * 0.8, -extent * 0.6);

  // Dedicated glancing raking light for the close-up facade detail shot
  const rakingLight = new THREE.DirectionalLight('#E6EDF5', 0);
  rakingLight.position.set(-extent * 0.4, extent * 0.3, extent * 0.35);
  rakingLight.target.position.set(0, 2.75, 5.5);
  rakingLight.castShadow = false;

  // Sharp, clean shadow configuration
  sun.castShadow = false;
  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = extent * 3.8;
  sun.shadow.camera.left = -extent * 0.7;
  sun.shadow.camera.right = extent * 0.7;
  sun.shadow.camera.top = extent * 0.7;
  sun.shadow.camera.bottom = -extent * 0.5;
  sun.shadow.bias = -0.0001;
  sun.shadow.normalBias = 0.02;

  const studio = [
    { light: hemisphere, base: hemisphere.intensity },
    { light: ambient, base: ambient.intensity },
    { light: sun, base: sun.intensity },
    { light: rim, base: rim.intensity },
  ];

  studio.forEach(({ light }) => {
    light.intensity = 0;
  });

  scene.add(
    hemisphere,
    ambient,
    sun,
    sun.target,
    rim,
    rakingLight,
    rakingLight.target,
  );

  return {
    setIntensity: (value) => {
      const t = clamp01(value);
      studio.forEach(({ light, base }) => {
        light.intensity = base * t;
      });
    },
    setEarthIntensity: (value) => {
      const t = clamp01(value);
      earthLights.forEach((light, index) => {
        light.intensity = earthBase[index] * t;
      });
    },
    setDetailRake: (value) => {
      rakingLight.intensity = clamp01(value) * 2.5;
    },
    setShadows: (enabled) => {
      sun.castShadow = enabled;
      sun.shadow.needsUpdate = true;
    },
    dispose: () => {
      scene.remove(
        hemisphere,
        ambient,
        sun,
        sun.target,
        rim,
        rakingLight,
        rakingLight.target,
      );
      hemisphere.dispose();
      ambient.dispose();
      sun.dispose();
      rim.dispose();
      rakingLight.dispose();
    },
  };
}
