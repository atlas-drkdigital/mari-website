// The gallery/Amenities tab labels. ONE source of truth — used by BOTH `galleryImage.categories`
// (the per-image tag) and `boat.galleryTabs[].category` (the per-tab copy). These two MUST hold the
// same list: the frontend matches a tab to its images by comparing these strings, so a drift of one
// character silently empties a tab.
//
// Fixed list from the Figma boat page's Amenities section (node 778:8845 — its 5 tab items are
// 778:8851-8855). NOT free text (Adinda dislikes the plain-text field).
//
// Deliberately hardcoded, confirmed 2026-07-17 (Adinda: "the categories will be fixed for every
// boat"). Making them editor-managed — a list on `boatDefaults` — would need a CUSTOM INPUT
// COMPONENT, because Sanity's `options.list` cannot read its values out of another document. That's
// real work for a list that is fixed by definition. Revisit only if it genuinely needs editing.
export const GALLERY_CATEGORIES = [
  'The Boat',
  'Dining',
  'Diving',
  'Relaxation',
  'Others',
] as const
