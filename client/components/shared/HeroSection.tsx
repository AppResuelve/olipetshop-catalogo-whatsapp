'use client'

import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection({
  badge = "",
  title = "",
  highlightedText = "",
  subtitle = "",
  backgroundImage = "/hero/heropc.png",
  mobileBackgroundImage = "/hero/heromobile.png",
  overlayColor = "#000000",
  overlayOpacity = 0,
  height = "min-h-[70vh]",
  textAlign = "center" as "center" | "left",
  ctaText = "",
  ctaLink = "/",
  secondaryCtaText = "",
  secondaryCtaLink = "/",
}: {
  badge?: string
  title?: string
  highlightedText?: string
  subtitle?: string
  backgroundImage?: string
  mobileBackgroundImage?: string
  overlayColor?: string
  overlayOpacity?: number
  height?: string
  textAlign?: "center" | "left"
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}) {
  return (
    <section className={`relative flex items-center ${height} overflow-hidden`}>
      {/* Imagen de fondo — desktop */}
      <div className="absolute inset-0 hidden md:block">
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>
      {/* Imagen de fondo — mobile */}
      <div className="absolute inset-0 md:hidden">
        <img src={mobileBackgroundImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />

      {/* Texto — solo si hay contenido */}
      {(badge || title || subtitle) && (
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-3xl ${textAlign === "center" ? "mx-auto text-center" : "text-left"}`}>
            {badge && (
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-secondary)] mb-4 bg-[var(--color-primary)]/80 px-3 py-1 rounded-full">
                {badge}
              </span>
            )}
            {title && (
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white mb-5">
                {title}{" "}
                {highlightedText && (
                  <span className="text-[var(--color-secondary)]">{highlightedText}</span>
                )}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Botones — siempre abajo */}
      {(ctaText || secondaryCtaText) && (
        <div className="absolute bottom-8 md:bottom-16 left-0 right-0 px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaText && (
                <Link href={ctaLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
                    bg-[var(--color-primary)] text-white font-semibold
                    hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)]
                    transition-all">
                  {ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              {secondaryCtaText && (
                <Link href={secondaryCtaLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
                    bg-[var(--color-secondary-50)] text-[var(--color-text-primary)] font-semibold
                    hover:bg-[rgba(239,242,58,0.7)] transition-all">
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
