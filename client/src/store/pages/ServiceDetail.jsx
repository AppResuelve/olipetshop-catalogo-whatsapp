import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, MessageCircle, Clock } from 'lucide-react'
import { content } from '../../data/siteData'
import { servicesService } from '../../services/storeService'
import { useCart } from '../context/CartContext'
import { ServiceVariantSelector } from '../components/services/ServiceVariantSelector'
import { ServiceModifierToggle } from '../components/services/ServiceModifierToggle'
import { QuantitySelector } from '../QuantitySelector'
import { formatPrice } from '../../utils/formatPrice'
import { PawIcon } from '../components/ui/PawIcon'

function ServiceLoading() {
  return (
    <div className="max-w-7xl mx-auto py-20 text-center">
      <p className="text-[var(--color-text-secondary)]">Cargando...</p>
    </div>
  )
}

function BottomWave({ toColor }) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: 64, display: 'block', width: '100%' }}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addServiceItem } = useCart()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedModifiers, setSelectedModifiers] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await servicesService.getBySlug(slug)
        setService(data)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  useEffect(() => {
    setSelectedModifiers({})
    setQuantity(1)
  }, [selectedVariant])

  if (loading) return <ServiceLoading />

  if (!service) {
    return (
      <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Servicio no encontrado
          </h1>
          <Link
            to="/servicios"
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Volver a servicios
          </Link>
        </div>
      </section>
    )
  }

  const variants = service.variants || []
  const activeModifiers = selectedVariant?.modifiers || []
  const requiredModifiers = activeModifiers.filter(m => m.is_required)
  const optionalModifiers = activeModifiers.filter(m => !m.is_required)

  const modifiersTotal = Object.values(selectedModifiers)
    .filter(Boolean)
    .reduce((sum, m) => sum + Number(m.price), 0)

  const unitPrice = (selectedVariant ? Number(selectedVariant.price) : 0) + modifiersTotal
  const subtotal = unitPrice * quantity

  const handleToggleModifier = (modifier) => {
    const modKey = String(modifier.id)
    const maxSel = modifier.max_selection || 1

    if (modifier.is_required) {
      setSelectedModifiers(prev => {
        const current = prev[modKey]
        if (current) {
          const { [modKey]: _, ...rest } = prev
          return rest
        }
        if (Object.keys(prev).filter(k => activeModifiers.find(m => String(m.id) === k && m.is_required)).length >= maxSel && maxSel === 1) {
          const clearedRequired = Object.fromEntries(
            Object.entries(prev).filter(([k]) => {
              const mod = activeModifiers.find(m => String(m.id) === k)
              return !mod || !mod.is_required
            })
          )
          return { ...clearedRequired, [modKey]: modifier }
        }
        return { ...prev, [modKey]: modifier }
      })
    } else {
      setSelectedModifiers(prev => {
        const current = prev[modKey]
        if (current) {
          const { [modKey]: _, ...rest } = prev
          return rest
        }
        const optionalCount = Object.keys(prev).filter(k => {
          const mod = activeModifiers.find(m => String(m.id) === k)
          return mod && !mod.is_required
        }).length
        if (maxSel && optionalCount >= maxSel) return prev
        return { ...prev, [modKey]: modifier }
      })
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return

    addServiceItem({
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      variantPrice: Number(selectedVariant.price),
      selectedModifiers: Object.values(selectedModifiers).map(m => ({
        id: m.id,
        name: m.name,
        price: Number(m.price),
      })),
      quantity,
    })

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const handleWhatsApp = () => {
    if (!selectedVariant) return

    const mods = Object.values(selectedModifiers)
    const modsText = mods.length > 0
      ? mods.map(m => `  ✓ ${m.name}`).join('\n')
      : '  Sin modificadores'

    const message = `🐾 *${service.name}*\n\n📋 Variante: *${selectedVariant.name}*\n💰 Precio: ${formatPrice(unitPrice)}\n\n🔧 Modificadores:\n${modsText}\n\n🔢 Cantidad: ${quantity}\n💰 *Total: ${formatPrice(subtotal)}*`

    const store = JSON.parse(localStorage.getItem('store') || '{}')
    const whatsappNumber = store.whatsapp_number || ''
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: '#fefce8',
          paddingTop: '3.5rem',
          paddingBottom: '5rem',
        }}
      >
        <PawIcon
          size={128}
          className="absolute top-3 right-[7%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />

        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {content.serviceDetail.backTo}
          </button>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-3">
            {service.name}
          </h1>

          {service.description && (
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
              {service.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
            <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>

        <BottomWave toColor="#ffffff" />
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-8">
              {service.images && service.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden border border-[var(--color-border)]">
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {service.images && service.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {service.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-[var(--color-border)]">
                      <img src={img} alt="" className="w-full h-20 object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="sticky top-24 space-y-6">
                {variants.length > 0 && (
                  <ServiceVariantSelector
                    variants={variants}
                    selectedVariantId={selectedVariant?.id}
                    onSelect={setSelectedVariant}
                  />
                )}

                {requiredModifiers.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                      {content.serviceDetail.requiredModifiers}:
                    </p>
                    <div className="flex flex-col gap-2">
                      {requiredModifiers.map((mod) => (
                        <ServiceModifierToggle
                          key={mod.id}
                          modifier={mod}
                          isSelected={!!selectedModifiers[String(mod.id)]}
                          onToggle={handleToggleModifier}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {optionalModifiers.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                      {content.serviceDetail.optionalModifiers}:
                    </p>
                    <div className="flex flex-col gap-2">
                      {optionalModifiers.map((mod) => {
                        const modKey = String(mod.id)
                        const currentCount = Object.keys(selectedModifiers).filter(k => {
                          const m = activeModifiers.find(x => String(x.id) === k)
                          return m && !m.is_required
                        }).length
                        const isAtMax = mod.max_selection && currentCount >= mod.max_selection && !selectedModifiers[modKey]
                        return (
                          <ServiceModifierToggle
                            key={mod.id}
                            modifier={mod}
                            isSelected={!!selectedModifiers[modKey]}
                            onToggle={handleToggleModifier}
                            disabled={isAtMax}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedVariant && (
                  <div className="border-t border-[var(--color-border)] pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">Precio unitario</span>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        {formatPrice(unitPrice)}
                      </span>
                    </div>

                    {selectedVariant.duration_minutes && (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <Clock className="w-4 h-4" />
                        {content.serviceDetail.duration}: {selectedVariant.duration_minutes} min
                      </div>
                    )}

                    <QuantitySelector
                      quantity={quantity}
                      onIncrease={() => setQuantity(q => q + 1)}
                      onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                    />

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-[var(--color-text-primary)]">Total</span>
                      <span className="text-2xl font-black text-[var(--color-primary)]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <button
                        onClick={handleAddToCart}
                        className={`flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                          justAdded
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-primary)] text-white hover:opacity-90'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check className="w-5 h-5" />
                            {content.serviceDetail.addedToCart}
                          </>
                        ) : (
                          content.serviceDetail.addToCart
                        )}
                      </button>

                      <button
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-bold text-sm
                          border-2 border-[var(--color-secondary)] text-[var(--color-text-primary)]
                          hover:bg-[var(--color-secondary)]/20 transition-all"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {content.serviceDetail.requestWhatsApp}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
