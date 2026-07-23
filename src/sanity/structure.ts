import type { StructureResolver } from 'sanity/structure'

// Singletons are enforced here (fixed document ID), not via a schema option —
// see sanity-best-practices skill's studio-structure.md.
const SINGLETON_TYPES = ['siteSettings', 'navigation', 'homePage', 'privateCharters', 'destinationDefaults', 'destinationsSection', 'boatDefaults', 'boatsSection', 'cta', 'faqGeneral']
// Pinned single-instance `page` documents (About) — schema type is still the generic `page`
// (About never needed its own type), but each gets a fixed sidebar slot by document ID so
// they're easy to find, same technique as `singleton()` below just without enforcing
// only-one-can-exist. Private Charters left this list 2026-07-23: the mockup made it a
// structured section page, so it's now the dedicated `privateCharters` singleton. The old
// placeholder doc `page-private-charters` may still exist in the dataset (visible under Pages)
// until it's deleted.
const PINNED_PAGE_IDS: Array<{ id: string; title: string }> = [
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

// NOTE — `.id()` is set EXPLICITLY on purpose, do not remove it. Without it, Sanity derives a list
// item's id from its TITLE, so two items whose titles happen to match anywhere in the same list blow
// up the whole sidebar with "List items with same ID found" — the Studio shell still returns 200, so
// only a browser catches it. Deriving the id from the type name instead makes that structurally
// impossible. (Cost us a broken sidebar on 2026-07-16 when two items were briefly titled "General FAQ".)
function singleton(S: Parameters<StructureResolver>[0], typeName: string, title: string) {
  return S.listItem()
    .id(typeName)
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

function pinnedPage(S: Parameters<StructureResolver>[0], id: string, title: string) {
  return S.listItem()
    .id(id)
    .title(title)
    .child(S.document().schemaType('page').documentId(id).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // --- MAIN PAGES (reorg 2026-07-23, Adinda: Studio was getting cluttered; main pages,
      // secondary pages, blog, and shared components each get their own band) ---
      singleton(S, 'homePage', 'Homepage'),

      // Destinations nested folder: docs + the type's shared chrome. The shared-SECTION singleton
      // (Destinations Section — carousel curation/order) joins this folder when built, NOT the
      // Shared Components band: topic beats abstraction for findability, and Destination Defaults
      // set that precedent (Adinda's call, 2026-07-23).
      S.listItem()
        .title('Destinations')
        .child(
          S.list()
            .title('Destinations')
            .items([
              S.documentTypeListItem('destination').title('Destinations'),
              singleton(S, 'destinationDefaults', 'Destination Defaults'),
              singleton(S, 'destinationsSection', 'Destinations Section'),
            ])
        ),

      // Boats folder, order per Adinda 2026-07-23: boats → both shared-chrome singletons → cabin
      // types. `cabin` (individual physical cabins) LEFT the sidebar the same day — Mari doesn't
      // use it (cabin TYPES carry the content); the schema type stays registered as a
      // future-website affordance, this is declutter-only.
      S.listItem()
        .title('Boats')
        .child(
          S.list()
            .title('Boats')
            .items([
              S.documentTypeListItem('boat').title('Boats'),
              singleton(S, 'boatDefaults', 'Boat Defaults'),
              singleton(S, 'boatsSection', 'Boats Section'),
              S.documentTypeListItem('cabinType').title('Cabin Types'),
            ])
        ),

      // Dedicated singleton (was a pinned generic `page` until 2026-07-23 — see PINNED_PAGE_IDS).
      singleton(S, 'privateCharters', 'Private Charters'),

      // Its own top-level entry, not nested under Pages — more variants of this
      // shape are coming (Specials, etc.), each will likely get its own entry too.
      S.documentTypeListItem('scheduleRates').title('Schedule & Rates'),

      ...PINNED_PAGE_IDS.map(({ id, title }) => pinnedPage(S, id, title)),

      // Generic `page` catch-all (T&C, Onboard Prices) goes LAST in this section, per Adinda's
      // explicit ordering ask 2026-07-16.
      S.documentTypeListItem('page').title('Pages'),

      S.divider(),

      // --- SECONDARY PAGES (Adinda, 2026-07-23): content-listing pages, one band below the main
      // pages. Testimonials sits here as a PAGE-to-be — the `testimonialsPage` singleton (queued,
      // shares the FAQ-page slot) turns this into a folder like Destinations when it lands. ---
      S.documentTypeListItem('itinerary').title('Itineraries'),

      // The FAQ is a PAGE, not a shared component (2026-07-16, Adinda) — it backs the /faq hub,
      // carries `seo` + page-level settings. Destination/boat/charters pages PULLING categories
      // from it doesn't make it a component.
      singleton(S, 'faqGeneral', 'FAQ'),

      S.documentTypeListItem('testimonial').title('Testimonials'),

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
      // NOT here (all moved out in the 2026-07-23 declutter): FAQ + Testimonials → Secondary
      // Pages; Boats Section → the Boats folder (shared-SECTION singletons live with their topic,
      // not with the abstraction — Adinda's call, Destination Defaults set the precedent).
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
