import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server (HMR websocket, dev-only font endpoint, etc.) be reached from another
  // device on the LAN for real-phone testing — Next.js blocks cross-origin dev requests by
  // default (only `localhost` is allowed out of the box). No-op outside `next dev`, so safe to
  // commit. Confirmed 2026-07-15: this exact IP mismatch was the root cause of a "most homepage
  // content invisible" bug reported on both real iPhone and desktop-via-LAN-IP — dev log showed
  // `/_next/webpack-hmr` and `/__nextjs_font/*` both being silently blocked for this origin.
  // If Adinda's Wi-Fi IP changes (DHCP), update this to match `ipconfig`'s current IPv4 address.
  allowedDevOrigins: ["192.168.0.101"],

  // Stack-fingerprinting hardening, not just AI-attribution: drop the `X-Powered-By: Next.js`
  // response header. Standard practice regardless, and one less thing to check off the
  // no-build-traces requirement in CLAUDE.md.
  poweredByHeader: false,

  images: {
    // Sanity CDN is the source for all editor-managed images. `images.domains` is deprecated in
    // Next 16 — use remotePatterns. Sanity-sourced <Image>s pass a custom loader (see
    // src/sanity/lib/image.ts) so the CDN does the resizing, but this is still required for any
    // Sanity image rendered through Next's default optimizer.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Next 16's default is `[75]` only. The static-build performance pass uses ~80 for
    // photographic hero images, so allow both or Next silently coerces 80 -> 75 (CLAUDE.md).
    qualities: [75, 80],
  },
};

export default nextConfig;
