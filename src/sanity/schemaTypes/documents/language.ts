import { defineField, defineType } from 'sanity'

// Localization prep only — passive schema shape, no plugin wired yet.
// See CLAUDE.md's content-modeling section: field/document-level plugin choice
// is per document type, deferred until multilingual is actually scoped/paid.
export const languageType = defineType({
  name: 'language',
  title: 'Language',
  type: 'document',
  description: 'The list of languages this site supports (not multilingual content itself yet — see CLAUDE.md).',
  fields: [
    defineField({ name: 'name', type: 'string', description: 'e.g. "English", "Indonesian".' }),
    defineField({ name: 'tag', title: 'IANA tag (en, en-US)', type: 'string' }),
    defineField({ name: 'fallback', type: 'reference', to: [{ type: 'language' }] }),
    defineField({ name: 'default', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tag' },
  },
})
