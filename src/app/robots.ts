import type { MetadataRoute } from 'next'

// AI-crawler policy (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) is a
// conscious business decision, not a default — see MANAGER.md's pre-launch
// to-dos and the drk-seo skill's aeo-considerations.md. Uncomment to block:
export default function robots(): MetadataRoute.Robots {
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
