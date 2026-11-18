/**
 * Background starfield.
 *
 * Two additive point clouds share the globe's scene and camera, so they need
 * no extra renderer and inherit every camera move for free.
 */

import * as THREE from 'three';
import { GLOBE_VISUALS, type QualityPreset } from '@/config/globeConfig';

export interface StarfieldHandle {
  setOpacity: (value: number) => void;
  destroy: () => void;
}

function makeCloud(count: number, minRadius: number, maxRadius: number, size: number, opacity: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    // Uniform direction on the sphere.
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const r = minRadius + Math.random() * (maxRadius - minRadius);
    const s = Math.sqrt(1 - u * u);
    positions[i * 3] = r * s * Math.cos(theta);
    positions[i * 3 + 1] = r * u;
    positions[i * 3 + 2] = r * s * Math.sin(theta);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(GLOBE_VISUALS.starColor),
    size,
    sizeAttenuation: false,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

export function createStarfield(scene: THREE.Scene, preset: QualityPreset): StarfieldHandle {
  const distant = makeCloud(preset.starCount, 3200, 11000, 1.1, 0.5);
  const near = makeCloud(Math.round(preset.starCount * 0.12), 1800, 4200, 2.2, 0.7);
  distant.material.depthTest = false;
  near.material.depthTest = false;
  distant.renderOrder = -2;
  near.renderOrder = -1;
  scene.add(distant, near);

  return {
    setOpacity: (value) => {
      const clamped = Math.min(1, Math.max(0, value));
      distant.material.opacity = clamped * 0.5;
      near.material.opacity = clamped * 0.7;
      distant.visible = clamped > 0.002;
      near.visible = clamped > 0.002;
    },
    destroy: () => {
      scene.remove(distant, near);
      distant.geometry.dispose();
      distant.material.dispose();
      near.geometry.dispose();
      near.material.dispose();
    },
  };
}
