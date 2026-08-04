// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Tag } from "lucide-react";
import { PawIcon } from "@/components/ui/PawIcon";
import { BottomWave } from "@/components/ui/BottomWave";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { content, siteData } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/store/CartItem";
import { ordersService } from "@/services/storeService";
import { CheckoutModal, DeliveryFormModal } from "@/components/store/CheckoutModal";

/* ── Estado vacío ─────────────────────────────────────────────────────── */
function CartEmpty({ emptyTitle, emptyMessage, browseProducts }) {
  return (
    <>
      {/* Hero mínimo en amarillo */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "3.5rem",
          paddingBottom: "5rem",
        }}
      >
        <PawIcon
          size={128}
          className="absolute top-4 right-[8%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
            Carrito
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-2">
            {emptyTitle}
          </h1>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
            <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>
        <BottomWave toColor="#ffffff" />
      </section>

      {/* Cuerpo vacío */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          {/* Ilustración */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="w-28 h-28 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center">
              <ShoppingCart
                className="w-12 h-12 text-[var(--color-primary)]"
                style={{ opacity: 0.5 }}
              />
            </div>
            <PawIcon
              size={40}
              className="absolute -bottom-2 -right-2 text-[var(--color-secondary)]"
              style={{ opacity: 0.7 }}
            />
          </div>

          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            {emptyMessage}
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center justify-center gap-2
              px-8 py-3.5 rounded-xl
              bg-[var(--color-primary)] text-white font-semibold text-sm
              hover:bg-[var(--color-primary-hover)]
              hover:-translate-y-0.5
              hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)]
              transition-all duration-200"
          >
            {browseProducts}
          </Link>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CART PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Cart() {
  const { items, totalItems, totalPrice } = useCart();
  const {
    title, emptyTitle, emptyMessage, browseProducts,
    itemCount, subtotal, total, requestQuote,
  } = content.cart;
  const { store, loading } = useStore();
  const router = useRouter();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  const productItems = items.filter((i) => i.type !== "service");
  const serviceItems = items.filter((i) => i.type === "service");

  const generateWhatsAppMessage = (deliveryData = null) => {
    let lines = [];

    if (productItems.length > 0) {
      const productsList = productItems
        .map((item) => `• ${item.quantity}x ${item.name} — ${formatPrice(item.unitPrice)} c/u`)
        .join("\n");
      lines.push(`📋 *Productos:*\n${productsList}`);
    }

    if (serviceItems.length > 0) {
      const servicesList = serviceItems
        .map((item) => {
          const mods = item.selectedModifiers || [];
          const modsText = mods.length > 0 ? ` (${mods.map((m) => m.name).join(", ")})` : "";
          return `• ${item.quantity}x ${item.serviceName} — ${item.variantName}${modsText} — ${formatPrice(item.unitPrice)} c/u`;
        })
        .join("\n");
      lines.push(`🐾 *Servicios:*\n${servicesList}`);
    }

    let deliverySection = "";
    if (deliveryData) {
      deliverySection = `\n\n📦 *Datos de envío:*\n👤 Nombre: ${deliveryData.name}\n📍 Dirección: ${deliveryData.address}`;
    }

    const message = `👋🏼 Hola, quiero hacer este pedido:\n\n${lines.join("\n\n")}\n\n💰 *${total}:* $${totalPrice.toLocaleString("es-AR")}${deliverySection}`;
    return encodeURIComponent(message);
  };

  const openWhatsApp = (message) => {
    const whatsappLink = `https://wa.me/${(store?.whatsapp_number || "").replace(/\D/g, "")}?text=${message}`;
    window.open(whatsappLink, "_blank");
  };

  const trackOrder = (deliveryData = null) => {
    const order = {
      items: items.map((i) => {
        if (i.type === "service") {
          return {
            type: "service",
            serviceId: i.serviceId,
            name: `${i.serviceName} — ${i.variantName}`,
            modifiers: (i.selectedModifiers || []).map((m) => m.name),
            price: i.unitPrice,
            qty: i.quantity,
          };
        }
        return {
          type: "product",
          productId: i.productId,
          name: i.name,
          price: i.unitPrice,
          qty: i.quantity,
        };
      }),
      total: totalPrice,
      customerName: deliveryData?.name || null,
      customerAddress: deliveryData?.address || null,
    };
    ordersService.create(order).catch(() => {});
  };

  const handlePickup = () => {
    const message = generateWhatsAppMessage();
    openWhatsApp(message);
    trackOrder();
    setShowDeliveryModal(false);
  };

  const handleDeliveryFormSubmit = (name, address) => {
    const message = generateWhatsAppMessage({ name, address });
    openWhatsApp(message);
    trackOrder({ name, address });
    setShowDeliveryForm(false);
    setShowDeliveryModal(false);
  };

  const handleRequestQuote = () => {
    if (siteData.cart.showDeliveryModal) {
      setShowDeliveryModal(true);
    } else {
      const message = generateWhatsAppMessage();
      openWhatsApp(message);
      trackOrder();
    }
  };

  if (loading) {
    return (
      <section className="bg-white min-h-[60vh] flex items-center justify-center px-4 py-24">
        <div className="text-center">
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center animate-pulse">
              <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Cargando...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0)
    return (
      <CartEmpty
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        browseProducts={browseProducts}
      />
    );

  return (
    <>
      {/* ══ HERO — amarillo suave con onda roja ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "3rem",
          paddingBottom: "5rem",
        }}
      >
        <PawIcon
          size={128}
          className="absolute top-3 right-[7%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />
        <PawIcon
          size={80}
          className="absolute -bottom-2 left-[3%] text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.3, transform: "rotate(-12deg)" }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => {
              if (document.referrer && document.referrer.startsWith(window.location.origin)) router.back()
              else router.push('/productos')
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Volver a productos
          </button>

          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-2">
                Carrito
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
                {title}
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
                <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
              </div>
            </div>
            {/* Badge de cantidad */}
            <div
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full
              bg-white border border-[var(--color-border)] shadow-sm mb-1"
            >
              <ShoppingCart className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {itemCount.replace("{count}", totalItems)}
              </span>
            </div>
          </div>
        </div>

        <BottomWave toColor="#ffffff" />
      </section>

      {/* ══ CONTENIDO PRINCIPAL ══ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Lista de items ── */}
            <div className="lg:col-span-2 space-y-6">
              {productItems.length > 0 && (
                <>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-muted)]">
                    Productos
                  </h3>
                  <div className="border-t border-[var(--color-border)]" />
                  {productItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </>
              )}

              {serviceItems.length > 0 && (
                <>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-muted)]">
                    Servicios
                  </h3>
                  <div className="border-t border-[var(--color-border)]" />
                  {serviceItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </>
              )}
            </div>

            {/* ── Resumen del pedido — sticky ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {/* Header del resumen */}
                <div className="px-6 py-4 bg-[#fefce8] border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-primary)]">
                      Resumen
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {subtotal}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="border-t border-[var(--color-border)] my-4" />

                  {/* Total destacado */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {total}
                    </span>
                    <span className="text-2xl font-black text-[var(--color-primary)]">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Botón principal — amarillo (acción de compra = acción especial) */}
                  <button
                    onClick={handleRequestQuote}
                    className="flex items-center justify-center gap-2 w-full
                      px-6 py-3.5 rounded-xl font-bold text-sm
                      bg-[var(--color-secondary)] text-[var(--color-text-primary)]
                      hover:bg-[var(--color-secondary-muted)]
                      hover:-translate-y-0.5
                      hover:shadow-[0_6px_20px_rgba(239,242,58,0.4)]
                      active:translate-y-0 active:shadow-none
                      transition-all duration-200"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    {requestQuote}
                  </button>

                  {/* Link secundario */}
                  <div className="mt-4 text-center">
                    <Link
                      href="/productos"
                      className="text-xs font-semibold text-[var(--color-text-muted)]
                        hover:text-[var(--color-primary)] transition-colors underline-offset-2
                        hover:underline"
                    >
                      {content.cart.continueShopping}
                    </Link>
                  </div>
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
          setShowDeliveryModal(false);
          setShowDeliveryForm(true);
        }}
        onConfirmPickup={handlePickup}
      />
      <DeliveryFormModal
        isOpen={showDeliveryForm}
        onClose={() => setShowDeliveryForm(false)}
        onBack={() => {
          setShowDeliveryForm(false);
          setShowDeliveryModal(true);
        }}
        onConfirm={handleDeliveryFormSubmit}
      />
    </>
  );
}
