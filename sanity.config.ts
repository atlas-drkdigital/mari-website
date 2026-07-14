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

// Brand colors from theme.css (../v1-static-homepage, Figma TKjkHpjqPVn5yL5TnpuWAt).
// buildLegacyTheme is Sanity's own currently-supported (if deprecated, "will be removed in an
// upcoming major version" per its own JSDoc) simple theming API — revisit when v6/v7 ships its
// replacement, don't assume this stays valid indefinitely.
const theme = buildLegacyTheme({
  '--brand-primary': '#8f6d51', // primitive-copper-600
  '--default-button-primary-color': '#8f6d51',
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
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    // Needed for the `color` field type used by the page body's text-color annotation.
    colorInput(),
  ],
})
