import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import { formatPrice } from '../../../utils/formatPrice'

export function ServiceCard({ service }) {
  const variants = service.variants || []
  const minPrice = variants.length > 0
    ? Math.min(...variants.map(v => Number(v.price)))
    : Number(service.price) || 0

  const hasDuration = variants.some(v => v.duration_minutes)

  return (
    <Link
      to={`/servicio/${service.slug}`}
      className="group relative flex flex-col rounded-2xl border-2 border-transparent
        bg-white hover:border-[var(--color-primary)] transition-all duration-300
        hover:shadow-[0_8px_30px_rgba(199,4,4,0.12)] hover:-translate-y-1 overflow-hidden"
    >
      {service.images && service.images[0] && (
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
          {service.name}
        </h3>

        {service.description && (
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4 flex-1">
            {service.description}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-xl font-black text-[var(--color-primary)]">
              {formatPrice(minPrice)}
            </span>
            {variants.length > 1 && (
              <span className="text-xs text-[var(--color-text-muted)] ml-1">
                desde
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasDuration && (
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <Clock className="w-3 h-3" />
                {Math.min(...variants.filter(v => v.duration_minutes).map(v => v.duration_minutes))} min
              </span>
            )}
            <span className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]
              group-hover:gap-2 transition-all duration-200">
              Ver
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
