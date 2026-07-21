'use client'

import { useState } from 'react'

import { MultiSelect } from '@/components/MultiSelect'
import type { DestinationCardData, SiteSettingsContact } from '@/sanity/queries'

// Ported from ../v1-static-homepage/sections/contact.html + assets/contact.js. Figma
// Section/ContactUs 401:3397. Static/backend-less placeholder — no submit endpoint exists
// yet (this lands with real backend wiring, not this pass). Preferred Departure Month is a
// rolling 12-month window from the current month + a final "Later" catch-all, not a fixed
// historical list — computed at render time, not hardcoded.
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function rollingMonths() {
  const now = new Date()
  const months: string[] = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push(`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`)
  }
  months.push('Later')
  return months
}

const GUEST_OPTIONS = [...Array.from({ length: 14 }, (_, i) => String(i + 1)), '14+']

export function Contact({ settings, destinations }: { settings: SiteSettingsContact | null; destinations: DestinationCardData[] }) {
  const eyebrow = settings?.contactEyebrow ?? ''
  const heading = settings?.contactHeading ?? ''
  const intro = settings?.contactIntro ?? ''

  const [submitted, setSubmitted] = useState(false)
  const [guests, setGuests] = useState('')

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate w-full bg-bg-page px-24 pb-80 pt-80 md:px-48 lg:px-80 lg:pb-160 lg:pt-[104px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--texture-light)] [background-size:720px_auto] bg-repeat opacity-20" />
      <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-[28px] lg:gap-48">
        <div data-reveal className="flex w-full flex-col gap-16">
          <div className="flex flex-col gap-32">
            <p className="text-eyebrow uppercase text-action-primary">{eyebrow}</p>
            <h2 id="contact-heading" className="max-w-[560px] text-display-h2 text-text-primary">{heading}</h2>
          </div>
          <p className="text-body-large text-text-primary">{intro}</p>
        </div>

        <form
          data-reveal
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (!e.currentTarget.reportValidity()) return
            setSubmitted(true)
            e.currentTarget.reset()
            setGuests('')
          }}
          className="flex w-full flex-col gap-[40px]"
        >
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-24 md:flex-row md:gap-32">
              <div className="flex flex-1 flex-col gap-12">
                <label htmlFor="contact-name" className="text-caption-label uppercase tracking-[1.5px] text-action-primary">Full Name</label>
                <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className="w-full rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-[16px] lg:text-body-large text-text-primary placeholder:text-text-secondary focus:outline-none" />
              </div>
              <div className="flex flex-1 flex-col gap-12">
                <label htmlFor="contact-email" className="text-caption-label uppercase tracking-[1.5px] text-action-primary">Email</label>
                <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="your.email@example.com" className="w-full rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-[16px] lg:text-body-large text-text-primary placeholder:text-text-secondary focus:outline-none" />
              </div>
            </div>
            <div className="flex flex-col gap-24 md:flex-row md:gap-32">
              <div className="flex flex-1 flex-col gap-12">
                <label htmlFor="contact-phone" className="text-caption-label uppercase tracking-[1.5px] text-action-primary">Phone Number (Optional)</label>
                <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="e.g. +1-1000-1234" className="w-full rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-[16px] lg:text-body-large text-text-primary placeholder:text-text-secondary focus:outline-none" />
              </div>
              <div className="flex flex-1 flex-col gap-12">
                <label htmlFor="contact-guests" className="text-caption-label uppercase tracking-[1.5px] text-action-primary">Number of Guests (Optional)</label>
                <div className="relative">
                  <select
                    id="contact-guests"
                    name="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={`w-full appearance-none rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-[16px] lg:text-body-large focus:outline-none ${guests ? 'text-text-primary' : 'text-text-secondary'}`}
                  >
                    <option value="" disabled hidden>Select guests</option>
                    {GUEST_OPTIONS.map((g) => (
                      <option key={g} value={g} className="text-text-primary">{g}</option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute right-24 top-1/2 block size-[10px] -translate-y-1/2 bg-action-primary [mask-image:url('/assets/icon-nav-chevron.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-24 md:flex-row md:gap-32">
              <MultiSelect id="contact-destinations" label="Preferred Destination (Optional)" placeholder="Select destinations" name="destinations" options={[...destinations.map((d) => d.name ?? '').filter(Boolean), 'Not sure']} />
              <MultiSelect id="contact-departure" label="Preferred Departure Month (Optional)" placeholder="Select months" name="departure_month" options={rollingMonths()} />
            </div>
            <div className="flex flex-col gap-12">
              <label htmlFor="contact-subject" className="text-caption-label uppercase tracking-[1.5px] text-action-primary">Subject</label>
              <input id="contact-subject" name="subject" type="text" required placeholder="What can we help you with?" className="w-full rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-[16px] lg:text-body-large text-text-primary placeholder:text-text-secondary focus:outline-none" />
            </div>
            <div className="flex flex-col gap-12">
              <label htmlFor="contact-message" className="text-caption-label uppercase tracking-[1.5px] text-action-primary">Message</label>
              <textarea id="contact-message" name="message" required rows={5} placeholder="Tell us about your diving experience and what you&rsquo;re looking for..." className="h-[200px] w-full resize-none rounded-xs border border-action-primary bg-bg-surface px-24 py-16 text-[16px] lg:text-body-large text-text-primary placeholder:text-text-secondary focus:outline-none" />
            </div>
          </div>

          <button type="submit" className="group inline-flex h-48 w-fit items-center gap-[6px] rounded-xs bg-background-ondark-page py-8 pl-20 pr-12 text-button-small uppercase text-text-ondark-primary transition-opacity duration-300 ease-in-out hover:opacity-85">
            Send message
            <span aria-hidden="true" className="block size-[15px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover:translate-x-[2px] [mask-image:url('/assets/icon-arrow-up-right.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </button>
        </form>

        {submitted && (
          <div role="status" className="max-w-[560px] text-center text-body-large text-action-primary">
            <p>Thank you for your message. We&rsquo;ll be in touch shortly. If you don&rsquo;t hear from us within 48 hours, please reach us at <a href="mailto:info@mari-liveaboard.com" className="underline">info@mari-liveaboard.com</a>.</p>
          </div>
        )}
      </div>
    </section>
  )
}
