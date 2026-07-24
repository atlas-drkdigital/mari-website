import type { MetadataRoute } from 'next'

// STAGING KILL-SWITCH (2026-07-24): the staging deployment's production alias
// (mari-website-beta.vercel.app) is PUBLIC — Vercel's free protection only gates preview URLs,
// not the production environment, and it sends no noindex header there (verified by curl).
// `SITE_NOINDEX=1` (set in the Vercel project's env vars) flips the whole site to
// disallow-all + per-page noindex (see layout.tsx). 🔴 PRE-LAUNCH: when this project (or its
// successor) goes to the real domain, the env var MUST be removed — a launched site carrying
// SITE_NOINDEX is the worst bug SEO can have. Tracked in _internal/QA-CHECKLIST.md.
const isNoIndexEnv = process.env.SITE_NOINDEX === '1'

// AI-crawler policy (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) is a
// conscious business decision, not a default — see MANAGER.md's pre-launch
// to-dos and the drk-seo skill's aeo-considerations.md. Uncomment to block:
export default function robots(): MetadataRoute.Robots {
  if (isNoIndexEnv) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/'],
      },
      // { userAgent: 'GPTBot', disallow: '/' },
      // { userAgent: 'ClaudeBot', disallow: '/' },
      // { userAgent: 'PerplexityBot', disallow: '/' },
      // { userAgent: 'Google-Extended', disallow: '/' },
    ],
    // TODO: update once the production domain is confirmed at launch.
    sitemap: 'https://mari-liveaboard.com/sitemap.xml',
  }
}
