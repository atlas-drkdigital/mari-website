import { defineField, defineType } from 'sanity'

// Singleton (one document, id "navigation"). Enforced via Structure, not schema options — see MANAGER.md,
// singleton-lock in Structure Builder is deferred to the editor-organization polish pass.
export const navigationType = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({ name: 'mainNav', title: 'Main nav', type: 'array', of: [{ type: 'navItem' }] }),
    defineField({ name: 'footerNav', title: 'Footer nav', type: 'array', of: [{ type: 'linkItem' }] }),
  ],
})
