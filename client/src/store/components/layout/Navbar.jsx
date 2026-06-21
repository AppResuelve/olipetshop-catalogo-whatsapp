import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { siteData } from "../../../data/siteData";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";
import { CatDogIcon } from "../ui/CatDogIcon";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { store } = useStore();
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path) => location.pathname === path;

  /* Sombra al scrollear */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cerrar sidebar al cambiar de ruta */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  /* Bloquear scroll del body cuando sidebar abierto */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = siteData.navbar.items.filter(
    (item) => item.href !== "/carrito",
  );

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
            <Link to="/" className="flex items-center gap-3 shrink-0">
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
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors group ${
                    isActive(item.href)
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background)]"
                  }`}
                >
                  {item.label}
                  {/* Subrayado amarillo activo */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[var(--color-secondary)] transition-all duration-200 ${
                      isActive(item.href) ? "w-6" : "w-0 group-hover:w-4"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Derecha: carrito + hamburger */}
            <div className="flex items-center gap-2">
              {/* Carrito */}
              <Link
                to="/carrito"
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
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-[var(--color-primary)]/8 text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {/* Dot activo */}
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
            ))}
          </ul>
        </nav>

        {/* CTA carrito abajo */}
        <div className="px-4 pb-8 pt-4 border-t border-[var(--color-border)]">
          <Link
            to="/carrito"
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
