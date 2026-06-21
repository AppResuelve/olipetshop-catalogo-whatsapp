import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { content, siteData } from '../../data/siteData'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../../utils/formatPrice'
import { useCart } from '../context/CartContext'
import { CartItem } from '../CartItem'
import { CheckoutModal, DeliveryFormModal } from '../CheckoutModal'
import { ordersService } from '../../services/storeService'

export default function Cart() {
  const { items, totalItems, totalPrice } = useCart()
  const { title, emptyTitle, emptyMessage, browseProducts, itemCount, subtotal, total, requestQuote } = content.cart
  const { store, loading } = useStore()
  console.log('[CART PAGE] loading:', loading, 'items.length:', items.length, 'totalItems:', totalItems)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)

  const generateWhatsAppMessage = (deliveryData = null) => {
    const itemsList = items
      .map((item) => `• ${item.quantity}x ${item.name} — ${formatPrice(item.unitPrice)} c/u`)
      .join('\n')

    let deliverySection = ''
    if (deliveryData) {
      deliverySection = `\n\n📦 *Datos de envío:*\n👤 Nombre: ${deliveryData.name}\n📍 Dirección: ${deliveryData.address}`
    }

    const message = `👋🏼 Hola, quiero hacer este pedido:

📋 *Productos:*
${itemsList}

💰 *${total}:* $${totalPrice.toLocaleString('es-AR')}${deliverySection}`

    return encodeURIComponent(message)
  }

  const openWhatsApp = (message) => {
    const whatsappLink = `https://wa.me/${(store?.whatsapp_number || '').replace(/\D/g, '')}?text=${message}`
    window.open(whatsappLink, '_blank')
  }

  const trackOrder = (deliveryData = null) => {
    const order = {
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.unitPrice,
        qty: i.quantity,
      })),
      total: totalPrice,
      customerName: deliveryData?.name || null,
      customerPhone: deliveryData?.phone || null,
      customerEmail: deliveryData?.email || null,
      customerAddress: deliveryData?.address || null,
    }
    ordersService.create(order).catch(() => {})
  }

  const handlePickup = () => {
    const message = generateWhatsAppMessage()
    openWhatsApp(message)
    trackOrder()
    setShowDeliveryModal(false)
  }

  const handleDeliveryFormSubmit = (name, address) => {
    const message = generateWhatsAppMessage({ name, address })
    openWhatsApp(message)
    trackOrder({ name, address })
    setShowDeliveryForm(false)
    setShowDeliveryModal(false)
  }

  const handleRequestQuote = () => {
    if (siteData.cart.showDeliveryModal) {
      setShowDeliveryModal(true)
    } else {
      const message = generateWhatsAppMessage()
      openWhatsApp(message)
      trackOrder()
    }
  }

  if (loading) {
    return (
      <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[var(--color-card)] flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ShoppingCart className="w-12 h-12 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-secondary)]">Cargando catálogo...</p>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[var(--color-card)] flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-[var(--color-text-muted)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              {emptyTitle}
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
              {emptyMessage}
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold hover:-translate-y-0.5 transition-all"
            >
              {browseProducts}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ir a productos
          </Link>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {title}
            </h1>
            <span className="text-[var(--color-text-secondary)]">
              {itemCount.replace('{count}', totalItems)}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--color-text-secondary)]">{subtotal}</span>
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    ${totalPrice.toLocaleString('es-AR')}
                  </span>
                </div>

                <button
                  onClick={handleRequestQuote}
                  className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {requestQuote}
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/productos"
                    className="text-[var(--color-primary)] font-medium hover:underline"
                  >
                    {content.cart.continueShopping}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CheckoutModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        onConfirmDelivery={() => {
          setShowDeliveryModal(false)
          setShowDeliveryForm(true)
        }}
        onConfirmPickup={handlePickup}
      />

      <DeliveryFormModal
        isOpen={showDeliveryForm}
        onClose={() => setShowDeliveryForm(false)}
        onBack={() => {
          setShowDeliveryForm(false)
          setShowDeliveryModal(true)
        }}
        onConfirm={handleDeliveryFormSubmit}
      />
    </>
  )
}
