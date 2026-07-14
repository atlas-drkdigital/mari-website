import type { StructureResolver } from 'sanity/structure'

// Singletons are enforced here (fixed document ID), not via a schema option —
// see sanity-best-practices skill's studio-structure.md.
const SINGLETON_TYPES = ['siteSettings', 'navigation']
const PLACED_TYPES = [...SINGLETON_TYPES, 'page', 'scheduleRates', 'announcementBar', 'redirect', 'language']

function singleton(S: Parameters<StructureResolver>[0], typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),

      // Its own top-level entry, not nested under Pages — more variants of this
      // shape are coming (Specials, etc.), each will likely get its own entry too.
      S.documentTypeListItem('scheduleRates').title('Schedule & Rates'),

      S.divider(),

      S.listItem()
        .title('Announcements')
        .child(S.documentTypeList('announcementBar').title('Announcements')),

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
