import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/store/ProductCard'

export function ProductCarousel({ products, className = '' }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll, products])

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector(':scope > *')?.offsetWidth || 300
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <div className={`relative group/carousel ${className}`}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.ps-track::-webkit-scrollbar { display: none; }`}</style>
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
