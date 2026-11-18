// v3 — Full-screen horizontal pinned carousel, GSAP ScrollTrigger scrub
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────────────────────── */
interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  location: string;
  material: string;
  year: string;
  description: string;
  image: string;
  alt: string;
}

const PROJECTS: Project[] = [
  {
    id: 'bellagio',
    index: '01',
    title: 'Villa Bellagio',
    category: 'Private Lakeside Villa',
    location: 'Lake Como, Italy',
    material: 'Venetian Marmorino & Calce Spatolata',
    year: '2025',
    description:
      'Hand-burnished Calce Spatolata capturing the shifting dawn light across double-height lakeside galleries.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90',
    alt: 'Villa Bellagio luxury lakeside pavilion',
  },
  {
    id: 'palazzo-milano',
    index: '02',
    title: 'Palazzo Milano',
    category: 'Penthouse Residence',
    location: 'Milano, Italy',
    material: 'Travertino Romano & Honed Limestone',
    year: '2025',
    description:
      'Monolithic honed Roman travertine surfaces warming contemporary glass architecture with ancient quarried depth.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90',
    alt: 'Palazzo Milano interior with honed Roman travertine walls',
  },
  {
    id: 'sas-crown',
    index: '03',
    title: 'SAS Crown Highrise',
    category: 'Monumental Penthouse',
    location: 'Hyderabad, India',
    material: 'Pietra Spaccata & Natural Slag',
    year: '2026',
    description:
      'Sculptural fissure textures engineered for India\'s 59-storey residential landmark with seamless monumental continuity.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=90',
    alt: 'SAS Crown luxury highrise with textured stone walls',
  },
  {
    id: 'amalfi',
    index: '04',
    title: 'Residenza Amalfi',
    category: 'Cliffside Estate',
    location: 'Amalfi Coast, Italy',
    material: 'Aged Slaked Grassello & Crushed Carrara',
    year: '2024',
    description:
      '24-Month aged grassello blended with Carrara dust — engineered to breathe in harmony with Mediterranean sea winds.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=90',
    alt: 'Residenza Amalfi cliffside estate with grassello plaster',
  },
  {
    id: 'firenze',
    index: '05',
    title: 'Studio Firenze',
    category: 'Curated Gallery Atelier',
    location: 'Florence, Italy',
    material: 'Minimalist Raw Earth & Cocciopesto',
    year: '2026',
    description:
      'Cocciopesto and natural volcanic earth — an ultra-matte acoustic envelope designed for rare art and sculpture.',
    image:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=90',
    alt: 'Studio Firenze contemporary gallery with raw earth finishes',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   AUDIO — soft two-tone chime
   ───────────────────────────────────────────────────────────────────────────── */
class GalleryAudio {
  private ctx: AudioContext | null = null;

  init() {
    if (this.ctx) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (Ctx) this.ctx = new Ctx();
  }

  playChime() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [[520, 0.08], [780, 0.04]].forEach(([freq, vol], i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq as number;
      env.gain.setValueAtTime(0, t + i * 0.04);
      env.gain.linearRampToValueAtTime(vol as number, t + i * 0.04 + 0.015);
      env.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.04 + 0.5);
      osc.connect(env);
      env.connect(ctx.destination);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.52);
    });
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export default function KineticGallerySection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stRef       = useRef<ScrollTrigger | null>(null);
  const audioRef    = useRef(new GalleryAudio());

  const [activeIndex,  setActiveIndex ] = useState(0);
  const [progress,     setProgress    ] = useState(0);
  const [soundEnabled, setSoundEnabled ] = useState(false);

  const prevActive = useRef(0);

  /* ── Play chime ──────────────────────────────────────────────── */
  useEffect(() => {
    if (activeIndex !== prevActive.current) {
      prevActive.current = activeIndex;
      if (soundEnabled) audioRef.current.playChime();
    }
  }, [activeIndex, soundEnabled]);

  /* ── Build ScrollTrigger horizontal scrub ────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const totalSlides = PROJECTS.length;
      
      const getTotalDist = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth + 80);
      };

      const updateSlides = (p: number) => {
        setProgress(p);
        const totalDist = getTotalDist();

        // Smoothly translate track
        gsap.set(track, {
          x: -p * totalDist,
        });

        // Determine active card based on progress
        const rawIdx = p * (totalSlides - 1);
        const idx = Math.round(Math.max(0, Math.min(totalSlides - 1, rawIdx)));
        setActiveIndex(idx);

        // Per-slide subtle image parallax and depth scaling
        slideRefs.current.forEach((slide, i) => {
          if (!slide) return;
          const rect = slide.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const vw = window.innerWidth;
          const dist = (center - vw / 2) / vw; // -1 .. 1

          // Subtle parallax shift inside each card
          const img = imgRefs.current[i];
          if (img) {
            gsap.set(img, { x: dist * -35 });
          }

          // Depth scaling: cards slightly shrink as they move away from center
          const scale = Math.max(0.93, 1 - Math.abs(dist) * 0.1);
          const opacity = Math.max(0.45, 1 - Math.abs(dist) * 0.85);
          gsap.set(slide, { scale, opacity });
        });
      };

      // Master horizontal scroll pin — cleanly scrub through 5 cards,
      // and unpin the moment the final card settles with zero trailing dead space
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${getTotalDist() + 150}`,
        pin: true,
        scrub: prefersReducedMotion ? false : 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateSlides(self.progress);
        },
        onRefresh: (self) => {
          updateSlides(self.progress);
        },
      });

      // Initial pass
      updateSlides(0);

      stRef.current = st;
    }, section);

    return () => { ctx.revert(); };
  }, []);

  /* ── Jump to slide ───────────────────────────────────────────── */
  const jumpTo = useCallback((idx: number) => {
    const st = stRef.current;
    if (!st) return;
    const p = idx / (PROJECTS.length - 1);
    const target = st.start + p * (st.end - st.start);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  /* ── Sound toggle ────────────────────────────────────────────── */
  const toggleSound = useCallback(() => {
    if (!soundEnabled) {
      audioRef.current.init();
      audioRef.current.playChime();
      setSoundEnabled(true);
    } else {
      setSoundEnabled(false);
    }
  }, [soundEnabled]);

  const activeProject = PROJECTS[activeIndex] ?? PROJECTS[0];

  return (
    <section
      ref={sectionRef}
      className="hc-section"
      id="catalogue"
      aria-label="Architectural Catalogue Volume 26"
    >
      {/* ── Eyebrow label (top-left, always visible) ───────────── */}
      <div className="hc-eyebrow" aria-hidden="true">
        <span className="hc-eyebrow__dot" />
        <span>Architectural Monograph</span>
        <span className="hc-eyebrow__sep">·</span>
        <span>Private Commissions</span>
      </div>

      {/* ── Counter pill (top-right) ───────────────────────────── */}
      <div className="hc-counter" aria-live="polite" aria-label="Current project">
        <span className="hc-counter__cur">{activeProject.index}</span>
        <span className="hc-counter__sep">/</span>
        <span className="hc-counter__tot">0{PROJECTS.length}</span>
      </div>

      {/* ── Sound toggle (bottom-left) ─────────────────────────── */}
      <button
        type="button"
        className={`hc-sound${soundEnabled ? ' is-on' : ''}`}
        onClick={toggleSound}
        aria-label="Toggle sound"
      >
        <span className="hc-sound__bars" aria-hidden="true">
          <span className="hc-sound__b hc-sound__b1" />
          <span className="hc-sound__b hc-sound__b2" />
          <span className="hc-sound__b hc-sound__b3" />
        </span>
        <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
      </button>

      {/* ── Scroll cue (bottom-right) ──────────────────────────── */}
      <div className="hc-scroll-cue" aria-hidden="true">
        <span>Scroll to traverse</span>
        <span className="hc-scroll-cue__arrow">→</span>
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className="hc-progress" aria-hidden="true">
        <div className="hc-progress__fill" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* ── Nav dots (bottom-center) ───────────────────────────── */}
      <nav className="hc-nav" aria-label="Select project">
        {PROJECTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`hc-nav__dot${i === activeIndex ? ' is-active' : ''}`}
            onClick={() => jumpTo(i)}
            aria-label={`Go to ${p.title}`}
          />
        ))}
      </nav>

      {/* ── Horizontal image track ─────────────────────────────── */}
      <div ref={trackRef} className="hc-track" aria-label="Project images">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { slideRefs.current[i] = el; }}
            className={`hc-slide${i === activeIndex ? ' is-active' : ''}`}
            aria-current={i === activeIndex ? 'true' : 'false'}
          >
            {/* Full-bleed image with parallax */}
            <div className="hc-slide__img-wrap">
              <img
                ref={(el) => { imgRefs.current[i] = el; }}
                src={project.image}
                alt={project.alt}
                className="hc-slide__img"
                loading={i < 2 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>

            {/* Gradient scrim */}
            <div className="hc-slide__scrim" aria-hidden="true" />

            {/* Caption overlay */}
            <div
              ref={(el) => { captionRefs.current[i] = el; }}
              className="hc-slide__caption"
            >
              {/* Top-left: index + category */}
              <div className="hc-slide__meta">
                <span className="hc-slide__meta-idx">{project.index}</span>
                <span className="hc-slide__meta-sep">·</span>
                <span className="hc-slide__meta-cat">{project.category}</span>
              </div>

              {/* Main caption block */}
              <div className="hc-slide__caption-body">
                <span className="hc-slide__location">{project.location}</span>
                <h2 className="hc-slide__title">{project.title}</h2>
                <p className="hc-slide__material">{project.material}</p>
                <p className="hc-slide__desc">{project.description}</p>

                <div className="hc-slide__footer">
                  <span className="hc-slide__year">{project.year}</span>
                  <a href="#contact" className="hc-slide__cta">
                    <span>Explore Project</span>
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
