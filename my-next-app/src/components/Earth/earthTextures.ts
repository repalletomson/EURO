/**
 * Earth texture loading (day / normal / specular / clouds) plus the cloud shell.
 *
 * Textures are preloaded before the globe is created so the first rendered
 * frame already has the finished look, and so a failed texture never blocks
 * the animation (the globe simply renders without it).
 */

import * as THREE from 'three';
import type { GlobeInstance } from 'globe.gl';
import { EARTH_TEXTURES, GLOBE_VISUALS, type QualityPreset } from '@/config/globeConfig';

export interface EarthTextureSet {
  day: THREE.Texture | null;
  normal: THREE.Texture | null;
  specular: THREE.Texture | null;
  clouds: THREE.Texture | null;
  dispose: () => void;
}

async function load(
  loader: THREE.TextureLoader,
  url: string,
  srgb: boolean,
): Promise<THREE.Texture | null> {
  try {
    const texture = await loader.loadAsync(url);
    texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.anisotropy = 4;
    return texture;
  } catch {
    return null;
  }
}

export async function loadEarthTextures(): Promise<EarthTextureSet> {
  const loader = new THREE.TextureLoader();
  const [day, normal, specular, clouds] = await Promise.all([
    load(loader, EARTH_TEXTURES.day, true),
    load(loader, EARTH_TEXTURES.normal, false),
    load(loader, EARTH_TEXTURES.specular, false),
    load(loader, EARTH_TEXTURES.clouds, true),
  ]);

  return {
    day,
    normal,
    specular,
    clouds,
    dispose: () => {
      [day, normal, specular, clouds].forEach((texture) => texture?.dispose());
    },
  };
}

/** Apply the daytime globe material — normal + specular maps, no grey rim. */
export function applyEarthTextures(globe: GlobeInstance, textures: EarthTextureSet): void {
  const material = globe.globeMaterial() as THREE.MeshPhongMaterial;

  if (textures.day) material.map = textures.day;
  if (textures.normal) {
    material.bumpMap = textures.normal;
    material.bumpScale = GLOBE_VISUALS.bumpScale;
  }
  if (textures.specular) material.specularMap = textures.specular;

  material.color = new THREE.Color('#FFFFFF');
  material.specular = new THREE.Color(GLOBE_VISUALS.specularColor);
  material.shininess = GLOBE_VISUALS.shininess;
  material.transparent = true;
  material.opacity = 0;
  material.depthWrite = false;
  material.needsUpdate = true;
}

export interface CloudLayerHandle {
  setOpacity: (value: number) => void;
  destroy: () => void;
}

/**
 * A thin cloud shell sitting just above the surface. Lives in the same scene
 * as the globe, so it fades and zooms with it and needs no extra renderer.
 */
export function createCloudLayer(
  globe: GlobeInstance,
  texture: THREE.Texture | null,
  preset: QualityPreset,
): CloudLayerHandle | null {
  if (!preset.clouds || !texture) return null;

  const radius = globe.getGlobeRadius() * GLOBE_VISUALS.cloudRadiusFactor;
  const geometry = new THREE.SphereGeometry(radius, 96, 48);
  const material = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    color: '#FFFFFF',
    emissive: new THREE.Color('#1B2A3D'),
  });

  const mesh = new THREE.Mesh(geometry, material);
  // Match the earth mesh orientation so continents and clouds line up.
  mesh.rotation.y = -Math.PI / 2;
  mesh.renderOrder = 1;
  globe.scene().add(mesh);

  return {
    setOpacity: (value: number) => {
      material.opacity = Math.min(1, Math.max(0, value));
      mesh.visible = material.opacity > 0.001;
    },
    destroy: () => {
      globe.scene().remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
