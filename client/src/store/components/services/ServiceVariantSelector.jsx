import { Clock } from 'lucide-react'
import { formatPrice } from '../../../utils/formatPrice'

export function ServiceVariantSelector({ variants, selectedVariantId, onSelect }) {
  if (!variants || variants.length === 0) return null

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        Elegí una opción:
      </p>
      <div className="flex flex-col gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id
          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-[0_2px_12px_rgba(199,4,4,0.1)]'
                  : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-background)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                <div>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {variant.name}
                  </span>
                  {variant.duration_minutes && (
                    <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mt-0.5">
                      <Clock className="w-3 h-3" />
                      {variant.duration_minutes} min
                    </span>
                  )}
                </div>
              </div>
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {formatPrice(variant.price)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
