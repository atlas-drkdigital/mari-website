import type { StructureResolver } from 'sanity/structure'

// Singletons are enforced here (fixed document ID), not via a schema option —
// see sanity-best-practices skill's studio-structure.md.
const SINGLETON_TYPES = ['siteSettings', 'navigation', 'homePage', 'destinationDefaults', 'cta', 'faqGeneral']
// Pinned single-instance `page` documents (About, Private Charters) — schema type is still the
// generic `page` (Private Charters' dedicated-vs-generic decision isn't locked, About never
// needed its own type), but each gets a fixed sidebar slot by document ID so they're easy to
// find, same technique as `singleton()` below just without enforcing only-one-can-exist.
const PINNED_PAGE_IDS: Array<{ id: string; title: string }> = [
  { id: 'page-private-charters', title: 'Private Charters' },
  { id: 'page-about', title: 'About' },
]
const PLACED_TYPES = [
  ...SINGLETON_TYPES,
  'page',
  'scheduleRates',
  'announcementBar',
  'redirect',
  'language',
  'boat',
  'cabinType',
  'cabin',
  'destination',
  'itinerary',
  'testimonial',
  'faqGeneral',
  'blogPost',
  'blogCategory',
  'author',
  'whyUsItem',
  'crewMember',
]

function singleton(S: Parameters<StructureResolver>[0], typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

function pinnedPage(S: Parameters<StructureResolver>[0], id: string, title: string) {
  return S.listItem()
    .title(title)
    .child(S.document().schemaType('page').documentId(id).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- Main Page Content ---
      singleton(S, 'homePage', 'Homepage'),

      // Destinations nested folder: the list of destination docs + the shared "Destination
      // Defaults" singleton (edit-once eyebrows/headings with a {destination} token), same nesting
      // pattern as Boats. Keeps the two destination-related things under one entry instead of
      // stacking two top-level pages (Adinda's ask 2026-07-16).
      S.listItem()
        .title('Destinations')
        .child(
          S.list()
            .title('Destinations')
            .items([
              S.documentTypeListItem('destination').title('Destinations'),
              singleton(S, 'destinationDefaults', 'Destination Defaults'),
            ])
        ),

      // Nested under one "Boats" entry rather than 3 top-level items — cabinType/cabin only
      // make sense in relation to a boat, same reasoning as not giving them their own root-level
      // slot. Grouping only; field/name-level decisions (the part that's costly to redo later)
      // are unaffected — see CLAUDE.md's "Studio editor-organization" note.
      S.listItem()
        .title('Boats')
        .child(
          S.list()
            .title('Boats')
            .items([
              S.documentTypeListItem('boat').title('Boats'),
              S.documentTypeListItem('cabinType').title('Cabin Types'),
              S.documentTypeListItem('cabin').title('Cabins'),
            ])
        ),

      ...PINNED_PAGE_IDS.map(({ id, title }) => pinnedPage(S, id, title)),

      // Its own top-level entry, not nested under Pages — more variants of this
      // shape are coming (Specials, etc.), each will likely get its own entry too.
      S.documentTypeListItem('scheduleRates').title('Schedule & Rates'),

      S.documentTypeListItem('itinerary').title('Itineraries'),

      // The General FAQ is a PAGE, not a shared component — moved here from the shared-components
      // section 2026-07-16 (Adinda's call). It backs the /faq hub, carries its own `seo`, and will
      // carry page-level section toggles (contact form, CTA), so it describes a page rather than a
      // reusable content item. Destination/boat pages PULLING categories from it doesn't make it a
      // component: the homepage pulls Destinations and Blog Posts, which live here too.
      singleton(S, 'faqGeneral', 'General FAQ'),

      // Generic `page` catch-all (T&C, Onboard Prices, and anything else not pinned above) goes
      // LAST in this section, per Adinda's explicit ordering ask 2026-07-16.
      S.documentTypeListItem('page').title('Pages'),

      S.divider(),

      // --- Blog (its own section, not lumped in with the generic shared-components section
      // below — Adinda's explicit ask 2026-07-16, since blog has enough of its own supporting
      // types — categories, authors — to warrant a section of its own) ---
      S.documentTypeListItem('blogPost').title('Blog Posts'),
      S.documentTypeListItem('blogCategory').title('Blog Categories'),
      S.documentTypeListItem('author').title('Blog Authors'),

      S.divider(),

      // --- Shared / cross-page components — repeatable content that isn't a page itself but can
      // appear across multiple pages/page types (e.g. Testimonials shows on both Home and About;
      // Why Us items are a repeatable component that may be reused on a different page; the General
      // FAQ's categories are composed into destination and boat pages) ---
      // Gallery is NOT here — it lives as a flat array directly on each page (boat.gallery,
      // destination.gallery) so editors get native multi-file batch upload, not a document type.
      S.listItem()
        .title('Announcements')
        .child(S.documentTypeList('announcementBar').title('Announcements')),
      S.documentTypeListItem('whyUsItem').title('Why Us Items'),
      // ONE FAQ entry. The General FAQ holds only the cross-cutting questions (and backs the /faq
      // hub); destination- and boat-specific questions are inline `faqSections` arrays on those
      // documents, edited where the editor is already working, not in a separate pile of reference
      // docs (see CLAUDE.md editor-experience principle + the 2026-07-16 FAQ restructure).
      singleton(S, 'faqGeneral', 'General FAQ'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      // Crew members (shown on the About page) — a repeatable shared component, placed here per
      // Adinda's ask 2026-07-16.
      S.documentTypeListItem('crewMember').title('Crew Members'),
      // Shared two-card CTA section (Private Charter / Shared Trip) reused across pages — a
      // singleton, placed here with the other shared components per Adinda's ask 2026-07-16.
      singleton(S, 'cta', 'CTA Section'),

      S.divider(),

      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              singleton(S, 'siteSettings', 'Site Settings'),
              singleton(S, 'navigation', 'Navigation'),
            ])
        ),

      S.listItem()
        .title('SEO Tools')
        .child(
          S.list()
            .title('SEO Tools')
            .items([S.documentTypeListItem('redirect').title('Redirects')])
        ),

      S.listItem()
        .title('Languages')
        .child(S.documentTypeList('language').title('Languages')),

      S.divider(),

      // Anything not explicitly placed above still shows up here, so nothing
      // new gets lost as more document types are added.
      ...S.documentTypeListItems().filter((item) => !PLACED_TYPES.includes(item.getId() as string)),
    ])
