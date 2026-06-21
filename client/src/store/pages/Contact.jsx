import { MapPin, Mail, Clock, MessageCircle } from "lucide-react";
import { content } from "../../data/siteData";
import { useStore } from "../context/StoreContext";
import { ContactForm } from "../ContactForm";
import { SectionHeader } from "../components/ui/SectionHeader";

export default function Contact() {
  const { title, subtitle, infoTitle } = content.contact;
  const { store } = useStore();

  return (
    <>
      <section className="relative pt-10 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full bg-[var(--color-secondary)]/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight leading-[0.95] text-[var(--color-text-primary)] mb-6">
              {title}
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <ContactForm />

            <div>
              <SectionHeader title={infoTitle} className="mb-10" />

              <div className="space-y-6">
                {store?.address && (
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-muted)] mb-1">
                        Dirección
                      </p>
                      <p className="text-[var(--color-text-primary)]">
                        {store?.address}
                      </p>
                    </div>
                  </div>
                )}

                {store?.whatsapp_number && (
                  <a
                    href={`https://wa.me/${(store?.whatsapp_number || '').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-muted)] mb-1">
                        WhatsApp
                      </p>
                      <p className="text-[var(--color-text-primary)]">
                        {store?.whatsapp_number}
                      </p>
                    </div>
                  </a>
                )}

                {store?.email && (
                  <a
                    href={`mailto:${store?.email}`}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-muted)] mb-1">
                        Email
                      </p>
                      <p className="text-[var(--color-text-primary)]">
                        {store?.email}
                      </p>
                    </div>
                  </a>
                )}

                {(() => {
                  const schedules = Array.isArray(store?.business_hours) ? store.business_hours : []
                  if (schedules.length === 0) return null

                  const DAY_NAMES = { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' }
                  const DAY_ORDER = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 }
                  const formatted = schedules.map((block) => {
                    if (!block.days || block.days.length === 0 || !block.timeRanges?.length) return null
                    const sorted = [...block.days].sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b])
                    const daysLabel = sorted.length > 2
                      ? `${DAY_NAMES[sorted[0]].slice(0, 3)} a ${DAY_NAMES[sorted[sorted.length - 1]].slice(0, 3)}`
                      : sorted.map((d) => DAY_NAMES[d]).join(' y ')
                    const timesLabel = block.timeRanges.map((r) => `${r.open} a ${r.close}`).join(' / ')
                    return { days: daysLabel, times: timesLabel }
                  }).filter(Boolean)

                  return (
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--color-text-muted)] mb-2">Horarios</p>
                        <ul className="space-y-1.5 text-sm text-[var(--color-text-primary)]">
                          {formatted.map((s, i) => (
                            <li key={i} className="flex flex-col gap-0.5">
                              <span className="font-semibold">{s.days}</span>
                              <span className="text-xs opacity-70 bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-md w-fit">{s.times}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {store?.address && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-[var(--color-border)]">
                  <iframe
                    title={`Mapa de ${store?.address}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(store?.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
