import HeroSection from './HeroSection';
import KineticGallerySection from './KineticGallerySection';
import PartnerSection from './PartnerSection';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import Footer from './Footer';

interface HomePageProps {
  onWatchFilm?: () => void;
}

/** The homepage with modern Mediterranean architectural hero, about reveal, services stack, catalogue & partners. */
export default function HomePage({ onWatchFilm }: HomePageProps) {
  return (
    <div className="site-wrapper">
      {/* ── Bounded Hero → About Us Reveal Stage ────────────────────────── */}
      {/* Hero sticky pinning is strictly confined within this wrapper only. */}
      {/* Once About Us glides up and completes, the hero scrolls away completely. */}
      <div className="hero-about-stage">
        <HeroSection onWatchFilm={onWatchFilm} />
        <AboutSection />
      </div>

      {/* ── Section 2: Our Services (Veymont-Inspired Fanned Card Stack) ─────── */}
      <ServicesSection />

      {/* ── Section 3: Architectural Catalogue (Horizontal Carousel) ────────── */}
      <KineticGallerySection />

      {/* ── Section 4: Selected Partners (Monod-Inspired Normal Scroll) ───────── */}
      <PartnerSection />

      {/* ── Architectural Studio Flagship Footer ─────────────────────────── */}
      <Footer />
    </div>
  );
}
