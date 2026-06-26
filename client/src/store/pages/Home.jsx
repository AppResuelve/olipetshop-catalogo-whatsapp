import { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { content } from "../../data/siteData";
import { useStore } from "../context/StoreContext";
import { ProductCarousel } from "../components/shared/ProductCarousel";
import { HeroSection } from "../components/shared/HeroSection";
import { PawIcon } from "../components/ui/PawIcon";
import { IconDivider } from "../components/ui/IconDivider";

/* ── Imagen con animación al hacer scroll (una sola vez) ────────────────── */
function SlideUpImage({
  src,
  position = "left",
  bottom = "bottom-0",
  delay = 0,
  wave = false,
  className = "",
  style: extraStyle = {},
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fromLeft = position === "left";

  const imgStyle = {
    transform: visible
      ? "translate(0, 0)"
      : fromLeft
        ? "translate(-100%, 0)"
        : "translate(100%, 0)",
    opacity: visible ? 1 : 0,
    transition: `transform 0.7s ease-out ${delay}ms, opacity 0.7s ease-out ${delay}ms`,
    ...(wave && visible
      ? {
          animation: `wave 1.5s ease-out ${delay + 700}ms infinite`,
          transformOrigin: "left center",
        }
      : {}),
  };

  return (
    <div
      ref={ref}
      className={`absolute ${bottom} ${fromLeft ? "left-0" : "right-0"} pointer-events-none ${className}`}
      style={extraStyle}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="block h-auto"
        style={imgStyle}
      />
    </div>
  );
}

/* ── Onda SVG: vive DENTRO de la sección en el borde inferior ─────────── */
function BottomWave({ fromColor, toColor, flip = false }) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      style={{ backgroundColor: fromColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: 72, display: "block" }}
      >
        <path
          d={
            flip
              ? "M0,32 C240,0 480,64 720,32 C960,0 1200,64 1440,32 L1440,72 L0,72 Z"
              : "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          }
          fill={toColor}
        />
      </svg>
    </div>
  );
}

/* ── CategoryCard ──────────────────────────────────────────────────────── */
function CategoryCard({ category }) {
  return (
    <Link
      to={`/productos?cat=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-transparent
        bg-white hover:border-[var(--color-primary)] transition-all duration-300
        hover:shadow-[0_8px_30px_rgba(199,4,4,0.12)] hover:-translate-y-1 overflow-hidden"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center
        bg-[var(--color-secondary)] group-hover:scale-110 transition-transform duration-300"
      >
        <ShoppingBag className="w-6 h-6 text-[var(--color-text-primary)]" />
      </div>
      <span className="font-semibold text-[var(--color-text-primary)] text-center leading-tight">
        {category.name}
      </span>

      {/* Iconos decorativos al fondo — recortados por overflow-hidden */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <IconDivider size="sm" />
      </div>
    </Link>
  );
}

/* ── HOME ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const {
    hero,
    featuredTitle,
    featuredSubtitle,
    categoriesTitle,
    categoriesSubtitle,
    cta,
  } = content.home;
  const { categories = [], productsMap } = useStore();

  const featuredProducts = useMemo(() =>
    Object.values(productsMap)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  , [productsMap]);

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO — fondo propio de HeroSection
          Onda al fondo que transiciona a #ffffff
      ══════════════════════════════════════════════ */}
      <div className="relative">
        <HeroSection
          backgroundImage="/hero/heropc.png"
          mobileBackgroundImage="/hero/heromobile.png"
          overlayColor="#000000"
          overlayOpacity={0}
          height="min-h-[70vh]"
          textAlign="center"
          ctaText={hero.primaryButtonText}
          ctaLink={hero.primaryButtonLink}
          secondaryCtaText={hero.secondaryButtonText}
          secondaryCtaLink={hero.secondaryButtonLink}
        />
      </div>

      {/* ══════════════════════════════════════════════
          PRODUCTOS DESTACADOS
          bg blanco. Onda al fondo transiciona a amarillo.
      ══════════════════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 bg-white"
        style={{ paddingTop: "3rem", paddingBottom: "7rem" }}
      >
        {/* Imágenes superpuestas — entran desde la izq con delay + wave */}
        <SlideUpImage
          src="/gif/mano1.png"
          position="left"
          bottom="top-0"
          wave
          className="w-48 md:w-72"
          style={{ left: "-12px" }}
        />
        <SlideUpImage
          src="/gif/mano2.png"
          position="left"
          bottom="bottom-0"
          delay={300}
          wave
          className="w-48 md:w-72"
          style={{ left: "-12px" }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
              Lo más buscado
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-3">
              {featuredTitle}
            </h2>
            {featuredSubtitle && (
              <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
                {featuredSubtitle}
              </p>
            )}
            <div className="flex items-center justify-center mt-4 gap-2">
              <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
              <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
            </div>
          </div>

          <ProductCarousel products={featuredProducts} />

          <div className="text-center mt-10">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:gap-3 transition-all duration-200"
            >
              Ver todos los productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Onda inferior: blanco → amarillo */}
        <BottomWave fromColor="#ffffff" toColor="#fefce8" />
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORÍAS
          bg amarillo suave. Onda al fondo transiciona a rojo.
      ══════════════════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "4rem",
          paddingBottom: "8rem",
        }}
      >
        {/* Imagen animada — sube desde abajo-der al hacer scroll */}
        <SlideUpImage
          src="/gif/perrocortandoseelpelo.png"
          position="right"
          bottom="bottom-12"
          className="w-48 md:w-72"
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
              Explorá por categoría
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-3">
              {categoriesTitle}
            </h2>
            {categoriesSubtitle && (
              <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
                {categoriesSubtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Onda inferior: amarillo → rojo */}
        <BottomWave fromColor="#fefce8" toColor="#c70404" flip />
      </section>

      {/* ── PawIcon encima del divider ── */}
      <div
        className="relative z-10 pointer-events-none"
        style={{ marginTop: "-72px", height: 0 }}
      >
        <PawIcon
          size={192}
          className="absolute left-0 text-[var(--color-secondary)] -rotate-12"
        />
      </div>

      {/* ══════════════════════════════════════════════
          CTA FINAL
          bg rojo. Sin onda de salida — el footer tiene la suya.
      ══════════════════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 bg-[var(--color-primary)]"
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="max-w-2xl mx-auto text-center relative z-20">
          <div className="flex justify-center mb-6">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-secondary)] ring-4 ring-[var(--color-secondary)]/30" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {cta.title}
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            {cta.subtitle}
          </p>
          <Link
            to={cta.buttonLink}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
              bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold
              hover:bg-[var(--color-secondary-muted)] hover:-translate-y-0.5
              transition-all duration-200 shadow-lg shadow-black/20"
          >
            {cta.buttonText}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
