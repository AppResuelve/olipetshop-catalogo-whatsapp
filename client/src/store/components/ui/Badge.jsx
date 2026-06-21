export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20',
    new: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    sale: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    bestseller: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
