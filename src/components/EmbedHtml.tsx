'use client'

import { useEffect, useRef } from 'react'

// Renders editor-pasted embed HTML so that its <script> tags actually EXECUTE.
//
// Why this exists (2026-07-22, Upcoming Trips): React's dangerouslySetInnerHTML inserts markup via
// innerHTML, and the HTML spec says scripts inserted that way are NOT run — so the INSEANQ booking
// widget (a <div> + loader <script>) rendered as an empty box while looking perfectly wired. The
// fix is the standard one: set innerHTML, then replace every <script> with a freshly created
// element (attributes + text copied), which the browser does execute.
//
// Client-only by nature — the embed's content never appears in the server HTML. Fine for booking
// widgets; don't reach for this for content that must be crawlable.
export function EmbedHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    host.innerHTML = html
    host.querySelectorAll('script').forEach((inert) => {
      const live = document.createElement('script')
      for (const { name, value } of Array.from(inert.attributes)) live.setAttribute(name, value)
      live.text = inert.text
      inert.replaceWith(live)
    })
    return () => {
      host.innerHTML = ''
    }
  }, [html])

  return <div ref={ref} className={className} />
}
