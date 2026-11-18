/**
 * Camera controller.
 *
 * Every camera move in the experience goes through `setPose`, which writes a
 * Globe.gl point-of-view. GSAP tweens a plain pose object and calls `setPose`
 * on update, so two sequences can never drive the camera at the same time.
 *
 * Also owns the projection maths needed to size the live globe to the O slot.
 */

import type { GlobeInstance } from 'globe.gl';
import type { CameraPose } from '@/config/animationConfig';
import * as THREE from 'three';

export interface CameraHandle {
  setPose: (pose: CameraPose) => void;
  getPose: () => CameraPose;
  /** Vertical field of view in degrees. */
  fov: () => number;
  viewportHeight: () => number;
  /** Screen-space radius of the globe disc at the given altitude. */
  screenRadiusAt: (altitude: number) => number;
  /** Altitude that renders the globe disc at exactly `radiusPx`. */
  altitudeForScreenRadius: (radiusPx: number) => number;
}

export function createCameraController(globe: GlobeInstance): CameraHandle {
  const camera = globe.camera() as THREE.PerspectiveCamera;
  const radius = globe.getGlobeRadius();

  const current: CameraPose = { ...globe.pointOfView() };

  const focalLength = () => {
    const height = globe.height() || camera.aspect * globe.width() || 1;
    return height / 2 / Math.tan((camera.fov * Math.PI) / 360);
  };

  return {
    setPose: (pose) => {
      current.lat = pose.lat;
      current.lng = pose.lng;
      // globe.gl clamps to the surface, but keep the guard explicit.
      current.altitude = Math.max(0.002, pose.altitude);
      globe.pointOfView({ ...current }, 0);
    },
    getPose: () => ({ ...current }),
    fov: () => camera.fov,
    viewportHeight: () => globe.height() || window.innerHeight,
    screenRadiusAt: (altitude) => {
      const distance = radius * (1 + Math.max(0.0001, altitude));
      return (focalLength() * radius) / Math.sqrt(distance * distance - radius * radius);
    },
    altitudeForScreenRadius: (radiusPx) => {
      const safeRadius = Math.max(1, radiusPx);
      const ratio = safeRadius / focalLength();
      const distance = radius * Math.sqrt(1 + 1 / (ratio * ratio));
      return Math.max(0.002, distance / radius - 1);
    },
  };
}
