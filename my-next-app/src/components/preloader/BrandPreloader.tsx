'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import EuroWordmark, { type EuroWordmarkHandle } from '@/components/branding/EuroWordmark';
import PreloaderControls from '@/components/ui/PreloaderControls';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CAMERAS } from '@/config/animationConfig';
import { ARCHITECTURE_COMPOSITION } from '@/config/architectureConfig';
import { BRAND } from '@/config/brandConfig';
import type { MasterController } from '@/animations/masterTimeline';

declare global {
  interface Window {
    euroPreloader?: MasterController;
    euroGlobe?: GlobeHandle;
  }
}
import type { GlobeHandle } from '@/components/Earth/createGlobe';
import type { ArchitectureSceneHandle } from '@/components/Architecture/architectureScene';
import type { StarfieldHandle } from '@/components/Effects/Starfield';
import type { RouteHandle } from '@/components/Earth/routeAnimation';
import type { CloudLayerHandle, EarthTextureSet } from '@/components/Earth/earthTextures';
import type { CameraHandle } from '@/components/Earth/cameraController';

export type Phase = 'loading' | 'playing' | 'done' | 'error';

/**
 * Top-level orchestrator.
 *
 * Begins IMMEDIATELY with the full-screen Earth scene in deep space.
 * No initial logo, text, tagline, or loading screen.
 * Seamless journey: Earth -> Europe -> Hyderabad -> Landscape -> Architecture -> Detail -> Brand O.
 */
