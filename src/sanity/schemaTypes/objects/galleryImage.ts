import { defineField, defineType } from 'sanity'

import { GALLERY_CATEGORIES } from '../galleryCategories'

// Gallery image — an `image` OBJECT (not a document), used as the array member inside a gallery
// group's `images` array (see boat's gallery field). Being a plain `image` type is exactly
// what enables native multi-file batch upload: "arrays of images accept batches of files to be
// dropped on them" (Sanity v6.4 image-type docs). An object *wrapping* an image would not reliably
// get that behavior — this must stay a bare image type with extra fields, not a wrapper object.
// alt / caption are both editable, NEITHER required — bulk upload is about getting the files in
// fast; the text is filled per image afterward (or left blank). Editable alt on every image is the
// DRK hard rule; requiring it to be filled is not.
//
// `title` REMOVED 2026-07-20 (Adinda). It duplicated `alt` in practice — every seeded image had the
// two set to the identical string — and gave editors two boxes with no clear difference between
// them. The lightbox now shows image count + caption only, so nothing renders a title.
// ⚠️ Existing documents still CARRY a `title` value in their gallery array members. Sanity does not
// delete data when a field leaves the schema; it just stops showing it. That orphaned data is
// harmless and is deliberately left in place — it is the only record of the old values if this is
// ever reversed. Strip it in a migration only if it actually gets in the way.
export const galleryImageType = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describes the image for screen readers and search engines. Strongly recommended, not required.',
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Shown in the lightbox.' }),
    // These categories ARE the Amenities section's tabs (Figma node 778:8845). An image tagged
    // "Dining" appears in the Dining tab's carousel; multi-select is deliberate, so one image can
    // appear in several tabs. The lightbox shows every image regardless of tag.
    // List shared with `boat.galleryTabs[].category` via GALLERY_CATEGORIES — see that file for why
    // it stays hardcoded.
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [...GALLERY_CATEGORIES],
      },
      // BOAT DOCUMENTS ONLY (Adinda's catch, 2026-07-22): categories exist to feed the boat
      // gallery's tabs. The destination gallery is a flat grid with no tabs, so on a
      // `destination` doc this field was a control wired to nothing — an editor tagging
      // "Dining" there would see no effect anywhere. `hidden` gets the whole document as
      // context, so one shared object type can show the field only where something consumes
      // it. Opt-IN by type (=== 'boat', not !== 'destination') so any future gallery-bearing
      // type starts clean and only shows categories once it actually renders tabs.
      hidden: ({ document }) => document?._type !== 'boat',
      description: 'Which tabs this image appears under. Optional — one image can belong to several.',
    }),
  ],
})
