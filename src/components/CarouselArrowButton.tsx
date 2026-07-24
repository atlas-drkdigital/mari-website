// The round prev/next carousel arrow button — THE standard (Adinda, 2026-07-22): the tailed
// `icon-arrow-forward.svg` glyph at 16px (rotate-180 for prev), in a 36px circle that grows to
// 52px on lg, glyph scale-105 on hover. NOT the chevron — CarouselChevron is the small glyph
// INSIDE image-carousel controls (Cabins/Gallery/lightbox); this is the standalone paired-arrows
// control next to a section heading.
//
// Extracted 2026-07-22 when the destination Overview became the third consumer (Testimonials +
// homepage Destinations refactored onto it the same day) — uniform by construction, per the
// CarouselChevron precedent. Registered in COMPONENTS.md.
//
// Variants map to the three shipped expressions:
//   outline        light sections, hairline text-primary ring (destination Overview)
//   surface        floating over content, bg-surface + shadow (Testimonials)
//   outline-ondark dark/photo sections, bg-surface hairline + ondark glyph (homepage Destinations)
// Positioning stays on the caller via className (Testimonials' arrows are absolutely placed).
const VARIANTS = {
  outline:
    'border border-text-primary text-text-primary transition-colors duration-300 ease-in-out hover:bg-text-primary/5',
  surface:
    'bg-bg-surface shadow-[0px_4px_10px_rgba(44,37,34,0.2)] transition-opacity duration-300 ease-in-out hover:opacity-85',
  'outline-ondark':
    'border border-bg-surface text-text-ondark-primary transition-colors duration-300 ease-in-out hover:bg-text-ondark-primary/10',
} as const

const GLYPH = {
  outline: 'bg-text-primary',
  surface: 'bg-text-primary',
  'outline-ondark': 'bg-text-ondark-primary',
} as const

export function CarouselArrowButton({
  direction,
  onClick,
  ariaLabel,
  variant = 'outline',
  className = '',
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  ariaLabel: string
  variant?: keyof typeof VARIANTS
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group grid size-[36px] shrink-0 place-items-center rounded-full lg:size-[52px] ${VARIANTS[variant]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`block size-[16px] transition-transform duration-300 ease-in-out group-hover:scale-105 [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
          direction === 'prev' ? 'rotate-180' : ''
        } ${GLYPH[variant]}`}
      />
    </button>
  )
}
