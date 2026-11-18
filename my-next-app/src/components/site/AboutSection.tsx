'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Pillar {
  id: string;
  tag: string;
  badge: string;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    id: '01',
    tag: 'Calce Naturale',
    badge: 'Aged 24 Months',
    title: 'Venetian Marmorino',
    description:
      'Slaked lime and crushed Carrara marble hand-burnished into monolithic, breathable surfaces that deepen with natural patina.',
  },
  {
    id: '02',
    tag: 'Superfici Continue',
    badge: 'Zero Grout Joints',
    title: 'Monolithic Micro-Cement',
    description:
      'Seamless floor-to-ceiling transitions engineered with Italian polymers for high-traffic galleries, wet rooms, and modern villas.',
  },
  {
    id: '03',
    tag: 'Metalli Liquidi',
    badge: '95% Pure Bronze',
    title: 'Liquid Bronze & Brass',
    description:
      'Cold-cast pulverized European metals sculpted over architectural doors, bespoke joinery, and monumental statement portals.',
  },
  {
    id: '04',
    tag: 'Livello 5',
    badge: 'Crack-Proof Matrix',
    title: 'Substrate Engineering',
    description:
      'Breathable potassium silicate foundations and carbon-fiber mesh that guarantee flawless surface longevity for decades.',
  },
];

