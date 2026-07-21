import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { SITE_URL } from "@/lib/seo";
import { SanityLive } from "@/sanity/lib/live";

// Brand font (theme.css: --font-sans) — also available to /studio since it's the same document.
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

// Static placeholder — becomes dynamic (generateMetadata reading Sanity's siteSettings/SEO
// fields) once page data-fetching is wired up. Not the "Create Next App" default at least.
export const metadata: Metadata = {
  // Without metadataBase, Next emits the site-relative canonical/og:url/og:image values the pages
  // set (e.g. `/boats/mari`) verbatim. Crawlers and social scrapers can't resolve a relative URL in
  // a <link rel=canonical> or an og:image, so both were silently useless. Added 2026-07-20.
  metadataBase: new URL(SITE_URL),
  title: "Mari Liveaboard",
  description: "A traditional Phinisi liveaboard for serious divers.",
  icons: {
    icon: [
      { url: "/assets/favico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favico/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favico/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/favico/apple-touch-icon.png",
  },
  manifest: "/assets/favico/site.webmanifest",
};

// Organization structured data — emitted site-wide (every page) so search + answer engines have a
// stable identity for the business. Page-specific structured data (FAQPage on the homepage + boat
// pages) is emitted by those pages on top of this. Kept minimal + valid; contact/social details move
// here from siteSettings when the global-chrome slice wires them.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mari Liveaboard",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/favico/android-chrome-512x512.png`,
  description: "A traditional Phinisi liveaboard for serious divers in Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // motion-safe:scroll-smooth — smooth in-page anchor navigation (SubNav, 2026-07-21) done in CSS
  // so native anchor semantics stay intact (hash updates, hashchange fires, deep links work) and
  // reduced-motion users get instant jumps for free.
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} h-full antialiased motion-safe:scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SanityLive />
        {/* Site-wide back-to-top (Adinda, 2026-07-21) — appears at the nav-flip scroll threshold. */}
        <ScrollTopButton />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
