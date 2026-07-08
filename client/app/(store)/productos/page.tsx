// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, MessageCircle, X, ChevronDown } from "lucide-react";
import { PawIcon } from "@/components/ui/PawIcon";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { useProducts } from "@/hooks/useProducts";
import { tagsService } from "@/services/storeService";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SearchBar } from "@/components/store/SearchBar";
import { TagFilter } from "@/components/store/TagFilter";
import { BottomWave } from "@/components/ui/BottomWave";

/* ── Skeleton ── */
function ProductSkeleton() {
  return (
    <div
      className="overflow-hidden animate-pulse"
      style={{
        borderRadius: "1rem",
        border: "1px solid var(--color-border)",
        backgroundColor: "white",
      }}
    >
      <div
        className="aspect-square"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <div className="p-4 space-y-2">
        <div
          className="h-3 rounded-full w-3/4"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-3 rounded-full w-1/2"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-4 rounded-full w-1/3 mt-3"
          style={{ backgroundColor: "var(--color-border)" }}
        />
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

/* ── Estado vacío ── */
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

/* ── Paginación ── */
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
   PRODUCTS PAGE — OliPetShop
══════════════════════════════════════════════════════════════════════ */
export default function Products() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tags, setTags] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(true);
  const [openTags, setOpenTags] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [page, setPage] = useState(1);
  const initializedFromUrl = useRef(false);
  const { store, categories } = useStore();

  const { title, subtitle, noResults, clearFilters } = content.products;

  const categoryId =
    selectedCategory !== "Todos" ? selectedCategory : undefined;
  const { products, total, totalPages, loading } = useProducts({
    search: searchQuery || undefined,
    categoryId,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds.join(",") : undefined,
    page,
    limit: 20,
  });

  useEffect(() => {
    const params = { ...(categoryId ? { categoryId } : {}) };
    if (selectedTagIds.length > 0) params.tagIds = selectedTagIds.join(",");
    tagsService.list(params).then(setTags).catch(() => setTags([]));
  }, [categoryId, selectedTagIds]);

  // ── URL sync: solo después de hidratar desde URL ──
  useEffect(() => {
    if (!initializedFromUrl.current) return;
    const sp = new URLSearchParams();
    if (selectedCategory !== "Todos") {
      const cat = categories.find((c) => String(c.id) === selectedCategory);
      if (cat) sp.set("cat", cat.name);
    }
    if (selectedTagIds.length > 0) sp.set("tags", selectedTagIds.join(","));
    router.replace(sp.toString() ? `?${sp.toString()}` : window.location.pathname, { scroll: false });
  }, [selectedCategory, selectedTagIds]);

  // ── Read URL params on mount — una sola vez cuando categories cargó ──
  useEffect(() => {
    if (initializedFromUrl.current || categories.length === 0) return;
    const cat = searchParams?.get("cat") || "";
    if (cat) {
      const found = categories.find((c) => c.slug === cat || c.name === cat);
      if (found) setSelectedCategory(String(found.id));
    }
    const tagsParam = searchParams?.get("tags") || "";
    if (tagsParam) {
      setSelectedTagIds(tagsParam.split(",").map(Number).filter(Boolean));
    }
    initializedFromUrl.current = true;
  }, [searchParams, categories]);

  const hasActiveFilters = searchQuery || selectedCategory !== "Todos" || selectedTagIds.length > 0;

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const handleCategoryChange = (category) => {
    setPage(1);
    setSelectedTagIds([]);
    if (category === "Todos") {
      setSelectedCategory("Todos");
    } else {
      const cat = categories.find((c) => c.name === category);
      if (cat) setSelectedCategory(String(cat.id));
    }
  };

  const handleToggleTag = (tagValueId, tagId) => {
    setPage(1);
    const tagGroup = tags.find((t) => t.id === tagId);
    const groupValueIds = tagGroup ? tagGroup.values.map((v) => v.id) : [];
    setSelectedTagIds((prev) => {
      const existingInGroup = prev.find((id) => groupValueIds.includes(id));
      if (existingInGroup === tagValueId) return prev.filter((id) => id !== tagValueId);
      if (existingInGroup) return prev.map((id) => (id === existingInGroup ? tagValueId : id));
      return [...prev, tagValueId];
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setSelectedTagIds([]);
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
            paddingBottom: "3rem",
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
        </div>

        {/* Onda amarillo → blanco */}
        <BottomWave toColor="#ffffff" />
      </section>

      {/* ══ CONTENIDO PRINCIPAL ══ */}
      <section className="bg-white pb-20 px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0">
              {isFilterOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
                  onClick={() => setIsFilterOpen(false)}
                />
              )}

              <aside
                className={`fixed lg:static inset-y-0 left-0 z-[70] lg:z-auto w-72 bg-[var(--color-surface)] lg:bg-transparent border-r lg:border-r-0 border-[var(--color-border)] transform transition-transform duration-300 lg:transform-none ${
                  isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
              >
                <div className="flex flex-col h-full p-6 lg:p-0 overflow-y-auto">
                  {/* Mobile header */}
                  <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Filtrar por
                    </h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories section */}
                  <div className="mb-6">
                    <button
                      onClick={() => setOpenCategories(!openCategories)}
                      className="flex items-center justify-between w-full text-left mb-3"
                    >
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
                        Categorías
                      </h3>
                      <ChevronDown className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${openCategories ? 'rotate-180' : ''}`} />
                    </button>
                    {openCategories && (
                      <div className="space-y-2">
                        {categoryLabels.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              (selectedCategory === "Todos" ? "Todos" : categories.find((c) => String(c.id) === selectedCategory)?.name || "Todos") === category
                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]/10'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tags section */}
                  {tags.length > 0 && (
                    <div>
                      <button
                        onClick={() => setOpenTags(!openTags)}
                        className="flex items-center justify-between w-full text-left mb-3"
                      >
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
                          Filtrar por
                        </h3>
                        <ChevronDown className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${openTags ? 'rotate-180' : ''}`} />
                      </button>
                      {openTags && (
                        <TagFilter
                          tags={tags}
                          selectedTagIds={selectedTagIds}
                          selectionMode="single"
                          onToggleTag={handleToggleTag}
                        />
                      )}
                    </div>
                  )}
                </div>
              </aside>
            </div>

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
                        border-2 border-[var(--color-secondary)]/30
                        bg-white text-[var(--color-text-primary)]
                        hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5
                        transition-all duration-200"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {!isSearchFocused && !searchQuery && (
                      <span className="text-sm font-semibold">Filtros</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile chips */}
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTagIds.map(id => {
                    let label = '';
                    for (const tag of tags) {
                      const found = tag.values.find(v => v.id === id);
                      if (found) { label = `${tag.name}: ${found.value}`; break; }
                    }
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          const tagGroup = tags.find(t => t.values.some(v => v.id === id));
                          if (tagGroup) handleToggleTag(id, tagGroup.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                          bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      >
                        {label}
                        <X className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              )}

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
