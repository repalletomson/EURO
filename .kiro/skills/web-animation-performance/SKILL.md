---
name: web-animation-performance
description: Audit and optimize browser animation performance, GSAP timelines, Three.js and WebGL rendering, texture memory, frame rate, mobile GPU load, and cleanup. Use when profiling or improving the EURO FINISHES globe preloader and logo reveal.
---

# Web Animation Performance

## Goals
Keep the EURO FINISHES preloader smooth, responsive, and reliable across desktop and mobile devices without compromising the intended visual quality.

## Profiling first
- Reproduce the issue before changing code.
- Use browser performance tools and WebGL diagnostics where available.
- Identify whether the bottleneck is CPU, GPU, JavaScript, texture upload, layout, paint, or network.
- Record the device, viewport, browser, and reproduction steps.
- Avoid speculative optimization without evidence.

## Three.js and WebGL
- Reuse geometries, materials, and textures.
- Dispose of resources owned by components on cleanup.
- Avoid creating objects inside every frame callback.
- Avoid unnecessary React state updates in `useFrame`.
- Cap device pixel ratio, especially on mobile.
- Use texture resolutions appropriate to the display and device.
- Avoid excessive transparent layers, large full-screen shaders, and costly post-processing.
- Pause rendering when the document is hidden or the scene is not needed.
- Handle WebGL context loss and provide a graceful fallback.
- Avoid duplicate render loops and multiple canvases for one scene.

## GSAP
- Use a coordinated master timeline for the preloader.
- Avoid conflicting tweens targeting the same property.
- Animate transform and opacity where possible.
- Clean up timelines, ScrollTriggers, and event listeners.
- Avoid forced synchronous layout and repeated DOM measurements.
- Keep the sequence deterministic and test skip/replay behaviour.

## Loading strategy
- Load only assets required for the initial animation.
- Do not preload the entire future website gallery.
- Provide loading and failure states for Earth textures and logo assets.
- Do not use artificial loading percentages.
- Avoid blocking the user when nonessential assets are still loading.

## Mobile and accessibility
- Provide lower-cost settings for mobile and weaker GPUs.
- Respect `prefers-reduced-motion`.
- Provide a static or simplified fallback if WebGL is unavailable.
- Ensure the final logo remains crisp and correctly proportioned.

## Acceptance checks
- No obvious frame drops during the route and logo transition on target devices.
- No unbounded memory growth during repeated visits or replay.
- No console errors or WebGL warnings.
- No animation continues unnecessarily in a hidden tab.
- No broken fallback when WebGL or texture loading fails.
- Record measured improvements and remaining limitations.
