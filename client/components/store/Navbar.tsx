// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { siteData } from "@/data/siteData";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { CatDogIcon } from "@/components/ui/CatDogIcon";

/*
  Navbar con dos estados:
  - transparente (solo en Home, cuando scrollY === 0): texto blanco sobre hero
  - sólido (siempre en otras páginas + al hacer scroll en Home): bg blanco, texto oscuro

  Prop `heroMode`: el Home lo pone en true, las demás páginas en false.
  Se controla desde cada page o desde el layout pasando la prop.
*/

export function Navbar({ heroMode = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const closeTimer = useRef(null);

  const location = usePathname();
  const { totalItems } = useCart();
  const { store, categories } = useStore();
  const searchParams = useSearchParams();
  const currentCat = searchParams?.get("cat") || null;

  const handleProductsEnter = () => {
    clearTimeout(closeTimer.current);
    setDesktopProductsOpen(true);
  };
  const handleProductsLeave = () => {
    closeTimer.current = setTimeout(() => setDesktopProductsOpen(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => location === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = siteData.navbar.items.filter((i) => i.href !== "/carrito");

  /* Colores según estado */
  const bgStyle = {
    backgroundColor: "var(--color-card)",
    borderBottom: "1px solid var(--color-border)",
  };

  return (
    <>
      {/* ── BARRA PRINCIPAL ── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
            : "border-b border-[var(--color-border)]"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              {store?.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.business_name || ""}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                  <CatDogIcon className="w-6 h-6 text-[var(--color-secondary)]" />
                </div>
              )}
              {!siteData.navbar.logoOnly && (
                <span className="text-xl font-bold text-[var(--color-text-primary)] hidden sm:block">
                  {store?.business_name || ""}
                </span>
              )}
            </Link>

            {/* Links desktop — centrados */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isProducts = item.href === "/productos";
                const hasCategories = isProducts && categories.length > 0;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={
                      hasCategories ? handleProductsEnter : undefined
                    }
                    onMouseLeave={
                      hasCategories ? handleProductsLeave : undefined
                    }
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 relative px-4 py-2 text-sm font-medium rounded-lg transition-colors group ${
                        isActive(item.href)
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)]"
                      }`}
                    >
                      {item.label}
                      {hasCategories && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${desktopProductsOpen ? "rotate-180" : ""}`}
                        />
                      )}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[var(--color-secondary)] transition-all duration-200 ${
                          isActive(item.href) ? "w-6" : "w-0 group-hover:w-4"
                        }`}
                      />
                    </Link>
                    {hasCategories && (
                      <div
                        className="absolute top-full left-0 mt-1"
                        style={{
                          opacity: desktopProductsOpen ? 1 : 0,
                          transform: desktopProductsOpen
                            ? "translateY(0)"
                            : "translateY(-6px)",
                          pointerEvents: desktopProductsOpen ? "auto" : "none",
                          transition: "opacity 0.15s ease, transform 0.15s ease",
                        }}
                      >
                        <div
                          className="w-44 py-2 rounded-xl"
                          style={{
                            backgroundColor: "var(--color-card)",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                          }}
                        >
                          <Link
                            href="/productos"
                            className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-background)] ${
                              !currentCat
                                ? "text-[var(--color-primary)] font-semibold"
                                : "text-[var(--color-text-secondary)]"
                            }`}
                          >
                            Todos los productos
                          </Link>
                          {categories.map((cat) => {
                            const isCurrentCat =
                              currentCat === cat.slug ||
                              currentCat === cat.name;
                            return (
                              <Link
                                key={cat.id}
                                href={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                                className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-background)] ${
                                  isCurrentCat
                                    ? "text-[var(--color-primary)] font-semibold"
                                    : "text-[var(--color-text-secondary)]"
                                }`}
                              >
                                {cat.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Derecha: carrito + hamburger */}
            <div className="flex items-center gap-2">
              {/* Carrito */}
              <Link
                href="/carrito"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl
                     bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]
                     transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:block">
                  Carrito
                </span>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                         bg-[var(--color-secondary)] text-[var(--color-text-primary)]
                         text-xs font-bold flex items-center justify-center"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger — solo mobile */}
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── SIDEBAR MÓVIL ── */}

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Panel lateral */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden bg-white
             flex flex-col transition-transform duration-300 ease-in-out
             shadow-[-8px_0_32px_rgba(0,0,0,0.12)] ${
               isOpen ? "translate-x-0" : "translate-x-full"
             }`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <CatDogIcon className="w-4 h-4 text-[var(--color-secondary)]" />
            </div>
            <span className="font-bold text-[var(--color-text-primary)] text-sm">
              {store?.business_name || ""}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-background)] transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navLinks.map((item) => {
              const isProducts = item.href === "/productos";
              const hasSubitems = isProducts && categories.length > 0;

              if (hasSubitems) {
                return (
                  <li key={item.href}>
                    <button
                      onClick={() =>
                        setMobileProductsOpen(!mobileProductsOpen)
                      }
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-[var(--color-secondary)]/20 text-[var(--color-text-primary)] font-semibold"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            isActive(item.href)
                              ? "bg-[var(--color-secondary)]"
                              : "bg-[var(--color-border)]"
                          }`}
                        />
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileProductsOpen && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        <Link
                          href="/productos"
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            !currentCat && isActive(item.href)
                              ? "text-[var(--color-primary)] font-semibold"
                              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                          }`}
                        >
                          Todos los productos
                        </Link>
                        {categories.map((cat) => {
                          const isCurrentCat =
                            currentCat === cat.slug ||
                            currentCat === cat.name;
                          return (
                            <Link
                              key={cat.id}
                              href={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                                isCurrentCat
                                  ? "text-[var(--color-primary)] font-semibold"
                                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]"
                              }`}
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-[var(--color-secondary)]/20 text-[var(--color-text-primary)] font-semibold"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                        isActive(item.href)
                          ? "bg-[var(--color-secondary)]"
                          : "bg-[var(--color-border)]"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA carrito abajo */}
        <div className="px-4 pb-8 pt-4 border-t border-[var(--color-border)]">
          <Link
            href="/carrito"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                 bg-[var(--color-primary)] text-white font-semibold text-sm
                 hover:bg-[var(--color-primary-hover)] transition-colors relative"
          >
            <ShoppingCart className="w-4 h-4" />
            Ver carrito
            {totalItems > 0 && (
              <span
                className="absolute -top-2 right-3 w-5 h-5 rounded-full
                     bg-[var(--color-secondary)] text-[var(--color-text-primary)]
                     text-xs font-bold flex items-center justify-center"
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
