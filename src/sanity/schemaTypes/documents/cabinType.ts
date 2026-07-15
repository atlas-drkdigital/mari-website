import { defineArrayMember, defineField, defineType } from 'sanity'

// Repeatable — one doc per cabin category per boat (e.g. Mari's "Deluxe Cabin" and "Superior
// Cabin"). References `boat` so the same type name can exist independently per boat once a
// second boat is added. Individual physical cabins (Cabin 1, Cabin 2, ...) are separate `cabin`
// documents referencing both this type and the boat — see cabin.ts.
export const cabinTypeType = defineType({
  name: 'cabinType',
  title: 'Cabin Type',
  type: 'document',
  fields: [
    defineField({
      name: 'boat',
      type: 'reference',
      to: [{ type: 'boat' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Cabin type name',
      type: 'string',
      description: 'e.g. "Deluxe Cabin"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'count',
      title: 'Number of cabins of this type',
      type: 'number',
    }),
    defineField({
      name: 'maxGuests',
      title: 'Max guests per cabin',
      type: 'number',
    }),
    defineField({
      name: 'description',
      type: 'richTextBasic',
    }),
    // The 5 icon-labeled feature lines (locked 2026-07-15) — Adinda's named list, replacing the
    // earlier generic `features: array of string`. Named fields, not a flexible array: each has a
    // FIXED icon chosen in frontend code by field name (bedConfiguration → bed icon, etc.), not an
    // editor-uploadable custom icon — "maybe easiest no" was the explicit call on that. Kept as
    // strings (not booleans) so each can carry a real descriptive value, matching Figma's actual
    // content ("Sea View & Natural Light", not just "Window: yes").
    defineField({
      name: 'bedConfiguration',
      title: 'Bed type',
      type: 'string',
      description: 'e.g. "Convertible Double or Twin Bed + Extra Bed"',
    }),
    defineField({
      name: 'deckLocation',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Main Deck"',
    }),
    defineField({
      name: 'window',
      type: 'string',
      description: 'e.g. "Sea View & Natural Light"',
    }),
    defineField({
      name: 'bathroom',
      type: 'string',
      description: 'e.g. "En-Suite Bathroom (Hot Water)"',
    }),
    defineField({
      name: 'airConditioning',
      title: 'Air conditioning',
      type: 'string',
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'boat.name', media: 'images.0' },
  },
})
