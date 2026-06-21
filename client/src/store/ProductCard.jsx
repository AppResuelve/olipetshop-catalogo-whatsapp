import { Link } from "react-router-dom";
import { Badge } from "./components/ui/Badge";
import { useCart } from "./context/CartContext";
import { formatPrice } from "../utils/formatPrice";

export function ProductCard({ product }) {
  const { addItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const hasDiscount = product.discountPercentage
  const hasWholesale = product.wholesalePrice && product.unitsToWholesalePrice;

  const getBadgeVariant = (tag) => {
    if (tag === "nuevo") return "new";
    if (tag === "oferta") return "sale";
    if (tag === "bestseller") return "bestseller";
    return "default";
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product.id);
  };

  const handleAddWholesale = (e) => {
    e.preventDefault();
    addItem(product.id, product.unitsToWholesalePrice);
  };

  return (
    <div className="group relative rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden transition-all duration-300 flex flex-col">
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-secondary)]/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative">
        <Link to={`/producto/${product.slug}`} className="block">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {hasDiscount && (
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[var(--color-secondary)] text-yellow-800">
                {product.discountPercentage}% OFF
              </span>
            </div>
          )}
          {product.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant={getBadgeVariant(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Link>
      </div>

      <div className="p-2 flex flex-col flex-1">
        <Link to={`/producto/${product.slug}`} className="block flex-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {formatPrice(product.retailPrice)}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  x 1 u.
                </span>
              </div>
              {hasDiscount && (
                <span className="text-sm text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {hasWholesale && (
            <>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                mayorista (a partir de {product.unitsToWholesalePrice} u.)
              </p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base font-bold text-[var(--color-primary)]">
                  {formatPrice(product.wholesalePrice)}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  x 1 u.
                </span>
              </div>
              {product.wholesaleComparePrice && (
                <span className="text-sm text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.wholesaleComparePrice)}
                </span>
              )}
            </>
          )}

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-colors mt-3"
          >
            {quantity > 0 ? `Agregado (${quantity})` : "Agregar al carrito"}
          </button>

          {hasWholesale && (
            <button
              onClick={handleAddWholesale}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all mt-2"
            >
              Agregar por {product.unitsToWholesalePrice} u.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
