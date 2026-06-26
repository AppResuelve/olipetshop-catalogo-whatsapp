import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QuantitySelector } from './QuantitySelector'
import { useCart } from './context/CartContext'
import { formatPrice } from '../utils/formatPrice'

function ServiceCartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  const mods = item.selectedModifiers || []
  const modsText = mods.map(m => m.name).join(', ')

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="shrink-0 w-24 h-24 rounded-xl bg-[var(--color-secondary)]/20 flex items-center justify-center">
        <span className="text-2xl">🐾</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            to={`/servicio/${item.serviceSlug}`}
            className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {item.serviceName}
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          {item.variantName}
        </p>

        {modsText && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {modsText}
          </p>
        )}

        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {formatPrice(item.unitPrice)} c/u
        </p>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          />

          <span className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

function ProductCartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  const hasWholesale = item.wholesalePrice && item.unitsToWholesalePrice
  const usesWholesale = hasWholesale && item.quantity >= item.unitsToWholesalePrice

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <Link to={`/producto/${item.slug}`} className="shrink-0">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            to={`/producto/${item.slug}`}
            className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {formatPrice(item.unitPrice)} c/u
          {usesWholesale && (
            <span className="ml-2 text-[var(--color-primary)] font-medium">(mayorista)</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          />

          <span className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function CartItem({ item }) {
  if (item.type === 'service') {
    return <ServiceCartItem item={item} />
  }
  return <ProductCartItem item={item} />
}
