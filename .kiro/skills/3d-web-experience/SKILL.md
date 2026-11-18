---
name: 3d-web-experience
description: Build, debug, and optimize realistic 3D web experiences using Three.js, React Three Fiber, Drei, WebGL, shaders, textures, lighting, cameras, and geographic globe visualizations. Use when implementing the EURO FINISHES Earth globe, Europe-to-Hyderabad route, 3D scene, materials, or logo transition.
---

# 3D Web Experience

## Project context
This skill is for the EURO FINISHES Next.js and React Three Fiber project. The signature experience is a realistic daytime Earth, a geographical route from Europe to Hyderabad, and a transition into the globe mark in the EURO wordmark.

## Engineering rules
- Inspect the existing project, package versions, assets, and component conventions before changing code.
- Use TypeScript and small, focused React Three Fiber components.
- Keep WebGL scene code in client-only components. Dynamically import the scene from Next.js with server-side rendering disabled where required.
- Use Three.js objects and refs for frame-by-frame animation. Do not trigger React state updates on every frame.
- Prefer reusable geometries, materials, and textures. Dispose of resources created by a component when it unmounts.
- Handle loading, failed texture requests, WebGL context loss, and unsupported WebGL gracefully.
- Cap device pixel ratio and reduce texture/visual complexity on mobile.
- Pause or reduce rendering when the document is hidden or the scene is not visible.
- Do not add dependencies without checking whether the project already has an equivalent.

## Earth rendering
- Use a high-quality, legally usable daytime Earth texture. Record its source, licence, resolution, and attribution requirements in project documentation.
- Keep geographic orientation consistent with the coordinate conversion utility.
- Use physically plausible directional lighting, subtle atmosphere, and optional cloud layers. Avoid excessive bloom, neon outlines, cartoon styling, or a flat-looking Earth.
- Do not claim a texture is NASA/public domain unless its source and licence have been verified.
- Keep Earth material parameters configurable rather than scattering magic numbers through components.

## Geographic coordinates
- Keep latitude/longitude conversion in a tested utility module.
- Use one documented coordinate convention for the sphere and camera.
- Validate that markers sit on the visible sphere surface and rotate with the globe.
- For routes, calculate a great-circle path using spherical interpolation. Offset the path slightly above the surface to avoid z-fighting.
- Treat Europe as a region, not a named city. If a representative route anchor is required for the visualization, make it an explicit configurable approximation and label it "EUROPE", never as a specific city.
- Hyderabad destination: latitude 17.3850, longitude 78.4867. Keep this in configuration.

## Scene quality
- Establish camera, globe radius, lighting, Earth orientation, and logo target position as named configuration values.
- Keep camera motion smooth and avoid abrupt orientation jumps.
- Ensure the route does not pass through the Earth or appear detached from its surface.
- Test the globe from desktop and mobile aspect ratios.

## Validation
- Run TypeScript checks and lint after changes.
- Verify coordinate conversion with known test points.
- Check that markers and route align with the visible continents.
- Inspect browser console and WebGL errors.
- Report texture provenance and any remaining visual limitations.
