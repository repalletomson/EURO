# EURO FINISHES — Brand Preloader

Signature opening animation: realistic 3D Earth → geographical journey from Europe to Hyderabad → Earth transforms into the O in the EURO FINISHES wordmark.

## Running the project

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check
```

## Component architecture

```
src/
  app/
    layout.tsx            # Root layout, metadata, fonts
    page.tsx              # Mounts PreloaderClient (Server Component)
    globals.css           # Brand tokens, base reset

  components/preloader/
    PreloaderClient.tsx   # next/dynamic wrapper — keeps WebGL out of SSR
    BrandPreloader.tsx    # Top-level orchestrator; builds GSAP timeline
    GlobeCanvas.tsx       # R3F Canvas wrapper; DPR cap, WebGL error boundary
    GlobeScene.tsx        # R3F scene graph; lights, Earth, markers, arc
    Earth.tsx             # Realistic Earth sphere with normal+specular maps
    EarthAtmosphere.tsx   # Backside atmosphere glow ring
    EarthClouds.tsx       # Cloud layer with Suspense fallback
    EuropeMarker.tsx      # Origin marker (representative central-European anchor)
    HyderabadMarker.tsx   # Destination marker at 17.385°N, 78.487°E
    JourneyArc.tsx        # Great-circle route with progressive draw via drawRange
    LogoTransition.tsx    # Static logo crossfade overlay
    WordmarkReveal.tsx    # DOM wordmark letters (E, U, R, O-slot, FINISHES, tagline)

  hooks/
    useReducedMotion.ts   # prefers-reduced-motion hook

  lib/
    animationConfig.ts    # Brand colours, globe params, camera, timing, easing
    globeCoordinates.ts   # lat/lng → THREE.Vector3, great-circle path, rotation math
    globeMaterials.ts     # Reusable Three.js material factories
    preloaderTimeline.ts  # Master GSAP timeline; all animation phases

  types/
    globe.ts              # Shared TypeScript interfaces
```

## Earth textures

Textures are sourced from the Three.js examples repository (MIT licence):
- `earth-day.jpg` — `three.js/examples/textures/planets/earth_atmos_2048.jpg`
- `earth-normal.jpg` — `three.js/examples/textures/planets/earth_normal_2048.jpg`
- `earth-specular.jpg` — `three.js/examples/textures/planets/earth_specular_2048.jpg`
- `earth-clouds.png` — `three.js/examples/textures/planets/earth_clouds_1024.png`

For a production deployment, replace with higher-resolution NASA Blue Marble textures
(public domain: https://visibleearth.nasa.gov/) at 4096×2048 or higher for sharper continents.

## Animation sequence

| Label          | Phase                                    | ~Duration |
|----------------|------------------------------------------|-----------|
| `earth-intro`  | Earth scales in from near-zero           | 1.0 s     |
| `europe`       | Camera moves close, Earth rotates to EU  | 1.0 s     |
| `origin-marker`| Europe marker pops in                    | 0.4 s     |
| `journey`      | Route draws, traveller moves to HYD      | 1.8 s     |
| `destination`  | Hyderabad marker + pulse ring            | 0.5 s     |
| `logo-align`   | Camera resets, globe scales to O size    | 0.7+0.8 s |
| `logo-reveal`  | Logo crossfade, E/U/R reveal             | 0.6 s     |
|                | FINISHES + tagline                       | 0.6 s     |

## Keyboard / accessibility

- Press **Escape**, **Space**, or **Enter** to skip the animation.
- Skip button at bottom-right for pointer users.
- `prefers-reduced-motion: reduce` shows the static logo immediately.
- WebGL fallback: static logo image shown if canvas fails to initialise.

## Known limitations

- Earth texture resolution is 2048×1024. Replace with 4096×2048 NASA textures for
  sharper continent detail on retina displays.
- The route is a great-circle on a perfect sphere; it does not account for 
  Earth's oblate spheroid geometry (negligible visual difference at this scale).
- The Europe origin is a representative central-European anchor (48.5°N, 10°E),
  not a specific city — consistent with brand geography requirements.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
