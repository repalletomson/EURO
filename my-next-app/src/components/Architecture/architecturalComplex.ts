/**
 * Highrise Tower Cluster & Seamless Dark Luxury Land.
 *
 * Direct match to user requirements:
 *  - 3 Punchy Synchronized Falls: Exactly 3 falls (2-3 buildings at a time) completing cleanly.
 *  - Seamless Dark Land (NO light effect at bottom): Blends perfectly into #080D18.
 *  - Zero light rings, zero jarring edges.
 */

import * as THREE from 'three';
import { TOWERS_CLUSTER, ARCHITECTURE_COMPOSITION, type TowerSpec } from '@/config/architectureConfig';
import type { QualityPreset } from '@/config/globeConfig';
import type { FinishLibrary } from './blockMaterials';

export interface ArchitecturalComplexHandle {
  group: THREE.Group;
  detailWall: THREE.Mesh;
  centralTowerGroup: THREE.Group;
  setRise: (progress: number) => void;
  setOpacity: (alpha: number) => void;
  setShadows: (enabled: boolean) => void;
  dispose: () => void;
}

function easeBackOut(t: number, s = 1.35): number {
  const p = Math.min(1, Math.max(0, t)) - 1;
  return p * p * ((s + 1) * p + s) + 1;
}

export function createArchitecturalComplex(
  materials: FinishLibrary,
  preset: QualityPreset,
): ArchitecturalComplexHandle {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  const track = <T extends { dispose: () => void }>(obj: T): T => {
    disposables.push(obj);
    return obj;
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 1. SEAMLESS DARK LUXURY LAND (BLENDS INTO #080D18, NO HARSH EDGES)
  // ───────────────────────────────────────────────────────────────────────────
  const podiumGroup = new THREE.Group();
  root.add(podiumGroup);

  const landRadius = ARCHITECTURE_COMPOSITION.podiumSize * 0.72;
  // Circular contoured terrain disk that gently slopes down at edges into the dark background
  const landGeo = track(new THREE.CylinderGeometry(landRadius, landRadius * 1.08, 1.8, 64));
  const landMat = track(
    new THREE.MeshStandardMaterial({
      color: '#0A0E17',
      roughness: 0.92,
      metalness: 0.04,
    }),
  );
  const landMesh = new THREE.Mesh(landGeo, landMat);
  landMesh.position.y = -0.9;
  landMesh.receiveShadow = preset.shadows;
  podiumGroup.add(landMesh);

  // Soft subtle ground foundation bevel that dissolves into the dark background
  const subBaseGeo = track(new THREE.CylinderGeometry(landRadius * 1.08, landRadius * 1.18, 1.4, 64));
  const subBaseMat = track(
    new THREE.MeshStandardMaterial({
      color: '#080C14',
      roughness: 0.98,
      metalness: 0.0,
    }),
  );
  const subBaseMesh = new THREE.Mesh(subBaseGeo, subBaseMat);
  subBaseMesh.position.y = -2.3;
  subBaseMesh.receiveShadow = preset.shadows;
  podiumGroup.add(subBaseMesh);

  // ───────────────────────────────────────────────────────────────────────────
  // 2. HIGHRISE TOWERS (3 SYNCHRONIZED FALLS & SMOOTH STEP-BY-STEP FLOORS)
  // ───────────────────────────────────────────────────────────────────────────
  const towersGroup = new THREE.Group();
  root.add(towersGroup);

  interface TowerInstance {
    group: THREE.Group;
    towerMesh: THREE.Mesh;
    crownMesh: THREE.Mesh;
    lobbyMesh: THREE.Mesh;
    spec: TowerSpec;
    dropHeight: number;
  }

  const towerInstances: TowerInstance[] = [];

  const crownMat = track(
    new THREE.MeshStandardMaterial({
      color: '#222834',
      roughness: 0.35,
      metalness: 0.75,
    }),
  );

  let centralTowerGroup: THREE.Group = root;
  let centralTowerMesh: THREE.Mesh = null!;

  TOWERS_CLUSTER.forEach((spec, idx) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(spec.x, 0, spec.z);
    towersGroup.add(towerGroup);

    if (spec.id === 'tower-crown') {
      centralTowerGroup = towerGroup;
    }

    // Main tower volume with rich textured window grid & floor slabs
    const towerGeo = track(new THREE.BoxGeometry(spec.width, spec.height, spec.depth));
    const towerMat = materials.getTowerMaterial(spec.finish, spec.floors);
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.y = spec.height / 2;
    towerMesh.castShadow = preset.shadows;
    towerMesh.receiveShadow = preset.shadows;
    towerGroup.add(towerMesh);

    if (spec.id === 'tower-crown') {
      centralTowerMesh = towerMesh;
    }

    // Architectural mechanical roof crown / parapet box
    const crownGeo = track(
      new THREE.BoxGeometry(spec.width * 0.78, 1.8, spec.depth * 0.78),
    );
    const crownMesh = new THREE.Mesh(crownGeo, crownMat);
    crownMesh.position.y = spec.height + 0.9;
    crownMesh.castShadow = preset.shadows;
    towerGroup.add(crownMesh);

    // Clean base entrance lobby collar
    const lobbyGeo = track(
      new THREE.BoxGeometry(spec.width + 0.4, 1.4, spec.depth + 0.4),
    );
    const lobbyMesh = new THREE.Mesh(lobbyGeo, crownMat);
    lobbyMesh.position.y = 0.7;
    lobbyMesh.castShadow = preset.shadows;
    lobbyMesh.receiveShadow = preset.shadows;
    towerGroup.add(lobbyMesh);

    const dropHeight = 52 + idx * 3.0;
    towerInstances.push({
      group: towerGroup,
      towerMesh,
      crownMesh,
      lobbyMesh,
      spec,
      dropHeight,
    });
  });

  return {
    group: root,
    detailWall: centralTowerMesh,
    centralTowerGroup,
    setRise: (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));

      // Calculate kinetic ground impact compression & rebound for each wave
      let groundJolt = 0;
      if (p > 0.1 && p < 1.0) {
        groundJolt = Math.sin(p * Math.PI * 6) * Math.exp(-p * 2.5) * 0.25;
      }

      // Ground podium elevation with kinetic shock absorption
      const podiumT = easeBackOut(Math.min(1, p * 1.5), 1.05);
      podiumGroup.position.y = (1 - podiumT) * -3.0 - groundJolt;

      // ───────────────────────────────────────────────────────────────────────
      // EXACTLY 3 SYNCHRONIZED FALLS (2 TO 3 BUILDINGS AT A TIME)
      // ───────────────────────────────────────────────────────────────────────
      const waveWindow = 0.333; // 3 equal waves

      towerInstances.forEach(({ group, towerMesh, crownMesh, lobbyMesh, spec, dropHeight }) => {
        const start = spec.wave * waveWindow;
        const end = Math.min(1, start + waveWindow);

        if (p <= start) {
          // Waiting above in sky
          group.position.y = dropHeight;
          towerMesh.scale.y = 0.001;
          towerMesh.position.y = 0.1;
          crownMesh.visible = false;
          lobbyMesh.visible = false;
        } else if (p >= end) {
          // Completed and standing firmly
          group.position.y = 0;
          towerMesh.scale.y = 1.0;
          towerMesh.position.y = spec.height / 2;
          crownMesh.position.y = spec.height + 0.9;
          crownMesh.visible = true;
          lobbyMesh.visible = true;
        } else {
          // Inside active wave: Fall and build floors!
          const localP = (p - start) / waveWindow;
          lobbyMesh.visible = true;

          // Sub-phase A (0.0 to 0.32): Plunge from sky to ground impact
          if (localP < 0.32) {
            const dropRatio = localP / 0.32;
            const descentT = easeBackOut(dropRatio, 1.2);
            group.position.y = (1 - descentT) * dropHeight;

            const initRatio = 2 / spec.floors;
            towerMesh.scale.y = initRatio;
            towerMesh.position.y = (spec.height * initRatio) / 2;
            crownMesh.position.y = spec.height * initRatio + 0.9;
            crownMesh.visible = true;
          } else {
            // Sub-phase B (0.32 to 1.0): Foundation landed; floors erect upward!
            group.position.y = 0;

            const buildP = (localP - 0.32) / 0.68;
            const currentFloors = Math.max(2, Math.ceil(buildP * spec.floors));
            const floorRatio = Math.min(1, currentFloors / spec.floors);

            towerMesh.scale.y = floorRatio;
            towerMesh.position.y = (spec.height * floorRatio) / 2;
            crownMesh.position.y = spec.height * floorRatio + 0.9;
            crownMesh.visible = true;
          }
        }
      });
    },
    setOpacity: (alpha: number) => {
      const a = Math.min(1, Math.max(0, alpha));
      root.visible = a > 0.001;
      materials.setOpacity(a);
    },
    setShadows: (enabled: boolean) => {
      landMesh.receiveShadow = enabled;
    },
    dispose: () => {
      disposables.forEach((item) => item.dispose());
      root.clear();
    },
  };
}
