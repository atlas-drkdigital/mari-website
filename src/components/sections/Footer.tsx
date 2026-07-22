'use client'

import Link from 'next/link'

// Ported from ../v1-static-homepage/sections/footer.html + assets/footer.js. Figma
// Section/Footer 218:1609 (desktop-only frame — mobile stacking is our own responsive
// judgment). Newsletter form is a static/backend-less placeholder, same situation as
// Contact — no endpoint exists yet.
const SOCIAL_LINKS = [
  { label: 'Instagram', icon: '/assets/icon-instagram.svg' },
  { label: 'YouTube', icon: '/assets/icon-youtube.svg' },
  { label: 'Facebook', icon: '/assets/icon-facebook.svg' },
  { label: 'WhatsApp', icon: '/assets/icon-whatsapp.svg' },
]

export function Footer() {
  return (
    <footer id="footer" className="w-full bg-background-ondark-page">
      <div className="flex flex-col items-center gap-16 border-b border-white/10 px-24 pb-32 pt-32 text-center">
        <Link href="/" aria-label="MariLiveaboard — home" className="text-caption-label uppercase tracking-[0.238em] text-text-ondark-primary">
          <span className="font-bold">Mari</span>
          <span className="font-medium">Liveaboard</span>
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] flex-col lg:flex-row lg:items-stretch">
        <div data-reveal="left" className="order-3 flex flex-col gap-24 px-24 py-32 lg:order-1 lg:flex-1 lg:py-48 lg:pl-[72px] lg:pr-80">
          <div className="flex flex-col gap-20">
            <p className="text-[25px] font-semibold leading-[1.2]">
              <span className="text-text-ondark-primary">Join our </span>
              <span className="text-accent-ondark-primary">newsletter</span>
            </p>
            {/* Placeholder copy, hardcoded like the rest of the homepage pending Sanity wiring —
                make this a siteSettings/footer field once that schema exists (Tier 4), not a
                permanent hardcoded string. Same text size/color as the "Also known as..." line
                below (text-body-medium text-text-ondark-secondary) per Adinda's ask. */}
            <p className="text-body-medium text-text-ondark-secondary">Subscribe to receive the latest news, itinerary updates, and exclusive specials straight to your inbox.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!e.currentTarget.reportValidity()) return
                e.currentTarget.reset()
              }}
              noValidate
              className="flex h-48 w-full items-stretch border-[0.5px] border-border-default"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">Email</label>
              <input
                id="footer-newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="min-w-0 flex-1 bg-transparent px-16 py-[11px] text-[16px] lg:text-body-large text-text-ondark-primary placeholder:text-text-muted focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="group flex w-[47px] shrink-0 items-center justify-center bg-action-primary-text transition-opacity duration-300 ease-in-out hover:opacity-85">
                <span aria-hidden="true" className="block size-[15px] shrink-0 bg-text-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow-right-thin.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              </button>
            </form>
          </div>
          <p className="w-full text-caption-label text-text-muted">maridivecruise.com is no longer owned and run by the legal owner of the Mari vessel as of May 2026. Any bookings made through the website since May 1st onward will be considered invalid. Please reach out to us for more information.</p>
        </div>

        <div data-reveal className="order-2 flex flex-col gap-24 border-b border-white/10 px-24 py-32 lg:flex-1 lg:border-x lg:border-b-0 lg:py-48 lg:px-[57px]">
          <div className="flex flex-col text-body-medium text-text-ondark-secondary">
            <p>Also known as Mari Dive Cruise. Owned and operated by</p>
            <p>PT Wisata Laut Indah</p>
            <p>Bali, Indonesia</p>
          </div>

          <div className="flex w-full flex-col gap-[6px] rounded bg-background-ondark-surface px-16 py-8">
            <a href="tel:+6282247511537" className="group flex items-center gap-12">
              <span aria-hidden="true" className="block size-[15px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-whatsapp.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              <span className="text-body-medium text-accent-ondark-primary transition-colors duration-300 ease-in-out group-hover:text-accent-ondark-onprimarymuted">+62 822 4751 1537</span>
            </a>
            <a href="mailto:info@mari-liveaboard.com" className="group flex items-center gap-12">
              <span aria-hidden="true" className="block size-[15px] shrink-0 bg-accent-ondark-primary [mask-image:url('/assets/icon-email.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
              <span className="text-body-medium text-accent-ondark-primary transition-colors duration-300 ease-in-out group-hover:text-accent-ondark-onprimarymuted">info@mari-liveaboard.com</span>
            </a>
          </div>

          <div className="flex gap-[10px]">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.label} href="#" aria-label={social.label} className="group flex size-32 items-center justify-center rounded-full border border-[var(--beige-400)] transition-colors duration-300 ease-in-out hover:bg-white/5">
                <span aria-hidden="true" className="block size-[14px] shrink-0 bg-[var(--beige-400)]" style={{ maskImage: `url('${social.icon}')`, maskPosition: 'center', maskRepeat: 'no-repeat', maskSize: 'contain' }} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" data-reveal className="order-1 flex flex-col gap-4 border-b border-white/10 px-24 py-32 lg:order-3 lg:flex-1 lg:items-end lg:border-b-0 lg:py-48 lg:pl-[56px] lg:pr-[72px]">
          {/* /schedule-rates: route not built yet, linked anyway per the established convention
              (FAQ links /faq the same way; the Trips CTA already links this route). Was a bare
              "#schedule-rates" hash — caught by the 2026-07-22 drk-seo pass as a dead anchor. */}
          <a href="/schedule-rates" className="text-body-medium text-text-ondark-primary transition-colors duration-300 ease-in-out hover:text-accent-ondark-primary lg:text-right">Schedule &amp; Rates</a>
          <a href="#" className="text-body-medium text-text-ondark-primary transition-colors duration-300 ease-in-out hover:text-accent-ondark-primary lg:text-right">Terms &amp; Conditions</a>
          <a href="#" className="text-body-medium text-text-ondark-primary transition-colors duration-300 ease-in-out hover:text-accent-ondark-primary lg:text-right">Onboard Prices</a>
          <a href="#faq" className="text-body-medium text-text-ondark-primary transition-colors duration-300 ease-in-out hover:text-accent-ondark-primary lg:text-right">FAQ</a>
        </nav>
      </div>

      <div className="w-full border-t border-white/10 bg-background-ondark-muted">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-4 px-24 py-12 text-center lg:flex-row lg:justify-between lg:px-64 lg:text-left">
          <p className="text-caption-label text-[var(--chocolate-300)]">&copy; 2026 Mari Liveaboard by PT Wisata Laut Indah</p>
          <p className="text-caption-label text-[var(--chocolate-300)]">Website by ATLAS</p>
        </div>
      </div>
    </footer>
  )
}
