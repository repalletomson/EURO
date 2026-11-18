'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceItem {
  id: string;
  number: string;
  category: string;
  title: string;
  oneLineDesc: string;
  image: string;
  alt: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'interior-painting',
    number: '01',
    category: 'Residential Envelopes',
    title: 'Interior Mineral Envelopes',
    oneLineDesc: 'Ultra-matte breathable mineral coatings that cocoon living spaces in velvety stillness.',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85',
    alt: 'Luxury architectural living room with pristine matte painted walls',
  },
  {
    id: 'exterior-painting',
    number: '02',
    category: 'Monumental Facade Engineering',
    title: 'Exterior Silicate Facades',
    oneLineDesc: 'Breathable potassium silicate systems that fuse molecularly to defy weathering.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
    alt: 'Contemporary luxury villa exterior with clean architectural facade',
  },
  {
    id: 'texture-decorative',
    number: '03',
    category: 'Venetian Heritage',
    title: 'Venetian Marmorino & Calce',
    oneLineDesc: 'Layered Carrara marble dust and slaked lime, burnished by hand to a translucent stone luster.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
    alt: 'Curved architectural interior finished with authentic Venetian marmorino',
  },
  {
    id: 'travertino-romano',
    number: '04',
    category: 'Monolithic Stone',
    title: 'Travertino Romano & Honed Rock',
    oneLineDesc: 'Continuous textured stone walls capturing the cavernous gravity of ancient Roman monuments.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    alt: 'Living pavilion with monolithic Roman travertine walls',
  },
  {
    id: 'wood-metal',
    number: '05',
    category: 'Metallurgy & Specialized Millwork',
    title: 'Liquid Bronze & Specialized Joinery',
    oneLineDesc: 'Cold-cast liquid bronze, oxidized copper, and burnished brass finishes on bespoke joinery.',
    image:
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1400&q=85',
    alt: 'Bespoke architectural cabinetry finished in satin bronze lacquer',
  },
  {
    id: 'surface-prep',
    number: '06',
    category: 'Structural Foundation',
    title: 'Substrate Alchemy & Restoration',
    oneLineDesc: 'Level 5 planar micro-mesh reinforcement and structural substrate healing ensuring zero movement.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85',
    alt: 'Architectural construction site with pristine skim-coated substrate',
  },
];

