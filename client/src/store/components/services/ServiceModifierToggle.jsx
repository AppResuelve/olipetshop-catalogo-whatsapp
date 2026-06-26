import { Check } from 'lucide-react'
import { formatPrice } from '../../../utils/formatPrice'

export function ServiceModifierToggle({ modifier, isSelected, onToggle, disabled }) {
  const priceNum = Number(modifier.price)
  const hasPrice = priceNum > 0

  return (
    <button
      onClick={() => !disabled && onToggle(modifier)}
      disabled={disabled}
      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 text-left w-full ${
        isSelected
          ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/10'
          : 'border-[var(--color-border)] bg-white hover:border-[var(--color-secondary)]/50'
      } ${disabled && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]'
              : 'border-[var(--color-border)]'
          }`}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-[var(--color-text-primary)]" />
          )}
        </span>
        <span className="font-medium text-sm text-[var(--color-text-primary)]">
          {modifier.name}
        </span>
      </div>
      {hasPrice && (
        <span className="text-sm font-semibold text-[var(--color-primary)]">
          +{formatPrice(modifier.price)}
        </span>
      )}
    </button>
  )
}
