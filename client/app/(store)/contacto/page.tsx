"use client";

import { MapPin, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { PawIcon } from "@/components/ui/PawIcon";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { ContactForm } from "@/components/ContactForm";
import { BottomWave } from "@/components/ui/BottomWave";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

function InfoCard({
  icon: Icon,
  label,
  children,
  as: Tag = "div",
  href = undefined,
  onClick = undefined,
}) {
  const base = `
    flex items-start gap-4 p-5 rounded-2xl bg-white
    border border-[var(--color-border)]
    hover:border-[var(--color-primary)]/30
    hover:shadow-[0_4px_20px_rgba(203,110,228,0.08)]
    transition-all duration-200
  `;
  const content = (
    <>
      <div className="w-11 h-11 rounded-xl bg-[var(--color-secondary)]/40 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-1">
          {label}
        </p>
        <div className="text-[var(--color-text-primary)] text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </>
  );

  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {content}
      </a>
    );
  const Component = Tag as any;
  return <Component className={base}>{content}</Component>;
}

function useFormattedSchedules(store) {
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
  return schedules
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
}

/* ══════════════════════════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Contact() {
  const { title, subtitle, infoTitle } = content.contact;
  const { store } = useStore();
  const schedules = useFormattedSchedules(store);
  const whatsappNumber = (store?.whatsapp_number || "").replace(/\D/g, "");

  return (
    <>
      {/* ══ HERO — fondo amarillo suave con onda roja de salida ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "4rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Patas decorativas de fondo */}
        <PawIcon
          size={160}
          className="absolute top-6 right-[8%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.07 }}
        />
        <PawIcon
          size={112}
          className="absolute -bottom-4 left-[4%] text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.4, transform: "rotate(-15deg)" }}
        />
        <PawIcon
          size={80}
          className="absolute top-1/2 left-[45%] text-[var(--color-primary)] hidden lg:block"
          style={{ opacity: 0.04, transform: "rotate(10deg) translateY(-50%)" }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Eyebrow */}
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-4">
            Contacto
          </span>

          <h1
            className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05]
             text-[var(--color-text-primary)] mb-5 max-w-2xl"
          >
            {title}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
            {subtitle}
          </p>

          {/* Línea decorativa del sistema */}
          <div className="flex items-center mt-6 gap-2">
            <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
            <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>

        {/* Onda de salida amarillo → blanco */}
        <BottomWave toColor="#ffffff" />
      </section>

      {/* ══ GRID: FORMULARIO + INFO ══ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
            {/* ── Columna izquierda: Formulario ── */}
            <div>
              {/* Header de sección */}
              <div className="mb-8">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-2">
                  Escribinos
                </span>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                  Envianos tu mensaje
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-1 w-10 rounded-full bg-[var(--color-secondary)]" />
                  <div className="h-1 w-3 rounded-full bg-[var(--color-primary)]" />
                </div>
              </div>

              {/* ContactForm vive acá — sin wrapper extra, el form ya tiene su card */}
              <ContactForm />
            </div>

            {/* ── Columna derecha: Info de contacto ── */}
            <div>
              <div className="mb-8">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-2">
                  Encontranos
                </span>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {infoTitle}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-1 w-10 rounded-full bg-[var(--color-secondary)]" />
                  <div className="h-1 w-3 rounded-full bg-[var(--color-primary)]" />
                </div>
              </div>

              <div className="space-y-3">
                {store?.address && (
                  <InfoCard icon={MapPin} label="Dirección">
                    {store.address}
                  </InfoCard>
                )}

                {store?.whatsapp_number && (
                  <InfoCard
                    icon={MessageCircle}
                    label="WhatsApp"
                    href={`https://wa.me/${whatsappNumber}`}
                  >
                    <span className="font-medium">{store.whatsapp_number}</span>
                    <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                      Respondemos a la brevedad
                    </span>
                  </InfoCard>
                )}

                {store?.email && (
                  <InfoCard
                    icon={Mail}
                    label="Email"
                    href={`mailto:${store.email}`}
                  >
                    {store.email}
                  </InfoCard>
                )}

                {schedules.length > 0 && (
                  <InfoCard icon={Clock} label="Horarios">
                    <ul className="space-y-2 mt-0.5">
                      {schedules.map((s, i) => (
                        <li key={i} className="flex flex-col gap-0.5">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            {s.days}
                          </span>
                          <span
                            className="text-xs font-medium
                             bg-[var(--color-secondary)]/30 text-[var(--color-text-primary)]
                             px-2 py-0.5 rounded-md inline-block w-fit"
                          >
                            {s.times}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </InfoCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAPA — full width con borde y onda de entrada ══ */}
      {store?.address && (
        <section className="relative bg-white px-4 sm:px-6 lg:px-8 pb-0">
          <div className="max-w-7xl mx-auto">
            <div
              className="rounded-3xl overflow-hidden border border-[var(--color-border)]
               shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
            >
              <iframe
                title={`Mapa de ${store.address}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="360"
                style={{ border: 0, display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA WHATSAPP — cierre oscuro consistente con footer ══ */}
      {whatsappNumber && (
        <>
          {/* Onda blanco → oscuro */}
          <div
            className="bg-white overflow-hidden leading-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1440 64"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ height: 64, display: "block", width: "100%" }}
            >
              <path
                d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,20 1440,32 L1440,64 L0,64 Z"
                fill="#1a1a1a"
              />
            </svg>
          </div>

          <section className="bg-[#1a1a1a] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-14">
            {/* Patas watermark */}
            <PawIcon
              size={160}
              className="absolute right-8 top-4 text-white pointer-events-none hidden md:block"
              style={{ opacity: 0.04 }}
            />
            <PawIcon
              size={112}
              className="absolute left-4 bottom-2 text-[var(--color-secondary)] pointer-events-none hidden md:block"
              style={{ opacity: 0.07 }}
            />

            <div className="max-w-xl mx-auto text-center relative">
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase
                 text-[var(--color-secondary)] mb-4"
              >
                Respuesta rápida
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                ¿Preferís hablar por WhatsApp?
              </h2>
              <p className="text-white/60 text-sm mb-8">
                Escribinos directo y te respondemos al instante.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5
                   px-8 py-4 rounded-xl font-bold text-sm
                   bg-[var(--color-secondary)] text-[var(--color-text-primary)]
                   hover:bg-[var(--color-secondary-muted)]
                   hover:-translate-y-0.5
                   hover:shadow-[0_6px_20px_rgba(239,242,58,0.3)]
                   transition-all duration-200"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                Escribinos por WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </>
      )}
    </>
  );
}
