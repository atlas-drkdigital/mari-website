import { useCallback, useState } from 'react'
import { Button, Stack, Text } from '@sanity/ui'
import { set, useFormValue } from 'sanity'
import type { TextInputProps } from 'sanity'

// Prefill for the seo.jsonLd override (Adinda's ask, shipped 2026-07-22): an editor flipping
// "Override structured data" on should start from what the page ACTUALLY emits, not a blank box.
//
// How: fetch the page's own served HTML — Studio is embedded on the same origin, so `/…` paths
// just work in dev and prod — and extract its <script type="application/ld+json"> block(s).
// This deliberately does NOT re-implement the frontend's generation logic: the rendered page is
// the single source of truth, so the prefill can never drift from reality. Consequence worth
// knowing: it reads the PUBLISHED page — unsaved Studio edits aren't in it yet, which is fine
// for a starting point.
// SITEWIDE (Adinda, 2026-07-23): every page-bearing type maps here — the button already appears on
// every `seo` field, this map is what lets it resolve a route. A type whose page isn't built yet
// (e.g. Schedule & Rates pre-build) just gets the honest "responded 404" message until it ships.
// Types with seo but NO page of their own (itineraries) stay unmapped on purpose — the "no live
// page" message is the correct answer there, not a gap.
const ROUTE_BY_TYPE: Record<string, (slug?: string) => string | null> = {
  homePage: () => '/',
  destination: (slug) => (slug ? `/destinations/${slug}` : null),
  boat: (slug) => (slug ? `/boats/${slug}` : null),
  blogPost: (slug) => (slug ? `/blog/${slug}` : null),
  page: (slug) => (slug ? `/${slug}` : null),
  privateCharters: () => '/private-charters',
  aboutPage: () => '/about',
  faqGeneral: () => '/faq',
  scheduleRates: () => '/booking',
}

export function JsonLdPrefillInput(props: TextInputProps) {
  const doc = useFormValue([]) as
    | { _type?: string; slug?: { current?: string } }
    | undefined
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { onChange } = props

  const load = useCallback(async () => {
    const toRoute = doc?._type ? ROUTE_BY_TYPE[doc._type] : undefined
    const path = toRoute?.(doc?.slug?.current) ?? null
    if (!path) {
      setStatus('This document type has no live page to read structured data from.')
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(path)
      if (!res.ok) throw new Error(`The page at ${path} responded ${res.status}.`)
      const html = await res.text()
      // [\s\S] instead of the dotAll flag — the tsconfig target predates es2018's /s.
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((m) => m[1])
        .map((raw) => JSON.parse(raw) as unknown)
      if (!blocks.length) {
        setStatus(`The page at ${path} currently emits no structured data.`)
        return
      }
      const pretty = JSON.stringify(blocks.length === 1 ? blocks[0] : blocks, null, 2)
      onChange(set(pretty))
      setStatus(`Loaded from ${path} — edit away.`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Could not load the page.')
    } finally {
      setLoading(false)
    }
  }, [doc, onChange])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button
        mode="ghost"
        tone="primary"
        disabled={loading}
        onClick={load}
        text={loading ? 'Loading…' : 'Load current structured data (replaces this field)'}
      />
      {status ? (
        <Text size={1} muted>
          {status}
        </Text>
      ) : null}
    </Stack>
  )
}
