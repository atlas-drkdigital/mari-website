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
};

export default nextConfig;
