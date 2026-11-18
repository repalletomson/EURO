'use client';

import { useEffect, useRef, useState } from 'react';

interface Partner {
  id: string;
  name: string;
  location: string;
  category: string;
  description: string;
  logo: React.ReactNode;
}

const PARTNERS: Partner[] = [
  {
    id: 'novacolor',
    name: 'Novacolor',
    location: 'Milano, Italy',
    category: 'Mineral Silicates & Lime',
    description: 'Pioneers in raw Italian lime plasters, oxidized metallic coatings, and continuous surface textures since 1982.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-2 select-none">
        <svg className="w-10 h-10 text-neutral-900" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
          <path d="M4 6h7.5l8.5 14V6H27v24h-7.5L11 16v14H4V6z" />
          <circle cx="30" cy="8" r="3" fill="#94714D" />
        </svg>
        <span className="text-base font-bold tracking-[0.16em] uppercase font-sans text-neutral-900">
          Novacolor
        </span>
      </div>
    ),
  },
  {
    id: 'san-marco',
    name: 'San Marco Group',
    location: 'Venezia, Italy',
    category: 'Venetian Marmorino & Calce',
    description: 'Venice’s premier decorative coatings manufacturer, crafting authentic lime Marmorino and polished stucco for over 80 years.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-1.5 select-none">
        {/* Lion of Saint Mark stylized architectural emblem */}
        <svg className="w-11 h-9 text-neutral-900" viewBox="0 0 44 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 26c0-6 4-10 10-10h12c6 0 10 4 10 10" />
          <path d="M12 16V8c0-3 2-5 5-5s5 2 5 5v8" />
          <path d="M22 6c3 0 6 2 6 5v5" />
          <line x1="4" y1="28" x2="40" y2="28" strokeWidth="2.2" />
          <circle cx="17" cy="6" r="1.5" fill="currentColor" />
        </svg>
        <span className="text-sm font-semibold tracking-[0.18em] uppercase font-serif text-neutral-900">
          San Marco
        </span>
      </div>
    ),
  },
  {
    id: 'oikos',
    name: 'Oikos Milano',
    location: 'Forlì, Italy',
    category: 'Ecological Decorative Plasters',
    description: 'Solvent-free architectural surfaces produced using natural lime, water, and pulverized marble aggregate since 1984.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-2 select-none">
        {/* Oikos circle emblem */}
        <svg className="w-10 h-10 text-neutral-900" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="18" cy="18" r="3" fill="#94714D" />
        </svg>
        <span className="text-base font-bold tracking-[0.22em] uppercase font-sans text-neutral-900">
          Oikos
        </span>
      </div>
    ),
  },
  {
    id: 'viero',
    name: 'Viero Paints',
    location: 'Toscana, Italy',
    category: 'Tuscan Mineral Stucco',
    description: 'Specialists in thick-coat decorative finishes, travertine stone effects, and hand-burnished aged slaked lime.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-1.5 select-none">
        {/* Viero geometric V monogram */}
        <svg className="w-10 h-9 text-neutral-900" viewBox="0 0 38 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4l15 24L34 4" />
          <path d="M12 4l7 12 7-12" stroke="#94714D" strokeWidth="2" />
        </svg>
        <span className="text-sm font-bold tracking-[0.24em] uppercase font-sans text-neutral-900">
          Viero
        </span>
      </div>
    ),
  },
  {
    id: 'colorificio-veneziano',
    name: 'Colorificio Veneziano',
    location: 'Venezia, Italy',
    category: 'Grassello & Calce Spatolata',
    description: 'Masters of authentic Venetian slaked lime, crushed Carrara marble powders, and transparent protective waxes.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-1.5 select-none text-center">
        {/* Venetian Gondola & Wave Crest */}
        <svg className="w-12 h-9 text-neutral-900" viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 22c8 0 12-8 20-8s12 8 20 8" />
          <path d="M14 18c4-4 8-8 10-8s6 4 10 8" />
          <line x1="24" y1="6" x2="24" y2="24" stroke="#94714D" strokeWidth="2" />
          <circle cx="24" cy="5" r="2" fill="#94714D" />
        </svg>
        <span className="text-xs font-semibold tracking-[0.14em] uppercase font-serif text-neutral-900 leading-tight">
          Colorificio<br />Veneziano
        </span>
      </div>
    ),
  },
  {
    id: 'giorgio-graesan',
    name: 'Giorgio Graesan',
    location: 'Milano, Italy',
    category: 'Pietra Spaccata & Stuhhi',
    description: 'Artisanal Italian mineral stucco and tactile split-stone textures celebrating the timeless beauty of raw mineral rock.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-1.5 select-none text-center">
        {/* Artisan Ammonite/Spiral monogram */}
        <svg className="w-10 h-10 text-neutral-900" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M20 6a14 14 0 1 1-10 24" />
          <path d="M20 12a8 8 0 1 1-6 13" stroke="#94714D" />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" />
        </svg>
        <span className="text-xs font-bold tracking-[0.18em] uppercase font-sans text-neutral-900 leading-tight">
          Giorgio Graesan
        </span>
      </div>
    ),
  },
  {
    id: 'rialto',
    name: 'Rialto Harpo',
    location: 'Trieste, Italy',
    category: 'Architectural Silicate Facades',
    description: 'Engineered potassium silicate coatings and exterior breathable masonry systems for heritage preservation.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-1.5 select-none">
        {/* Rialto Bridge Shield */}
        <svg className="w-11 h-9 text-neutral-900" viewBox="0 0 40 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 26V8a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v18" />
          <path d="M12 26c0-6 4-10 8-10s8 4 8 10" stroke="#94714D" />
          <line x1="4" y1="26" x2="36" y2="26" />
        </svg>
        <span className="text-sm font-bold tracking-[0.22em] uppercase font-sans text-neutral-900">
          Rialto
        </span>
      </div>
    ),
  },
  {
    id: 'armourcoat',
    name: 'Armourcoat',
    location: 'Kent, United Kingdom',
    category: 'Sculptural Plaster & Acoustics',
    description: 'Global benchmark for bespoke seamless polished plasters and sculpted acoustic plaster finishes in monumental spaces.',
    logo: (
      <div className="flex flex-col items-center justify-center gap-1.5 select-none">
        {/* Hexagonal architectural stone emblem */}
        <svg className="w-10 h-10 text-neutral-900" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="18,3 32,10 32,26 18,33 4,26 4,10" />
          <polyline points="18,3 18,18 32,26" stroke="#94714D" />
          <line x1="18" y1="18" x2="4" y2="26" />
        </svg>
        <span className="text-xs font-bold tracking-[0.2em] uppercase font-sans text-neutral-900">
          Armourcoat
        </span>
      </div>
    ),
  },
];

