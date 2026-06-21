import { Link } from "react-router-dom";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { siteData } from "../../../data/siteData";
import { useStore } from "../../context/StoreContext";
import { PawIcon } from "../ui/PawIcon";
import { CatDogIcon } from "../ui/CatDogIcon";

/* ── Onda de entrada roja → oscuro ── */
function FooterWave() {
  return (
    <div
      className="w-full overflow-hidden leading-none bg-[var(--color-primary)]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 64"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full h-16"
      >
        <path
          d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,20 1440,32 L1440,64 L0,64 Z"
          fill="#1a1a1a"
        />
      </svg>
    </div>
  );
}

/* ── Íconos de redes ── */
const socialIcons = {
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  tiktok: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
  youtube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 11.75a29.94 29.94 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29.94 29.94 0 0 0 .46-5.25 29.94 29.94 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
};

export function Footer() {
  const { store, categories } = useStore();
  const currentYear = new Date().getFullYear();
  const whatsappNumber = (store?.whatsapp_number || "").replace(/\D/g, "");

  /* Horarios formateados */
  const DAY_NAMES = {
    mon: "Lunes",
    tue: "Martes",
    wed: "Miércoles",
    thu: "Jueves",
    fri: "Viernes",
    sat: "Sábado",
    sun: "Domingo",
  };
  const DAY_ORDER = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
  const schedules = Array.isArray(store?.business_hours)
    ? store.business_hours
    : [];
  const formattedSchedules = schedules
    .map((block) => {
      if (!block.days?.length || !block.timeRanges?.length) return null;
      const sorted = [...block.days].sort(
        (a, b) => DAY_ORDER[a] - DAY_ORDER[b],
      );
      const daysLabel =
        sorted.length > 2
          ? `${DAY_NAMES[sorted[0]].slice(0, 3)} a ${DAY_NAMES[sorted[sorted.length - 1]].slice(0, 3)}`
          : sorted.map((d) => DAY_NAMES[d]).join(" y ");
      const timesLabel = block.timeRanges
        .map((r) => `${r.open} - ${r.close}`)
        .join(" / ");
      return { days: daysLabel, times: timesLabel };
    })
    .filter(Boolean);

  const hasSocials =
    store?.instagram || store?.facebook || store?.tiktok || store?.youtube;

  return (
    <>
      {/* Onda transición: rojo CTA → oscuro footer */}
      <FooterWave />

      <footer className="bg-[#1a1a1a] text-white relative overflow-hidden">
        {/* Patas decorativas de fondo */}
        <PawIcon
          className="absolute top-8 right-12 w-48 h-48 text-white pointer-events-none rotate-45"
          style={{ opacity: 0.03 }}
        />
        <PawIcon
          className="absolute bottom-16 left-4 w-32 h-32 text-[var(--color-secondary)] pointer-events-none -rotate-[20deg]"
          style={{ opacity: 0.05 }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* ── Col 1: Logo + descripción ── */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                {store?.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.business_name || ""}
                    className="h-16 w-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <CatDogIcon className="w-7 h-7 text-[var(--color-secondary)]" />
                  </div>
                )}
                {!siteData.navbar.logoOnly && (
                  <span className="text-lg font-bold text-white">
                    {store?.business_name || ""}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                {store?.description || ""}
              </p>
            </div>

            {/* ── Col 2-3: Columnas de navegación desde siteData ── */}
            {siteData.footer.columns.map((column, index) => (
              <div key={index}>
                <FooterColTitle>{column.title}</FooterColTitle>
                <ul className="space-y-2.5">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ── Col 4: Categorías desde API ── */}
            <div>
              <FooterColTitle>Categorías</FooterColTitle>
              {categories.length > 0 ? (
                <ul className="space-y-2.5">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/productos?cat=${encodeURIComponent(cat.name)}`}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/30">Cargando...</p>
              )}
            </div>

            {/* ── Col 5: Contacto + Horarios + Redes ── */}
            <div className="space-y-8">
              {/* Contacto */}
              <div>
                <FooterColTitle>Contacto</FooterColTitle>
                <ul className="space-y-3">
                  {whatsappNumber && (
                    <li>
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-secondary)] group-hover:text-[#1a1a1a] transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </span>
                        WhatsApp
                      </a>
                    </li>
                  )}
                  {store?.address && (
                    <li className="flex items-start gap-3 text-sm text-white/50">
                      <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                      <span className="leading-snug">{store.address}</span>
                    </li>
                  )}
                  {store?.email && (
                    <li>
                      <a
                        href={`mailto:${store.email}`}
                        className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-secondary)] group-hover:text-[#1a1a1a] transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                        {store.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Horarios */}
              {formattedSchedules.length > 0 && (
                <div>
                  <FooterColTitle>Horarios</FooterColTitle>
                  <ul className="space-y-2">
                    {formattedSchedules.map((s, i) => (
                      <li key={i}>
                        <span className="text-xs font-semibold text-white/70 block">
                          {s.days}
                        </span>
                        <span className="text-xs text-[var(--color-secondary)]/80">
                          {s.times}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Redes */}
              {hasSocials && (
                <div>
                  <FooterColTitle>Seguinos</FooterColTitle>
                  <div className="flex gap-2 flex-wrap">
                    {["instagram", "facebook", "tiktok", "youtube"].map(
                      (net) =>
                        store?.[net] ? (
                          <a
                            key={net}
                            href={store[net]}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={net}
                            className="w-9 h-9 rounded-xl flex items-center justify-center
                            bg-white/8 text-white/60
                            hover:bg-[var(--color-secondary)] hover:text-[#1a1a1a]
                            transition-all duration-200 hover:-translate-y-0.5"
                          >
                            {socialIcons[net]}
                          </a>
                        ) : null,
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Copyright ── */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-3">
            <PawIcon
              className="w-4 h-4 text-[var(--color-secondary)]"
              style={{ opacity: 0.6 }}
            />
            <p className="text-xs text-white/30 text-center">
              © {currentYear} {store?.business_name || ""}. Todos los derechos
              reservados.
            </p>
            <PawIcon
              className="w-4 h-4 text-[var(--color-secondary)]"
              style={{ opacity: 0.6 }}
            />
          </div>
        </div>
      </footer>
    </>
  );
}

/* ── Pequeño helper para títulos de columna ── */
function FooterColTitle({ children }) {
  return (
    <h4 className="text-xs font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-4">
      {children}
    </h4>
  );
}
