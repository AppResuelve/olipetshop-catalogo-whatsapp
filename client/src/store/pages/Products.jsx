import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, MessageCircle } from "lucide-react";
import { content } from "../../data/siteData";
import { useStore } from "../context/StoreContext";
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../ProductGrid'
import { SearchBar } from '../SearchBar'
import { CategoryFilter } from '../CategoryFilter'
import { SectionHeader } from '../components/ui/SectionHeader'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [page, setPage] = useState(1);
  const { store, categories } = useStore();

  const { title, subtitle, noResults, clearFilters } = content.products;

  const categoryId = selectedCategory !== "Todos" ? selectedCategory : undefined
  const { products, total, totalPages, loading } = useProducts({
    search: searchQuery || undefined,
    categoryId,
    page,
    limit: 20,
  })

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) {
      const found = categories.find((c) => c.slug === cat || c.name === cat)
      if (found) setSelectedCategory(String(found.id))
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
      const cat = categories.find((c) => String(c.id) === category)
      setSearchParams({ cat: cat ? cat.name : category });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setSearchParams({});
    setPage(1);
  };

  const whatsappNumber = store?.whatsapp_number || ''

  const categoryLabels = ["Todos", ...categories.map((c) => c.name)]

  return (
    <section className="pt-10 md:pt-20 pb-16 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title={title} subtitle={subtitle} className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          <CategoryFilter
            categories={categoryLabels}
            selectedCategory={
              selectedCategory === "Todos"
                ? "Todos"
                : categories.find((c) => String(c.id) === selectedCategory)?.name || "Todos"
            }
            onSelectCategory={handleCategoryChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div className="flex-1">
            <div className="max-md:sticky max-md:top-[calc(4rem+12px)] max-md:z-30 mb-6">
              <div className="flex flex-row gap-3 items-center">
                <div className="flex-1">
                  <SearchBar
                    value={searchQuery}
                    onChange={(v) => { setSearchQuery(v); setPage(1) }}
                    placeholder="Buscar productos..."
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden shrink-0 h-11 flex items-center gap-2 px-3 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)]"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {!isSearchFocused && !searchQuery && (
                    <span className="text-sm font-medium">Filtros</span>
                  )}
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {total} producto{total !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  {clearFilters}
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-secondary)]">Cargando...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-30"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-[var(--color-text-secondary)] px-3">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm disabled:opacity-30"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-secondary)] mb-6">
                  {noResults}
                </p>
                {searchQuery ? (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`🔍 ¡Hola! Me gustaría saber si tienen disponible el producto: ${searchQuery}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/10 transition-all duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Preguntar en WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={handleClearFilters}
                    className="text-[var(--color-primary)] font-medium hover:underline"
                  >
                    {clearFilters}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
