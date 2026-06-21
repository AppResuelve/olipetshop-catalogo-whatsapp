import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Tag, Check } from 'lucide-react'
import { content } from '../../data/siteData'
import { useProduct, useRelatedProducts } from '../../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { ProductGallery } from '../ProductGallery'
import { Badge } from '../components/ui/Badge'
import { formatPrice } from '../../utils/formatPrice'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem, getItemQuantity } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const { product, loading } = useProduct(slug)
  const categoryId = product?.categoryId
  const { products: relatedProducts } = useRelatedProducts(categoryId, product?.id)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <p className="text-[var(--color-text-secondary)]">Cargando...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Producto no encontrado
          </h1>
          <Link
            to="/productos"
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Volver a productos
          </Link>
        </div>
      </section>
    )
  }

  const related = relatedProducts.filter((p) => String(p.id) !== String(product?.id)).slice(0, 4)

  const handleAddToCart = () => {
    addItem(product.id)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const handleAddWholesale = () => {
    addItem(product.id, product.unitsToWholesalePrice)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const quantity = getItemQuantity(product.id)
  const hasDiscount = product.comparePrice && product.discountPercentage
  const hasWholesale = product.wholesalePrice && product.unitsToWholesalePrice

  return (
    <section className="pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {content.productDetail.backTo}
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          <ProductGallery images={product.images} productName={product.name} discountPercentage={hasDiscount ? product.discountPercentage : null} />

          <div>
            <div className="mb-6">
              <p className="text-sm text-[var(--color-text-muted)] mb-2">
                {content.productDetail.categoryLabel}
              </p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              {product.name}
            </h1>

            <p className="text-lg text-[var(--color-text-secondary)] mb-6">
              {product.shortDescription}
            </p>

            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-[var(--color-primary)]">
                    {formatPrice(product.retailPrice)}
                  </span>
                  <span className="text-base text-[var(--color-text-muted)]">x 1 u.</span>
                </div>
                {hasDiscount && (
                  <span className="text-lg text-[var(--color-text-muted)] line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>

            {hasWholesale && (
              <div className="mt-4 mb-6">
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                  mayorista (a partir de {product.unitsToWholesalePrice} u.)
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">x 1 u.</span>
                </div>
                {product.wholesaleComparePrice && (
                  <span className="text-base text-[var(--color-text-muted)] line-through">
                    {formatPrice(product.wholesaleComparePrice)}
                  </span>
                )}
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="mb-8">
                <p className="text-sm text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {content.productDetail.tagsLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-invert mb-8">
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl font-semibold transition-all ${
                justAdded
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-primary)] text-white hover:opacity-90'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  {content.productDetail.addedToCart}
                </>
              ) : (
                <>
                  {content.productDetail.addToCart}
                  {quantity > 0 && ` (${quantity} en carrito)`}
                </>
              )}
            </button>

            {hasWholesale && (
              <button
                onClick={handleAddWholesale}
                className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl font-semibold border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all mt-3"
              >
                Agregar por {product.unitsToWholesalePrice} u. (mayorista)
              </button>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <>
            <SectionHeader
              title={content.productDetail.relatedTitle}
              className="mb-8"
            />
            <ProductGrid products={related} />
          </>
        )}
      </div>
    </section>
  )
}