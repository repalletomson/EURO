---
name: nextjs-frontend-engineering
description: Build and maintain production-quality Next.js applications using the App Router, React, TypeScript, Server and Client Components, reusable architecture, data loading, accessibility, and SEO. Use when implementing or refactoring the EURO FINISHES Next.js project.
---

# Next.js Frontend Engineering

## Architecture
- Inspect the existing repository and follow its established conventions before introducing new structure.
- Use the Next.js App Router.
- Prefer Server Components by default; use Client Components only for browser APIs, state, event handlers, WebGL, or interactive animation.
- Keep the Three.js scene isolated in client-only components and dynamically import it where necessary.
- Keep data, presentation, and interaction concerns separate.
- Build small reusable components with clear TypeScript props.
- Avoid giant page components and unnecessary abstractions.

## TypeScript and React
- Use explicit types for component props, configuration, and utility functions.
- Avoid `any`; use safe types and narrow unknown values.
- Keep hooks unconditional and respect React hook rules.
- Avoid unnecessary state and effects.
- Do not use effects to derive values that can be calculated during render.
- Ensure event listeners, observers, and animation instances are cleaned up.

## Next.js practices
- Use `next/image` for optimized content images where appropriate.
- Use `next/font` for local or supported font loading.
- Keep metadata and page titles meaningful.
- Avoid importing browser-only libraries into Server Components.
- Do not access `window`, `document`, or WebGL during server rendering.
- Use loading and error boundaries where they improve resilience.

## Maintainability
- Centralize design tokens, animation configuration, and geographic constants.
- Keep environment-specific values out of source code when appropriate.
- Document non-obvious coordinate math and animation synchronization.
- Avoid unnecessary packages and duplicate utilities.
- Preserve existing functionality when refactoring.

## Quality checks
- Run the project's lint command.
- Run TypeScript type checking.
- Run the production build.
- Fix errors rather than suppressing them.
- Test navigation, responsive behaviour, loading states, and browser console output.
- Report any checks that could not be run.
