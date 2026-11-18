'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const brandBlockRef = useRef<HTMLDivElement>(null);
  const dispatchRef = useRef<HTMLDivElement>(null);
  const navGridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Top row: Brand block & Newsletter dispatch entrance
      if (brandBlockRef.current && dispatchRef.current) {
        gsap.fromTo(
          [brandBlockRef.current, dispatchRef.current],
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Middle Nav Columns staggered entrance
      if (navGridRef.current) {
        const cols = navGridRef.current.querySelectorAll('.site-footer__col');
        gsap.fromTo(
          cols,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: navGridRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Bottom bar smooth fade in
      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current,
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bottomRef.current,
              start: 'top 98%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer ref={footerRef} className="site-footer" id="contact" aria-label="Euro Finishes Studio Footer">
      <div className="site-footer__inner">
        {/* ── Top Grid: Brand & Newsletter ───────────────────────────────── */}
        <div className="site-footer__top">
          <div ref={brandBlockRef} className="site-footer__brand-block">
            {/* Wordmark: EUR + Animated Globe "O" */}
            <a href="#hero" className="site-footer__brand" aria-label="EURO Home">
              <span className="site-footer__brand-text">EUR</span>
              <svg
                className="site-footer__globe-o"
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

            <p className="site-footer__tagline">
              Master-crafted Italian surface architecture, mineral lime plasters, and bespoke decorative wall systems. Hand-troweled in Hyderabad for India&apos;s finest residences and cultural flagships.
            </p>

            <div className="site-footer__locations">
              <div className="site-footer__location-pill">
                <span className="site-footer__dot site-footer__dot--live" aria-hidden="true" />
                <span>Flagship Studio — Hyderabad</span>
              </div>
              <div className="site-footer__location-pill">
                <span className="site-footer__dot site-footer__dot--accent site-footer__dot--live" aria-hidden="true" />
                <span>Material Atelier — Milano</span>
              </div>
            </div>
          </div>

          {/* Newsletter / Monograph Dispatch */}
          <div ref={dispatchRef} className="site-footer__dispatch">
            <span className="site-footer__dispatch-tag">Quarterly Monograph</span>
            <h3 className="site-footer__dispatch-title">
              Surface Journal &amp; Material Insights
            </h3>
            <p className="site-footer__dispatch-desc">
              Curated notes on Venetian marmorino chemistry, architectural lighting interplay, and rare lime aggregates delivered quarterly to architects and collectors.
            </p>

            {subscribed ? (
              <div className="site-footer__subscribed" role="status">
                <svg className="w-5 h-5 text-bronze flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Your private subscription has been confirmed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="site-footer__form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@studio.com"
                  required
                  aria-label="Email address for Surface Journal"
                  className="site-footer__input"
                />
                <button type="submit" className="site-footer__submit" aria-label="Subscribe to monograph">
                  <span>Subscribe</span>
                  <svg viewBox="0 0 14 14" fill="none" className="site-footer__submit-icon w-3.5 h-3.5" aria-hidden="true">
                    <path d="M2.5 7h9M8 3.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Middle Nav Columns ─────────────────────────────────────────── */}
        <div ref={navGridRef} className="site-footer__nav-grid">
          {/* Col 1: Disciplines */}
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Disciplines</h4>
            <ul className="site-footer__col-list">
              <li><a href="#services" className="site-footer__link">Interior Mineral Envelopes</a></li>
              <li><a href="#services" className="site-footer__link">Exterior Silicate Facades</a></li>
              <li><a href="#services" className="site-footer__link">Venetian Marmorino &amp; Calce</a></li>
              <li><a href="#services" className="site-footer__link">Travertino Romano Monolithics</a></li>
              <li><a href="#services" className="site-footer__link">Liquid Bronze &amp; Joinery</a></li>
              <li><a href="#services" className="site-footer__link">Substrate Alchemy &amp; Restoration</a></li>
            </ul>
          </div>

          {/* Col 2: Architectural Catalogue */}
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Selected Works</h4>
            <ul className="site-footer__col-list">
              <li><a href="#catalogue" className="site-footer__link">Villa Bellagio — Lake Como</a></li>
              <li><a href="#catalogue" className="site-footer__link">Palazzo Milano — Penthouse</a></li>
              <li><a href="#catalogue" className="site-footer__link">SAS Crown 59-Storey Highrise</a></li>
              <li><a href="#catalogue" className="site-footer__link">Residenza Amalfi — Cliffside</a></li>
              <li><a href="#catalogue" className="site-footer__link">Studio Firenze — Gallery</a></li>
            </ul>
          </div>

          {/* Col 3: Italian Partners */}
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Italian Partners</h4>
            <ul className="site-footer__col-list">
              <li><a href="#partners" className="site-footer__link">Novacolor — Milano</a></li>
              <li><a href="#partners" className="site-footer__link">Radius San Marco — Venezia</a></li>
              <li><a href="#partners" className="site-footer__link">Oikos Ecological — Forlì</a></li>
              <li><a href="#partners" className="site-footer__link">Viero Master Finishes</a></li>
              <li><a href="#partners" className="site-footer__link">Colorificio Veneziano</a></li>
            </ul>
          </div>

          {/* Col 4: Studio Contact */}
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Hyderabad Studio</h4>
            <div className="site-footer__contact-info">
              <p>Road No. 36, Jubilee Hills</p>
              <p>Hyderabad, Telangana 500033</p>
              <p className="site-footer__contact-lead">
                <a href="mailto:inquire@eurofinishers.com" className="site-footer__link site-footer__link--highlight">
                  inquire@eurofinishers.com
                </a>
              </p>
              <p className="site-footer__contact-phone">
                +91 (040) 2355 8900
              </p>
              <p className="site-footer__hours">
                Mon — Sat: 10:00 — 19:00 IST
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Colophon & Legal ───────────────────────────────── */}
        <div ref={bottomRef} className="site-footer__bottom">
          <p className="site-footer__copy">
            &copy; {new Date().getFullYear()} EURO FINISHES PVT. LTD. Handcrafted surface architecture. All rights reserved.
          </p>

          <div className="site-footer__legal-links">
            <a href="#hero" className="site-footer__legal-link">Privacy Policy</a>
            <span className="site-footer__legal-sep" aria-hidden="true">&bull;</span>
            <a href="#hero" className="site-footer__legal-link">Terms of Commission</a>
            <span className="site-footer__legal-sep" aria-hidden="true">&bull;</span>
            <a href="#hero" className="site-footer__legal-link">Artisan Certification</a>
            <span className="site-footer__legal-sep" aria-hidden="true">&bull;</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="site-footer__legal-link site-footer__back-to-top"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <span className="site-footer__back-arrow" aria-hidden="true">&uarr;</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