// Fanned card deck geometry matching Veymont (media_1794973467696_042942a2.jpg)
// Optimized for wider, expansive cards with natural rotation offsets and progressive vertical peeking
const CARD_CONFIGS = [
  { yOffset: 0, rot: -1.6, xOffset: -3 },
  { yOffset: 8, rot: 1.8, xOffset: 4 },
  { yOffset: 16, rot: -1.9, xOffset: -4 },
  { yOffset: 24, rot: 1.6, xOffset: 3 },
  { yOffset: 32, rot: -1.7, xOffset: -2 },
  { yOffset: 40, rot: 1.4, xOffset: 2 },
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dimmerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastActiveRef = useRef(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const cards = cardRefs.current.filter((c): c is HTMLElement => c !== null);
    if (cards.length === 0) return;

    const dimmers = dimmerRefs.current.filter((d): d is HTMLDivElement => d !== null);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        cards.forEach((card, idx) => {
          const cfg = CARD_CONFIGS[idx] || { yOffset: 0, rot: 0, xOffset: 0 };
          gsap.set(card, {
            y: cfg.yOffset,
            rotate: cfg.rot,
            x: cfg.xOffset,
            opacity: 1,
          });
        });
        return;
      }

      // Initialize base Card 0 in position with slight organic angle
      gsap.set(cards[0], {
        y: CARD_CONFIGS[0].yOffset,
        rotate: CARD_CONFIGS[0].rot,
        x: CARD_CONFIGS[0].xOffset,
        opacity: 1,
        scale: 1,
        transformOrigin: '50% 50%',
      });

      // Initialize Cards 1 through 5 completely offscreen below viewport
      cards.slice(1).forEach((card, idx) => {
        const sign = idx % 2 === 0 ? 1 : -1;
        gsap.set(card, {
          y: '115vh',
          rotate: sign * 6,
          x: sign * 14,
          opacity: 0,
          scale: 0.97,
          transformOrigin: '50% 50%',
        });
      });

      // Initialize dimmers at 0 opacity
      dimmers.forEach((dimmer) => {
        gsap.set(dimmer, { opacity: 0 });
      });

      // Master Timeline with deliberate Pacing:
      // Pins the services section cleanly for 2500px of scroll travel,
      // stacking cards 01 through 06 with zero dead space or sticky conflicts
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=2500',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            let currentIdx = 0;
            if (progress >= 0.82) currentIdx = 5;
            else if (progress >= 0.65) currentIdx = 4;
            else if (progress >= 0.48) currentIdx = 3;
            else if (progress >= 0.32) currentIdx = 2;
            else if (progress >= 0.16) currentIdx = 1;
            else currentIdx = 0;

            if (currentIdx !== lastActiveRef.current) {
              lastActiveRef.current = currentIdx;
              setActiveCardIndex(currentIdx);
            }
          },
        },
      });

      // Initial dwell pause on Card 0
      masterTl.to({}, { duration: 0.5 });

      // Animate Cards 1 through 5 with generous travel and dwell plateaus
      const travelDuration = 1.35;
      const dwellDuration = 0.65;

      for (let i = 1; i < cards.length; i++) {
        const card = cards[i];
        const cfg = CARD_CONFIGS[i];
        const startTime = 0.5 + (i - 1) * (travelDuration + dwellDuration);

        // 1. Smooth Fade-in early in travel to eliminate popping
        masterTl.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: travelDuration * 0.35,
            ease: 'power1.out',
          },
          startTime,
        );

        // 2. Smooth physical glide into the fanned stack
        masterTl.to(
          card,
          {
            y: cfg.yOffset,
            rotate: cfg.rot,
            x: cfg.xOffset,
            scale: 1,
            ease: 'power1.inOut',
            duration: travelDuration,
          },
          startTime,
        );

        // 3. Subtle GPU-accelerated depth shading on cards underneath
        if (dimmers[i - 1]) {
          masterTl.to(
            dimmers[i - 1],
            {
              opacity: 0.08,
              ease: 'power1.inOut',
              duration: travelDuration * 0.7,
            },
            startTime + travelDuration * 0.3,
          );
        }

        // 4. Very subtle physical compression on previous card as new card lands
        if (cards[i - 1]) {
          masterTl.to(
            cards[i - 1],
            {
              scale: 0.988,
              ease: 'power1.inOut',
              duration: travelDuration * 0.6,
            },
            startTime + travelDuration * 0.4,
          );
        }

        // 5. Dwell period where card rests stationary and user can view it comfortably
        masterTl.to({}, { duration: dwellDuration }, startTime + travelDuration);
      }

      // 6. Generous exit buffer: allows user to calmly view the final stacked deck before unpinning
      masterTl.to({}, { duration: 0.85 });
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 450);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="services-deck"
      id="services"
      aria-label="Professional Painting & Finishing Disciplines"
    >
      {/* ── Pinned Stage (Locked in viewport during scroll) ────────────────── */}
      <div ref={stageRef} className="services-deck__stage">
        {/* Dark Architectural Forest Green Backdrop with Image & Color Overlay */}
        <div className="services-deck__backdrop" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
            alt=""
            className="services-deck__backdrop-img"
          />
          <div className="services-deck__backdrop-tint" />
          <div className="services-deck__backdrop-vignette" />
          <div className="services-deck__backdrop-noise" />
        </div>

        {/* ── Section Header (Editorial Style, Matching Veymont) ───────────── */}
        <header className="services-deck__header">
          <div className="services-deck__header-top">
            <span className="services-deck__tag">(Curated Disciplines)</span>
            <span className="services-deck__header-divider" aria-hidden="true" />
            <span className="services-deck__tag-desc">Six Expressions of Surface Architecture</span>
            <div className="services-deck__progress-dots" aria-hidden="true">
              {SERVICES.map((_, idx) => (
                <span
                  key={idx}
                  className={`services-deck__dot ${
                    idx === activeCardIndex ? 'services-deck__dot--active' : ''
                  }`}
                />
              ))}
            </div>
            <span className="services-deck__counter">
              0{activeCardIndex + 1} / 0{SERVICES.length}
            </span>
          </div>

          <h2 className="services-deck__heading">
            The Architecture of <span className="text-bronze-shimmer italic font-normal">Continuous Surfaces</span>.
          </h2>
        </header>

        {/* ── The Physical Fanned Card Deck (Wide Editorial Landscape) ───────── */}
        <div className="services-deck__pile" role="region" aria-label="Interactive Card Stack">
          {SERVICES.map((service, index) => {
            const isTopCard = index === activeCardIndex;

            return (
              <article
                key={service.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`services-deck__card ${
                  isTopCard ? 'services-deck__card--top' : ''
                }`}
                style={{ zIndex: index + 1 }}
                aria-current={isTopCard ? 'true' : 'false'}
              >
                {/* Hardware-accelerated dimmer overlay for realistic depth */}
                <div
                  ref={(el) => {
                    dimmerRefs.current[index] = el;
                  }}
                  className="services-deck__card-dimmer"
                  aria-hidden="true"
                />

                {/* Card Top: Number + Category */}
                <div className="services-deck__card-header">
                  <span className="services-deck__card-num">({service.number})</span>
                  <span className="services-deck__card-cat">{service.category}</span>
                </div>

                {/* Service Title */}
                <h3 className="services-deck__card-title">{service.title}</h3>

                {/* High Resolution Architectural Image (Expansive Wide View) */}
                <div className="services-deck__card-img-wrap">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="services-deck__card-img"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Clean One-Line Description */}
                <p className="services-deck__card-desc">{service.oneLineDesc}</p>

                {/* Minimal CTA Footer */}
                <div className="services-deck__card-footer">
                  <a href="#contact" className="services-deck__card-cta">
                    <span>Explore {service.title}</span>
                    <svg
                      className="services-deck__cta-arrow"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
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
              </article>
            );
          })}
        </div>

        {/* Minimal Bottom Prompt */}
        <div className="services-deck__scroll-hint" aria-hidden="true">
          <span className="services-deck__hint-line" />
          <span className="services-deck__hint-text">Scroll to stack disciplines</span>
        </div>
      </div>
    </section>
  );
}
