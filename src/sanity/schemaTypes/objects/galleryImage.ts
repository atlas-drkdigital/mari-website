import { defineField, defineType } from 'sanity'

// Gallery image — an `image` OBJECT (not a document), used as the array member inside a gallery
// group's `images` array (see boat's gallery field). Being a plain `image` type is exactly
// what enables native multi-file batch upload: "arrays of images accept batches of files to be
// dropped on them" (Sanity v6.4 image-type docs). An object *wrapping* an image would not reliably
// get that behavior — this must stay a bare image type with extra fields, not a wrapper object.
// title / alt / caption are all editable, NONE required — bulk upload is about getting the files in
// fast; the text is filled per image afterward (or left blank). Editable alt on every image is the
// DRK hard rule; requiring it to be filled is not.
export const galleryImageType = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describes the image for screen readers and search engines. Strongly recommended, not required.',
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', description: 'Shown in the lightbox.' }),
    // Fixed list from the Figma gallery mockup (The Boat / Dining / Diving / Relaxation / Others) —
    // NOT free text (Adinda dislikes the plain-text field). Multi-select: one image can sit under
    // several tabs. INTERIM: hardcoded here for now. Better long-term options to raise next session —
    // a centrally-managed, editor-editable category set (its own list, or a field in site settings)
    // so categories aren't baked into code. See MANAGER.md.
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['The Boat', 'Dining', 'Diving', 'Relaxation', 'Others'],
      },
      description: 'Optional — one image can belong to several.',
    }),
  ],
})
