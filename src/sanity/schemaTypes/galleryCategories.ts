// The gallery/Amenities tab labels. ONE source of truth — used by BOTH `galleryImage.categories`
// (the per-image tag) and `boat.galleryTabs[].category` (the per-tab copy). These two MUST hold the
// same list: the frontend matches a tab to its images by comparing these strings, so a drift of one
// character silently empties a tab.
//
// Fixed list from the Figma boat page's Amenities section (node 778:8845 — its 5 tab items are
// 778:8851-8855). NOT free text (Adinda dislikes the plain-text field).
//
// 'Others' stays a valid value even though nothing is tagged with it today (Adinda 2026-07-17). It is
// not special-cased: BoatGallery hides ANY tab with no images, so an unused category costs nothing and
// the tab appears by itself the moment an image is tagged. Keeping the value also means `boat-mari`'s
// existing 'Others' row stays valid in Studio rather than erroring at the editor.
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