const ARCH_BADGES = [
  '100% Bio-Calce Naturale',
  'Class A1 Fire-Rated',
  'Zero VOC Formulation',
  'Acoustic Damping',
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const detailImageRef = useRef<HTMLImageElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const badgesContainerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animated statistics counters
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [purity, setPurity] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [activePillar, setActivePillar] = useState<string>('01');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setYears(18);
      setProjects(450);
      setPurity(100);
      setSatisfaction(99);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Text reveal for Header & Manifesto lines
      const headingLines = section.querySelectorAll('.about__anim-line');
      if (headingLines.length > 0) {
        gsap.fromTo(
          headingLines,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroContentRef.current || section,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 2. Badges Stagger Reveal
      if (badgesContainerRef.current) {
        const badges = badgesContainerRef.current.querySelectorAll('.about__pill');
        gsap.fromTo(
          badges,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badgesContainerRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 3. Smooth continuous Parallax on Main Architectural Image
      if (mainImageRef.current) {
        gsap.to(mainImageRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 4. Parallax on Secondary Detail Frame & Floating Badge
      if (detailImageRef.current) {
        gsap.to(detailImageRef.current, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (floatingBadgeRef.current) {
        gsap.to(floatingBadgeRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 5. Pillar Cards Staggered Slide & Fade
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.querySelectorAll('.about__pillar-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 6. Statistics Counter Animation
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const counter = { y: 0, p: 0, pur: 0, s: 0 };
            gsap.to(counter, {
              y: 18,
              p: 450,
              pur: 100,
              s: 99,
              duration: 2.2,
              ease: 'power2.out',
              onUpdate: () => {
                setYears(Math.round(counter.y));
                setProjects(Math.round(counter.p));
                setPurity(Math.round(counter.pur));
                setSatisfaction(Math.round(counter.s));
              },
            });
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="about about-section"
      id="about"
      aria-label="About EUR Finishes"
    >
      <div className="about__inner">
        {/* ── Top Header & Editorial Manifesto ──────────────────────────────── */}
        <div ref={heroContentRef} className="about__header-block">
          <div className="about__eyebrow-wrap">
            <span className="about__tag">(01 / THE ATELIER)</span>
            <span className="about__eyebrow-divider" aria-hidden="true" />
            <span className="about__eyebrow-caption">Verona &bull; Milano &bull; Hyderabad &bull; Est. 2008</span>
          </div>

          <div className="about__title-row">
            <div className="about__title-wrap">
              <h2 className="about__heading">
                <span className="about__heading-line-mask">
                  <span className="about__anim-line">Where Raw Earth Meets</span>
                </span>
                <span className="about__heading-line-mask">
                  <span className="about__anim-line text-olive-shimmer italic font-normal">
                    Monumental Calce.
                  </span>
                </span>
              </h2>
            </div>

            <div className="about__manifesto-wrap">
              <p className="about__manifesto about__anim-line">
                We do not paint walls. We sculpt seamless mineral envelopes. Drawing directly from the slaked lime pits of Veneto and crushed Carrara marble, every surface breathes with natural light and endures with quiet European nobility.
              </p>

              {/* Architectural Certification & Standard Badges */}
              <div ref={badgesContainerRef} className="about__pills-row">
                {ARCH_BADGES.map((badge, idx) => (
                  <span key={idx} className="about__pill">
                    <span className="about__pill-dot" aria-hidden="true" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>

              <div className="about__cta-wrap about__anim-line">
                <a href="#services" className="about__cta-btn">
                  <span>Explore The Disciplines</span>
                  <svg className="about__cta-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Dynamic Visual Composition & Architectural Canvas ──────────────── */}
        <div className="about__canvas-grid">
          {/* Main Showcase Image Frame */}
          <div className="about__canvas-main">
            <div className="about__image-frame">
              <img
                ref={mainImageRef}
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
                alt="Architectural pavilion with Italian slaked lime mineral walls"
                className="about__img-parallax"
                loading="lazy"
              />
              <div className="about__frame-scrim" aria-hidden="true" />

              {/* Architectural Location Coordinates Overlay */}
              <div className="about__coord-tag">
                <span className="about__coord-icon" aria-hidden="true">✦</span>
                <div className="about__coord-text">
                  <strong>Villa Bellagio Pavilion</strong>
                  <span>Honed Marmorino &bull; 45°59&apos;N 9°15&apos;E</span>
                </div>
              </div>

              {/* Lighting Response Badge */}
              <div className="about__light-badge">
                <span className="about__light-dot" aria-hidden="true" />
                <span>Responsive to Grazing Daylight</span>
              </div>
            </div>
          </div>

          {/* Secondary Overlapping Tactile Detail Frame */}
          <div className="about__canvas-aside">
            <div className="about__detail-frame">
              <img
                ref={detailImageRef}
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85"
                alt="Macro texture of hand-troweled Venetian grassello finish"
                className="about__detail-img"
                loading="lazy"
              />
              <div className="about__detail-scrim" aria-hidden="true" />
              <div className="about__detail-caption">
                <span className="about__detail-label">Tactile Micro-Relief</span>
                <span className="about__detail-spec">Carrara Marble Aggregate &bull; Hand-Burnished</span>
              </div>
            </div>

            {/* Floating Atelier Provenance Card */}
            <div ref={floatingBadgeRef} className="about__floating-card">
              <div className="about__floating-header">
                <span className="about__floating-pin" aria-hidden="true">◈</span>
                <span className="about__floating-title">Atelier Heritage</span>
              </div>
              <p className="about__floating-body">
                Formulated according to Vitruvian seven-layer calcestruzzo rules, naturally self-cleaning through continuous ambient carbonation.
              </p>
              <div className="about__floating-footer">
                <span className="about__floating-metric">0% Artificial Polymers</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Architectural Craft Pillars (Interactive 4-Card Grid) ─────────── */}
        <div className="about__pillars-header">
          <div className="about__pillars-eyebrow">
            <span className="about__tag">(Disciplines)</span>
            <span className="about__eyebrow-caption">Core Material Systems</span>
          </div>
          <span className="about__pillars-hint">Hover to inspect finishes</span>
        </div>

        <div ref={cardsContainerRef} className="about__pillars-grid">
          {PILLARS.map((p) => {
            const isActive = activePillar === p.id;
            return (
              <div
                key={p.id}
                className={`about__pillar-card ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActivePillar(p.id)}
                tabIndex={0}
                role="article"
                aria-label={p.title}
              >
                <div className="about__card-top">
                  <span className="about__card-id">{p.id}</span>
                  <span className="about__card-badge">{p.badge}</span>
                </div>

                <div className="about__card-mid">
                  <span className="about__card-tag">{p.tag}</span>
                  <h3 className="about__card-title">{p.title}</h3>
                  <p className="about__card-desc">{p.description}</p>
                </div>

                <div className="about__card-footer">
                  <span className="about__card-line" aria-hidden="true" />
                  <span className="about__card-status">
                    {isActive ? 'Selected Discipline' : 'Inspect Specification'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Architectural Statistics Bar (Redesigned with Metrics) ───────── */}
        <div ref={statsRef} className="about__stats-bar">
          <div className="about__stat-card">
            <div className="about__stat-accent-bar" aria-hidden="true" />
            <span className="about__stat-number">{years}+</span>
            <span className="about__stat-label">Years of Atelier Craft</span>
            <span className="about__stat-sub">European heritage lineage in surface arts</span>
          </div>

          <div className="about__stat-card">
            <div className="about__stat-accent-bar" aria-hidden="true" />
            <span className="about__stat-number">{projects}+</span>
            <span className="about__stat-label">Monumental Envelopes</span>
            <span className="about__stat-sub">From private villas to luxury penthouses</span>
          </div>

          <div className="about__stat-card">
            <div className="about__stat-accent-bar" aria-hidden="true" />
            <span className="about__stat-number">{purity}%</span>
            <span className="about__stat-label">Mineral Formulation</span>
            <span className="about__stat-sub">Authentic slaked lime &amp; zero petrochemicals</span>
          </div>

          <div className="about__stat-card">
            <div className="about__stat-accent-bar" aria-hidden="true" />
            <span className="about__stat-number">{satisfaction}%</span>
            <span className="about__stat-label">Studio Retention</span>
            <span className="about__stat-sub">Direct commission by leading architects</span>
          </div>
        </div>
      </div>
    </section>
  );
}
