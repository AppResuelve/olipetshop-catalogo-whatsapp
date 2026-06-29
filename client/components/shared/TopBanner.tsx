'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function TopBanner({
  text = 'Bienvenido a nuestra tienda',
  subtext = '',
  backgroundColor = 'var(--color-primary)',
  textColor = '#ffffff',
  link = '',
  linkText = '',
  icon = '',
  dismissible = false,
  storageKey = 'top-banner-dismissed',
  className = '',
}: {
  text?: string
  subtext?: string
  backgroundColor?: string
  textColor?: string
  link?: string
  linkText?: string
  icon?: string
  dismissible?: boolean
  storageKey?: string
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (dismissible) {
      const dismissed = localStorage.getItem(storageKey)
      if (dismissed) { setIsDismissed(true); return }
    }
    setIsVisible(true)
  }, [dismissible, storageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    if (dismissible) localStorage.setItem(storageKey, 'true')
    setTimeout(() => setIsDismissed(true), 300)
  }

  if (isDismissed) return null

  return (
    <div
      className={`w-full transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${className}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 md:py-3 relative">
          <div className="flex items-center gap-2 md:gap-3 text-center">
            {icon && <span className="text-lg">{icon}</span>}
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <span className="text-sm md:text-base font-semibold">{text}</span>
              {subtext && <span className="text-xs md:text-sm opacity-90">{subtext}</span>}
            </div>
          </div>
          {dismissible && (
            <button onClick={handleDismiss} className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Cerrar">
              <X className="w-4 h-4" style={{ color: textColor }} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
