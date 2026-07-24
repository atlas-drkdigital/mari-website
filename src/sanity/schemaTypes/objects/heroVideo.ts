import { defineField, defineType } from 'sanity'

// Shared hero background video — a hosted-video URL, NOT a Sanity upload. Research 2026-07-16 (see
// MANAGER.md): Sanity's free tier caps bandwidth at 10GB/mo with NO overage (serving just blocks),
// and a hero background video can't be lazy-loaded, so self-hosting it in the dataset would burn the
// cap fast. Sanity's Media Library video CDN is Enterprise-only, so that's out too. Instead the
// editor points at a video CDN (Cloudflare Stream / Bunny / Cloudinary). When set, the frontend
// plays it muted + looped + playsinline as the hero background OVER the cover/hero image (which stays
// as poster + fallback); autoplay/mute/loop are fixed behaviour, not toggles — see HeroVideo.tsx.
//
// One shared object type used by boat.coverVideo, homePage.heroVideo, and destination.coverVideo, so
// the field shape + editor guidance live in exactly one place (used to be triplicated inline).
export const heroVideoType = defineType({
  name: 'heroVideo',
  title: 'Cover video',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description:
        'Link to a video hosted on a video CDN (e.g. Cloudflare Stream, Bunny, Cloudinary) — do not upload large video into Sanity. Recommended: a seamless silent loop, MP4 (H.264), 720p, under ~5MB, 5–15 seconds.',
    }),
    defineField({
      name: 'playOnMobile',
      title: 'Play on mobile?',
      type: 'boolean',
      initialValue: false,
      description: 'Off by default — mobile shows the cover image instead, to save data and keep the page fast.',
      hidden: ({ parent }) => !parent?.url,
    }),
  ],
})
