import type { StructureResolver } from 'sanity/structure'

// Singletons are enforced here (fixed document ID), not via a schema option —
// see sanity-best-practices skill's studio-structure.md.
const SINGLETON_TYPES = ['siteSettings', 'navigation', 'homePage', 'privateCharters', 'aboutPage', 'scheduleRates', 'destinationDefaults', 'destinationsSection', 'boatDefaults', 'boatsSection', 'testimonialsSection', 'cta', 'faqGeneral']
// Pinned single-instance `page` documents — NOW EMPTY (kept as the mechanism): Private Charters
// left 2026-07-23 (dedicated `privateCharters` singleton), About left the same day (dedicated
// `aboutPage` singleton — the spec made it a structured section page too). Old placeholder docs
// deleted with Adinda's approval.
const PINNED_PAGE_IDS: Array<{ id: string; title: string }> = []
const PLACED_TYPES = [
  ...SINGLETON_TYPES,
  'page',
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

      // Dedicated singletons (were pinned generic `page` docs until 2026-07-23 — see PINNED_PAGE_IDS).
      singleton(S, 'privateCharters', 'Private Charters'),

      // About folder: the page + its crew members (Adinda, 2026-07-24 declutter: crew appears
      // nowhere but the About page, so it lives WITH it — topic beats abstraction, the same
      // precedent as Destination Defaults / Boats Section; moved out of Shared Components).
      S.listItem()
        .id('about')
        .title('About')
        .child(
          S.list()
            .title('About')
            .items([
              singleton(S, 'aboutPage', 'About Page'),
              S.documentTypeListItem('crewMember').title('Crew Members'),
            ])
        ),

      // Its own top-level entry, not nested under Pages — more variants of this
      // shape are coming (Specials, etc.), each will likely get its own entry too.
      // SINGLETON since the booking slice (2026-07-24) — fixed-id page doc like
      // privateCharters/aboutPage, backing the /booking route.
      singleton(S, 'scheduleRates', 'Schedule & Rates'),

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

      // Testimonials folder: the docs + the shared-section singleton; the Testimonials Page
      // singleton joins here when built (spec #3).
      S.listItem()
        .title('Testimonials')
        .child(
          S.list()
            .title('Testimonials')
            .items([
              S.documentTypeListItem('testimonial').title('Testimonials'),
              singleton(S, 'testimonialsSection', 'Testimonials Section'),
            ])
        ),

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
      // Crew Members LEFT this band 2026-07-24 (Adinda): they only appear on the About page, so
      // they live in the About folder now — same topic-beats-abstraction call as the others above.
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
