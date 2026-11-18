/**
 * Highrise Tower & Podium Finish Materials Library.
 *
 * Provides MeshStandardMaterial instances with realistic textured window grids & slabs,
 * and the dark architectural podium grid platform.
 */

import * as THREE from 'three';
import { TOWERS_CLUSTER, type FinishName } from '@/config/architectureConfig';
import {
  createHighriseFacadeTexture,
  createPodiumGridTexture,
  type TowerTextures,
} from '@/lib/proceduralTextures';

export interface FinishLibrary {
  getTowerMaterial: (finish: FinishName, floors: number) => THREE.MeshStandardMaterial;
  getPodiumMaterial: () => THREE.MeshStandardMaterial;
  getDetailMaterial: () => THREE.MeshStandardMaterial;
  setOpacity: (value: number) => void;
  setReveal: () => void;
  dispose: () => void;
}

export function createFinishLibrary(mapSize = 1024): FinishLibrary {
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const disposers: Array<() => void> = [];

  // Podium Grid Material
  const podiumTex = createPodiumGridTexture(512);
  disposers.push(podiumTex.dispose);
  const podiumMat = new THREE.MeshStandardMaterial({
    map: podiumTex.map,
    normalMap: podiumTex.normalMap,
    roughnessMap: podiumTex.roughnessMap,
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0,
  });
  materials.set('podium', podiumMat);

  // Highrise Tower Materials
  TOWERS_CLUSTER.forEach((tower) => {
    const key = `${tower.finish}-${tower.floors}`;
    if (!materials.has(key)) {
      const tex = createHighriseFacadeTexture(tower.finish, tower.floors, 5, mapSize);
      disposers.push(tex.dispose);
      const mat = new THREE.MeshStandardMaterial({
        map: tex.map,
        normalMap: tex.normalMap,
        roughnessMap: tex.roughnessMap,
        roughness: 0.65,
        metalness: 0.2,
        transparent: true,
        opacity: 0,
      });
      materials.set(key, mat);
    }
  });

  // Dedicated Detail Wall Material (Marmorino Plaster)
  const detailTex = createHighriseFacadeTexture('marmorinoIvory', 12, 4, 1024);
  disposers.push(detailTex.dispose);
  const detailMat = new THREE.MeshStandardMaterial({
    map: detailTex.map,
    normalMap: detailTex.normalMap,
    roughnessMap: detailTex.roughnessMap,
    roughness: 0.45,
    metalness: 0.15,
    transparent: true,
    opacity: 0,
  });
  materials.set('detail', detailMat);

  return {
    getTowerMaterial: (finish, floors) => {
      const key = `${finish}-${floors}`;
      return materials.get(key) || materials.get('detail')!;
    },
    getPodiumMaterial: () => podiumMat,
    getDetailMaterial: () => detailMat,
    setOpacity: (value) => {
      const t = Math.min(1, Math.max(0, value));
      materials.forEach((mat) => {
        mat.opacity = t;
        mat.transparent = t < 0.999;
        mat.depthWrite = t >= 0.999;
      });
    },
    setReveal: () => {
      // Kept static: finishes are authentic and constant from the start
    },
    dispose: () => {
      disposers.forEach((d) => d());
      materials.forEach((m) => m.dispose());
      materials.clear();
    },
  };
}
