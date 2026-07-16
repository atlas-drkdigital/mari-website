'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {RequiredFieldMarker} from './src/sanity/components/RequiredFieldMarker'

// Brand colors from theme.css (../v1-static-homepage, Figma TKjkHpjqPVn5yL5TnpuWAt).
// buildLegacyTheme is Sanity's own currently-supported (if deprecated, "will be removed in an
// upcoming major version" per its own JSDoc) simple theming API — revisit when v6/v7 ships its
// replacement, don't assume this stays valid indefinitely.
const theme = buildLegacyTheme({
  // Changed from #8f6d51 2026-07-16 (Adinda's pick from Figma). The old value sat in a dead zone:
  // Sanity DERIVES the title/subtitle colours on a selected list row from this value and we cannot set
  // them, and its derived muted-grey subtitle was unreadable on it. This value is light enough that the
  // derived text should go dark. NOTE it is not scoped to that row — it also drives primary buttons and
  // other brand surfaces, so re-check those in a browser after changing it.
  //
  // ⚠️ NAME DRIFT: Figma calls this **chocolate/300**; our ported globals.css calls the same hex
  // `--primitive-copper-300`, and has no `chocolate-300` at all (our chocolate scale skips from 250 to
  // 350). The hex is what matters here, but the palette names have diverged from Figma since the port —
  // flagged 2026-07-16, worth a proper reconcile before anyone matches tokens by NAME across the two.
  '--brand-primary': '#cfbbaa', // Figma: chocolate/300 · our theme.css: primitive-copper-300
  // Deliberately NOT changed to match --brand-primary: a pale button with Sanity's derived text risks
  // the mirror-image of the bug we just fixed. Kept dark.
  '--default-button-primary-color': '#8f6d51', // primitive-copper-600
  '--focus-color': '#b58a2d', // primitive-amber-600
  '--component-text-color': '#1b2a4a', // primitive-navy-900, same as the website's --color-text-primary
  // --font-bricolage-grotesque is set by next/font/google on the <html> element in
  // src/app/layout.tsx — cascades down into /studio since it's the same document.
  '--font-family-base': 'var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif',
})

export default defineConfig({
  basePath: '/studio',
  title: 'Mari Studio',
  projectId,
  dataset,
  theme,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  // Site-wide "required" marker on every required field's label, shown upfront (before the
  // editor fills the form) — see src/sanity/components/RequiredFieldMarker.tsx.
  form: {
    components: {
      field: RequiredFieldMarker,
    },
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    // Needed for the `color` field type used by the page body's text-color annotation.
    colorInput(),
  ],
})
