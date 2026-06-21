import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, MessageCircle, ArrowRight } from "lucide-react";
import { content } from "../../data/siteData";
import { useStore } from "../context/StoreContext";
import { useProducts } from "../../hooks/useProducts";
import { ProductGrid } from "../ProductGrid";
import { SearchBar } from "../SearchBar";
import { CategoryFilter } from "../CategoryFilter";
import { PawIcon } from "../components/ui/PawIcon";

/* ── Helpers visuales ─────────────────────────────────────────────────── */

function BottomWave({ toColor }) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: 64, display: "block", width: "100%" }}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}

/* ── Skeleton de carga ────────────────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-[var(--color-border)]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[var(--color-border)] rounded-full w-3/4" />
        <div className="h-3 bg-[var(--color-border)] rounded-full w-1/2" />
        <div className="h-4 bg-[var(--color-border)] rounded-full w-1/3 mt-3" />
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Estado vacío ─────────────────────────────────────────────────────── */
function EmptyState({
  searchQuery,
  whatsappNumber,
  onClear,
  noResults,
  clearFilters,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center relative">
      {/* Pata grande de fondo */}
      <PawIcon
        size={128}
        className="text-[var(--color-secondary)] mb-2"
        style={{ opacity: 0.4 }}
      />
      <p className="text-[var(--color-text-secondary)] mb-2 text-sm">
        {noResults}
      </p>
      {searchQuery ? (
        <>
          <p className="text-xs text-[var(--color-text-muted)] mb-6">
            No encontramos resultados para{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">
              "{searchQuery}"
            </span>
          </p>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`🔍 ¡Hola! Me gustaría saber si tienen disponible: ${searchQuery}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-xl font-semibold text-sm
              bg-[var(--color-secondary)] text-[var(--color-text-primary)]
              hover:bg-[var(--color-secondary-muted)]
              hover:-translate-y-0.5
              hover:shadow-[0_6px_20px_rgba(239,242,58,0.35)]
              transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            Preguntar por WhatsApp
          </a>
        </>
      ) : (
        <button
          onClick={onClear}
          className="text-sm text-[var(--color-primary)] font-semibold
            hover:underline underline-offset-2 transition-all"
        >
          {clearFilters}
        </button>
      )}
    </div>
  );
}

/* ── Paginación ───────────────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium
          disabled:opacity-30 hover:border-[var(--color-primary)]/40
          hover:text-[var(--color-primary)] transition-colors"
      >
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
              p === page
                ? "bg-[var(--color-primary)] text-white shadow-[0_4px_12px_rgba(199,4,4,0.3)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]/25 hover:text-[var(--color-text-primary)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium
          disabled:opacity-30 hover:border-[var(--color-primary)]/40
          hover:text-[var(--color-primary)] transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PRODUCTS PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [page, setPage] = useState(1);
  const { store, categories } = useStore();

  const { title, subtitle, noResults, clearFilters } = content.products;

  const categoryId =
    selectedCategory !== "Todos" ? selectedCategory : undefined;
  const { products, total, totalPages, loading } = useProducts({
    search: searchQuery || undefined,
    categoryId,
    page,
    limit: 20,
  });

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      const found = categories.find((c) => c.slug === cat || c.name === cat);
      if (found) setSelectedCategory(String(found.id));
    }
  }, [searchParams, categories]);

  const hasActiveFilters = searchQuery || selectedCategory !== "Todos";

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    if (category === "Todos") {
      setSearchParams({});
    } else {
      const cat = categories.find((c) => String(c.id) === category);
      setSearchParams({ cat: cat ? cat.name : category });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setSearchParams({});
    setPage(1);
  };

  const whatsappNumber = store?.whatsapp_number || "";
  const categoryLabels = ["Todos", ...categories.map((c) => c.name)];

  return (
    <>
      {/* ══ HERO — amarillo suave con onda roja de salida ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "3.5rem",
          paddingBottom: "5.5rem",
        }}
      >
        {/* Patas decorativas */}
        <PawIcon
          size={144}
          className="absolute top-4 right-[7%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />
        <PawIcon
          size={96}
          className="absolute -bottom-2 left-[3%] text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.35, transform: "rotate(-12deg)" }}
        />

        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
            Tienda
          </span>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05]
            text-[var(--color-text-primary)] mb-4 max-w-xl"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 mt-5">
            <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
            <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>

        {/* Onda amarillo → blanco */}
        <BottomWave toColor="#ffffff" />
      </section>

      {/* ══ CONTENIDO PRINCIPAL ══ */}
      <section className="bg-white pb-20 px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de categorías */}
            <CategoryFilter
              categories={categoryLabels}
              selectedCategory={
                selectedCategory === "Todos"
                  ? "Todos"
                  : categories.find((c) => String(c.id) === selectedCategory)
                      ?.name || "Todos"
              }
              onSelectCategory={handleCategoryChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />

            {/* Área principal */}
            <div className="flex-1">
              {/* Barra de búsqueda + filtros mobile — sticky en mobile */}
              <div className="max-md:sticky max-md:top-[calc(4rem+12px)] max-md:z-30 mb-6">
                <div className="flex flex-row gap-3 items-center">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={(v) => {
                        setSearchQuery(v);
                        setPage(1);
                      }}
                      placeholder="Buscar productos..."
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </div>
                  {/* Botón filtros mobile */}
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden shrink-0 h-11 flex items-center gap-2 px-3 py-3 rounded-xl
                      border-2 border-[var(--color-primary)]/30
                      bg-white text-[var(--color-primary)]
                      hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5
                      transition-all duration-200"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {!isSearchFocused && !searchQuery && (
                      <span className="text-sm font-semibold">Filtros</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Contador + limpiar filtros */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {total}
                    </span>{" "}
                    producto{total !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-[var(--color-primary)]
                      hover:bg-[var(--color-primary)]/8 px-3 py-1.5 rounded-lg
                      transition-colors"
                  >
                    {clearFilters}
                  </button>
                </div>
              )}

              {/* Grid de productos / loading / vacío */}
              {loading ? (
                <LoadingGrid />
              ) : products.length > 0 ? (
                <>
                  <ProductGrid products={products} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  whatsappNumber={whatsappNumber}
                  onClear={handleClearFilters}
                  noResults={noResults}
                  clearFilters={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
