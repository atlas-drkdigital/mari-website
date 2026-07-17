// The chevron inside a round carousel arrow button (Cabins, Gallery, lightbox).
//
// Why this exists: these arrows used to be the text character `›`. A font glyph is not an icon — its
// shape and weight are whatever the typeface decides, and Bricolage Grotesque renders `›` thick and
// stretched, which is how Adinda spotted it (2026-07-17). The size looked wrong; the real cause was
// that it wasn't an icon at all.
//
// 🔴 DELIBERATELY NOT FIGMA'S ICON. Figma's Button/Carousel Arrow-Small (778:8778) uses a filled
// Material `arrow_back_ios` path — far heavier than every other chevron on this site. Adinda
// 2026-07-17: chevrons must be "uniform in size and thickness as existing ones". Conventions supersede
// Figma (see CLAUDE.md). So this reuses `icon-nav-chevron.svg` — the SAME FILE as Nav/Contact/
// MultiSelect/BoatOverview, which is the only way thickness is uniform BY CONSTRUCTION rather than by
// a number someone has to keep in sync. Do not "correct" this back to the node's heavier icon.
//
// The asset points DOWN, hence the ±90° rotation. The circle + its Button Shadow stay in CSS on the
// caller: Figma exports the whole button as one flat SVG, which can't hover or recolour.
//
// ⚠️ Box ratio must stay 7.91668:6 (the viewBox). The asset is Figma-exported with
// preserveAspectRatio="none", so it stretches to fill ANY box and thickens the stroke on one axis —
// which is why the existing `size-[10px]` usages are slightly squashed. 10 x 7.58 keeps their scale
// without inheriting that. If you change one dimension, change both.
const NATURAL_RATIO_BOX = 'h-[7.58px] w-[10px]'

export function CarouselChevron({
  direction,
  className = 'bg-current',
  sizeClassName = NATURAL_RATIO_BOX,
}: {
  direction: 'left' | 'right'
  className?: string
  sizeClassName?: string
}) {
  return (
    <span
      aria-hidden
      className={`block shrink-0 [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${
        direction === 'left' ? 'rotate-90' : '-rotate-90'
      } ${sizeClassName} ${className}`}
    />
  )
}