export default function BrandPreloader() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('loading');
  const [dismissed, setDismissed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const ivoryRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<EuroWordmarkHandle>(null);
  const controllerRef = useRef<MasterController | null>(null);

  const handleSkip = useCallback(() => {
    controllerRef.current?.skip();
    setPhase('done');
  }, []);

  const handleReplay = useCallback(() => {
    setDismissed(false);
    setPhase('loading');
    setAttempt((value) => value + 1);
  }, []);

  // Keyboard skip or enter
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (phase === 'playing' && (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        handleSkip();
      } else if (phase === 'done' && !dismissed && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setDismissed(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, dismissed, handleSkip]);

  // Lock page scroll until user enters or dismisses preloader
  useEffect(() => {
    document.body.classList.toggle('is-locked', !dismissed);
    return () => document.body.classList.remove('is-locked');
  }, [dismissed]);

  // Auto-transition to Hero page after 2.8s on the final brand lockup
  useEffect(() => {
    if (phase !== 'done' || dismissed) return;
    const timer = window.setTimeout(() => {
      setDismissed(true);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [phase, dismissed]);

  // Scroll / Wheel / Touch gestures transition to Hero page when finished
  useEffect(() => {
    if (phase !== 'done' || dismissed) return;
    const onScroll = () => setDismissed(true);
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [phase, dismissed]);

  // Boot the experience
  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    const ivory = ivoryRef.current;
    const vignette = vignetteRef.current;
    const labels = labelsRef.current;
    if (!mount || !canvas || !ivory || !vignette || !labels) return;

    let disposed = false;
    let controller: MasterController | null = null;
    let ticker: (() => void) | null = null;
    let onResize: (() => void) | null = null;
    const handles: {
      globe?: GlobeHandle;
      route?: RouteHandle;
      architecture?: ArchitectureSceneHandle;
      stars?: StarfieldHandle;
      clouds?: CloudLayerHandle | null;
      textures?: EarthTextureSet;
      refit?: () => void;
    } = {};

    const disposeHandles = () => {
      handles.route?.destroy();
      handles.architecture?.dispose();
      handles.stars?.destroy();
      handles.clouds?.destroy();
      handles.globe?.destroy();
      handles.textures?.dispose();
    };

    const boot = async () => {
      setPhase('loading');

      const [
        { createGlobe },
        { createCameraController },
        { loadEarthTextures, applyEarthTextures, createCloudLayer },
        { createRouteLayer },
        { createStarfield },
        { createArchitectureScene },
        { buildMasterTimeline, cameraAzimuth },
        { getQualityPreset },
      ] = await Promise.all([
        import('@/components/Earth/createGlobe'),
        import('@/components/Earth/cameraController'),
        import('@/components/Earth/earthTextures'),
        import('@/components/Earth/routeAnimation'),
        import('@/components/Effects/Starfield'),
        import('@/components/Architecture/architectureScene'),
        import('@/animations/masterTimeline'),
        import('@/config/globeConfig'),
      ]);

      if (disposed) return;

      const preset = getQualityPreset();
      const textures = await loadEarthTextures();
      if (disposed) {
        textures.dispose();
        return;
      }
      handles.textures = textures;

      const globe = createGlobe(mount, preset);
      handles.globe = globe;
      applyEarthTextures(globe.globe, textures);

      const clouds = createCloudLayer(globe.globe, textures.clouds, preset);
      handles.clouds = clouds;
      const stars = createStarfield(globe.scene, preset);
      handles.stars = stars;
      const camera: CameraHandle = createCameraController(globe.globe);
      const route = createRouteLayer(globe.globe, labels);
      handles.route = route;
      const architecture = createArchitectureScene(globe, preset);
      handles.architecture = architecture;

      const fitArchitecture = () => {
        const pose = CAMERAS.archStart;
        architecture.refit({
          distance: globe.globe.getGlobeRadius() * (1 + pose.altitude),
          fov: camera.fov(),
          aspect: (mount.clientWidth || window.innerWidth) / (mount.clientHeight || window.innerHeight),
          azimuth: cameraAzimuth(pose),
          widthFraction:
            window.innerWidth < 760
              ? ARCHITECTURE_COMPOSITION.mobileWidthFraction
              : ARCHITECTURE_COMPOSITION.widthFraction,
        });
      };
      fitArchitecture();
      handles.refit = fitArchitecture;

      let resizeTimer: number | undefined;
      onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (disposed) return;
          fitArchitecture();
          if (controller?.timeline.progress() === 1) controller.applyFinalState();
        }, 180);
      };
      window.addEventListener('resize', onResize);

      await new Promise<void>((resolve) => {
        const done = () => resolve();
        requestAnimationFrame(() => requestAnimationFrame(done));
        window.setTimeout(done, 80);
      });
      if (disposed) {
        disposeHandles();
        return;
      }

      const wordmark = wordmarkRef.current;
      if (!wordmark) {
        throw new Error('EURO wordmark did not mount');
      }

      controller = buildMasterTimeline(
        {
          globe,
          camera,
          route,
          architecture,
          stars,
          clouds,
          wordmark,
          layers: { canvas, ivory, vignette },
          onComplete: () => setPhase('done'),
        },
        { reducedMotion },
      );
      controllerRef.current = controller;
      if (process.env.NODE_ENV !== 'production') {
        window.euroPreloader = controller;
        window.euroGlobe = globe;
      }

      if (reducedMotion) {
        setPhase('done');
      } else {
        setPhase('playing');
        controller.timeline.play();
      }

      ticker = () => route.update();
      gsap.ticker.add(ticker);
    };

    boot().catch((error) => {
      console.error('[EURO FINISHES] Preloader failed to start:', error);
      if (!disposed) {
        setPhase('error');
        disposeHandles();
      }
    });

    return () => {
      disposed = true;
      if (ticker) gsap.ticker.remove(ticker);
      if (onResize) window.removeEventListener('resize', onResize);
      controller?.destroy();
      controllerRef.current = null;
      disposeHandles();
    };
  }, [reducedMotion, attempt]);

  return (
    <section
      ref={rootRef}
      className={`preloader ${dismissed ? 'is-dismissed' : ''}`}
      data-phase={phase}
      style={{ background: BRAND.space }}
    >
      <div ref={ivoryRef} className="preloader__ivory" aria-hidden="true" />
      <div ref={canvasRef} className="preloader__canvas">
        <div ref={mountRef} className="preloader__mount" />
      </div>
      <div ref={vignetteRef} className="preloader__vignette" aria-hidden="true" />
      <div ref={labelsRef} className="preloader__labels" aria-hidden="true" />

      {/* Brand Wordmark (Starts hidden; live Earth moves into the O at the finale) */}
      <EuroWordmark ref={wordmarkRef} />

      {/* No initial loader or logo screen at time zero */}

      {phase === 'error' && (
        <div className="preloader__fallback">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/euro-finishes-logo.jpeg" alt="EURO FINISHES — Italian Texture Wall Paint" />
          <p>Your browser could not start the 3D introduction.</p>
        </div>
      )}

      {phase === 'done' && !dismissed && (
        <div className="preloader__enter-wrap">
          <button
            type="button"
            className="preloader__enter-btn"
            onClick={() => setDismissed(true)}
            aria-label="Enter Euro Finishes Website"
          >
            <span>Enter Website</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.166 10h11.667m-4.166-4.167 4.166 4.167-4.166 4.167"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {phase === 'done' && !dismissed && (
        <div
          className="preloader__scroll"
          aria-hidden="true"
          onClick={() => setDismissed(true)}
          style={{ cursor: 'pointer' }}
        >
          <span>Scroll to Explore</span>
          <span className="preloader__scroll-line" />
        </div>
      )}

      <PreloaderControls phase={phase} onSkip={handleSkip} onReplay={handleReplay} />
    </section>
  );
}
