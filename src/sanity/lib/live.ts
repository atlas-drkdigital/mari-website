// Querying with "sanityFetch" keeps content automatically updated; <SanityLive /> is rendered in
// the root layout. https://github.com/sanity-io/next-sanity#live-content-api
import { defineLive } from 'next-sanity/live'

import { client } from './client'

// serverToken lets the SERVER read drafts + content-release versions — this is what makes Draft Mode
// and the Presentation tool preview unpublished edits. It is never shipped to the browser (we do NOT
// pass browserToken: that is only for draft previewing OUTSIDE Presentation, which we don't do, and
// it would put the token in the client bundle). Published-content live updates work with or without
// it. The token is optional at build time — when SANITY_API_READ_TOKEN is unset, this is undefined
// and behaviour falls back to published-only, so nothing breaks in an env that hasn't set it.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
})
