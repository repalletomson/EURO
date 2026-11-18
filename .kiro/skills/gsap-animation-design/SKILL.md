---
name: gsap-animation-design
description: Design and implement polished GSAP animations, timelines, transitions, logo reveals, SVG motion, ScrollTrigger sequences, and reduced-motion alternatives. Use when choreographing the EURO FINISHES preloader, Europe-to-Hyderabad route, Earth-to-O transformation, or UI motion.
---

# GSAP Animation Design

## Project context
Create restrained, premium motion for EURO FINISHES. The main sequence is Earth entrance, Europe reveal, route to Hyderabad, destination highlight, Earth positioning, globe-to-logo crossfade, and wordmark reveal.

## Motion principles
- Motion should clarify hierarchy and tell the brand story, not decorate every element.
- Prefer smooth, controlled easing and purposeful overlaps.
- Avoid bounce-heavy effects, random movement, excessive parallax, and unnecessary perpetual animation.
- Keep durations and easing in a central configuration.
- Make the sequence understandable when viewed without sound.

## Timeline architecture
- Use one master GSAP timeline for the preloader sequence.
- Use labels for major phases: earth-intro, europe, journey, destination, logo-align, logo-reveal, complete.
- Keep DOM animation and Three.js animation synchronized through a small, explicit controller.
- Avoid multiple timelines writing to the same property at the same time.
- Use refs for DOM targets and stable Three.js object references.
- Use GSAP context or the React integration to scope animations and revert/clean them up on unmount.
- Do not create timelines during every render.
- Make the timeline deterministic and restartable for development/testing.

## Globe-to-logo choreography
- Complete the route and settle the globe before starting the logo alignment.
- Move/scale/rotate the Earth into the measured O position using a single coordinated transition.
- Crossfade to the supplied logo globe artwork only after alignment is visually matched.
- Reveal E, U, and R around the O; then reveal FINISHES and the tagline.
- Do not approximate the logo geometry with guessed coordinates. Measure the approved logo asset or use an approved vector asset.
- Prevent visible jumps, flashes, and mismatched circle diameters.

## Accessibility and controls
- Respect prefers-reduced-motion. Provide a short, low-motion or static-logo path.
- Provide a visible skip control with keyboard access.
- Ensure the animation cannot trap the user or block access to content.
- Do not use fake loading percentages or wait for an arbitrary timer when essential assets are already ready.

## Performance
- Animate transforms and opacity where possible.
- Avoid layout-thrashing properties for high-frequency motion.
- Avoid animating expensive filters over large full-screen surfaces.
- Stop timelines and remove listeners when no longer needed.
- Keep the animation responsive to viewport changes without restarting unexpectedly.

## Validation
- Test first play, replay, skip, unmount/remount, route completion, and reduced-motion paths.
- Confirm no overlapping tweens, console warnings, or stale animation references.
- Check desktop and mobile timing and alignment.