export default function PartnerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      ref={sectionRef}
      className="partner-section"
      id="partners"
      aria-label="Selected Italian Materials & Global Collaborators"
    >
      <div className="partner-section__inner">
        {/* Editorial Section Header */}
        <header className="partner-header">
          <div className="partner-header__left">
            <span className="partner-header__tag">(Provenance)</span>
          </div>

          <div className="partner-header__center">
            <span className="partner-header__dot" aria-hidden="true" />
            <h2 className="partner-header__label">The Italian Material Guilds</h2>
          </div>

          <div className="partner-header__right">
            <span className="partner-header__year">2026</span>
          </div>
        </header>

        {/* 8 Architectural Cards Grid (Clean Monod-Inspired Minimalist Look) */}
        <div className="partner-grid">
          {PARTNERS.map((partner, index) => {
            const isFlipped = !!flippedCards[partner.id];

            return (
              <div
                key={partner.id}
                className={`partner-card ${isVisible ? 'is-revealed' : ''} ${
                  isFlipped ? 'is-flipped' : ''
                }`}
                style={{
                  transitionDelay: `${index * 60}ms`,
                }}
                onClick={() => toggleFlip(partner.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip(partner.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${partner.name} partner card, click to flip for specifications`}
              >
                {/* 3D Rotating Flipper */}
                <div className="partner-card__flipper">
                  {/* Front Face: Minimalist Clean White Card with Black Centered Real Logo */}
                  <div className="partner-card__face partner-card__face--front">
                    <div className="partner-card__logo-wrap">
                      {partner.logo}
                    </div>
                  </div>

                  {/* Back Face: Clean Editorial Details */}
                  <div className="partner-card__face partner-card__face--back">
                    <div className="partner-card__back-content">
                      <div className="partner-card__back-header">
                        <span className="partner-card__back-tag">{partner.category}</span>
                        <span className="partner-card__back-loc">{partner.location}</span>
                      </div>
                      <h3 className="partner-card__back-name">{partner.name}</h3>
                      <p className="partner-card__back-desc">{partner.description}</p>
                      <div className="partner-card__back-footer">
                        <span className="partner-card__back-action">Explore Collection</span>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M4 12L12 4M12 4H6M12 4V10"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
