'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  onWatchFilm?: () => void;
}

export default function HeroSection({}: HeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    const stageEl = stageRef.current;
    if (!heroEl || !stageEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Receding stage depth as About Us glides up and covers Hero
      gsap.to(stageEl, {
        scale: 0.94,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, heroEl);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero" id="hero">
      {/* ── High-End Architectural Floating Island Header ──────────────────── */}
      <header className="hero-header">
        <nav className="hero-header__island" aria-label="Main Navigation">
          {/* Brand Identity: EUR + Globe "O" */}
          <a href="#hero" className="hero-header__brand" aria-label="EURO Home">
            <span className="hero-header__brand-text">EUR</span>
            <svg
              className="hero-header__globe-o"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="O"
            >
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="12" cy="12" rx="4.8" ry="9.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="2.5" x2="12" y2="21.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.5 7.2h15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M4.5 16.8h15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hero-header__nav-links">
            <a href="#partners" className="hero-header__link">
              <span>Partners</span>
            </a>
            <a href="#about" className="hero-header__link">
              <span>About</span>
            </a>
            <a href="#services" className="hero-header__link">
              <span>Services</span>
            </a>
            <a href="#catalogue" className="hero-header__link">
              <span>Catalogue</span>
            </a>
            <a href="#contact" className="hero-header__link">
              <span>Contact</span>
            </a>
          </div>

          {/* Right Action Block: Live Studio Indicator & Inquire Button */}
          <div className="hero-header__actions">
            <div className="hero-header__status-badge" title="Studio Location">
              <span className="hero-header__status-dot" aria-hidden="true" />
              <span className="hero-header__status-text">Hyderabad</span>
            </div>

            <a href="#contact" className="hero-header__cta-btn">
              <span>Inquire</span>
              <svg
                className="hero-header__cta-arrow"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 7h9M8 3.5l3.5 3.5-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="hero-header__menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span className={`hero-header__menu-line ${menuOpen ? 'is-open-top' : ''}`} />
              <span className={`hero-header__menu-line ${menuOpen ? 'is-open-bottom' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile Floating Dropdown Menu */}
        {menuOpen && (
          <div className="hero-header__mobile-dropdown" role="menu">
            <div className="hero-header__mobile-links">
              <a href="#partners" onClick={() => setMenuOpen(false)}>
                Selected Partners
              </a>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About Us
              </a>
              <a href="#services" onClick={() => setMenuOpen(false)}>
                Our Services
              </a>
              <a href="#catalogue" onClick={() => setMenuOpen(false)}>
                Architectural Catalogue
              </a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact Studio
              </a>
            </div>

            <div className="hero-header__mobile-footer">
              <div className="hero-header__mobile-status">
                <span className="hero-header__status-dot" aria-hidden="true" />
                <span>Studio Open &bull; Jubilee Hills, Hyderabad</span>
              </div>
              <a
                href="#contact"
                className="hero-header__mobile-cta"
                onClick={() => setMenuOpen(false)}
              >
                Inquire &amp; Consultation &rarr;
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Main Stage ────────────────────────────────────────────────── */}
      <div ref={stageRef} className="hero__stage">
        {/* Background Cinematic Video with Architectural Vignette Overlay */}
        <div className="hero__video-container">
          <video
            className="hero__video"
            src="/videos/hero-villa.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="hero__overlay" />
        </div>

        {/* Main Hero Headline & Introduction */}
        <div className="hero__content">
          <div className="hero__eyebrow-wrap">
            <span className="hero__eyebrow-tag">ATELIER D&apos;ARTE</span>
            <span className="hero__eyebrow-divider" aria-hidden="true" />
            <span className="hero__eyebrow-sub">Milano &bull; Hyderabad</span>
          </div>

          <h1 className="hero__title">
            Surfaces Sculpted by <span className="text-bronze-shimmer italic font-normal">Italian Light</span>.
          </h1>

          <p className="hero__desc">
            Where ancient Roman slaked lime meets contemporary monumental architecture. We hand-trowel continuous mineral envelopes, tactile marmorino, and honed travertine that transform daylight into tactile emotion.
          </p>

          <div className="hero__actions">
            <a href="#services" className="hero__cta">
              <span>Explore The Atelier</span>
              <svg
                className="hero__cta-arrow"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4.166 10h11.667m-4.166-4.167 4.166 4.167-4.166 4.167"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a href="#partners" className="hero__cta-secondary">
              <span>The Italian Guilds</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
