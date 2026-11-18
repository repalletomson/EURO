'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animated statistics counters
  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setYears(18);
      setProjects(450);
      setSatisfaction(99);
      return;
    }

    const ctx = gsap.context(() => {
      // Subtle internal image parallax scrub
      if (mainImageRef.current) {
        gsap.to(mainImageRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Statistics counter animation when stats bar enters viewport
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const counter = { y: 0, p: 0, s: 0 };
            gsap.to(counter, {
              y: 18,
              p: 450,
              s: 99,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                setYears(Math.round(counter.y));
                setProjects(Math.round(counter.p));
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
      aria-label="About EURO FINISHES"
    >
      <div className="about__inner">
        {/* Section Eyebrow Header */}
        <div className="about__eyebrow-wrap">
          <span className="about__tag">(The Atelier)</span>
          <span className="about__eyebrow-divider" aria-hidden="true" />
          <span className="about__eyebrow-caption">Raw Mineral Alchemy &bull; Monumental Calce</span>
        </div>

        {/* Section Heading & Introduction (Asymmetric Top Grid) */}
        <div className="about__hero-grid">
          <div className="about__heading-col">
            <h2 className="about__heading">
              Walls That Breathe. <span className="text-bronze-shimmer italic font-normal">Textures That Age With Nobility</span>.
            </h2>
          </div>

          <div className="about__intro-col">
            <p className="about__lead">
              We do not apply paint. We sculpt monolithic mineral envelopes. Drawing directly from the quarries of Verona and the historic slaked lime pits of Veneto, every surface is an unrepeatable dialogue between master artisan, mineral mortar, and moving daylight.
            </p>
            <p className="about__body">
              True luxury in surface architecture is tactile and acoustic. Our hand-troweled marmorino and cocciopesto breathe with the room&apos;s atmosphere, absorb harsh sound reverberation, and deepen in character with every passing decade.
            </p>

            <div className="about__cta-wrap">
              <a href="#services" className="about__cta-btn">
                <span>Discover The Disciplines</span>
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

        {/* Asymmetrical Visual Composition */}
        <div className="about__visual-grid">
          {/* Main Large Architectural Image */}
          <div className="about__main-image-wrap">
            <img
              ref={mainImageRef}
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=85"
              alt="Architectural living pavilion with Italian mineral finish"
              className="about__main-image"
              loading="lazy"
            />
            <div className="about__image-badge">
              <span className="about__badge-dot" aria-hidden="true" />
              <span>Villa Bellagio Pavilion &bull; Honed Marmorino</span>
            </div>
          </div>

          {/* Supporting Asymmetrical Detail & Philosophy Block */}
          <div className="about__side-col">
            <div className="about__sub-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85"
                alt="Close-up hand-troweled mineral plaster texture"
                className="about__sub-image"
                loading="lazy"
              />
              <span className="about__sub-caption">
                Tactile mineral depth &bull; 24-Month aged grassello &amp; crushed Carrara
              </span>
            </div>

            {/* Craftsmanship Pillars */}
            <div className="about__pillars">
              <div className="about__pillar-item">
                <span className="about__pillar-num">01</span>
                <div>
                  <h3 className="about__pillar-title">Accademia Trowel Masters</h3>
                  <p className="about__pillar-desc">
                    Every artisan on our atelier team is rigorously trained in authentic Venetian spatulata troweling, marmorino burnishing, and slaked lime carbonation.
                  </p>
                </div>
              </div>

              <div className="about__pillar-item">
                <span className="about__pillar-num">02</span>
                <div>
                  <h3 className="about__pillar-title">Level 5 Substrate Science</h3>
                  <p className="about__pillar-desc">
                    Over 70% of finish longevity lives in structural preparation: moisture equilibrium, micro-mesh crack bridging, and breathable potassium silicate primers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Statistics Counter Bar */}
        <div ref={statsRef} className="about__stats-bar">
          <div className="about__stat-card">
            <span className="about__stat-number">{years}+</span>
            <span className="about__stat-label">Years of Craftsmanship</span>
            <span className="about__stat-sub">Established European heritage in surface arts</span>
          </div>

          <div className="about__stat-divider" aria-hidden="true" />

          <div className="about__stat-card">
            <span className="about__stat-number">{projects}+</span>
            <span className="about__stat-label">Luxury Projects Completed</span>
            <span className="about__stat-sub">From private villas to 59-storey penthouses</span>
          </div>

          <div className="about__stat-divider" aria-hidden="true" />

          <div className="about__stat-card">
            <span className="about__stat-number">{satisfaction}%</span>
            <span className="about__stat-label">Client Satisfaction</span>
            <span className="about__stat-sub">Measured by lifetime client and architect retention</span>
          </div>
        </div>
      </div>
    </section>
  );
}
