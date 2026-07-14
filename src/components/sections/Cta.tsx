import Image from 'next/image'

// Ported from ../v1-static-homepage/sections/cta.html. Figma Section/CTA 401:2438.
// Whole card (photo, heading, body, link text) is ONE <a> — not a card with a nested link,
// per Adinda's explicit "the entire image, as well as Find Out More, should be clickable."
export function Cta() {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="w-full">
      <h2 id="cta-heading" className="sr-only">Book your Mari Liveaboard trip</h2>
      <div className="flex w-full flex-col lg:flex-row">
        <a
          href="#"
          data-reveal
          className="group/cta relative isolate flex h-[calc(50dvh-28px)] w-full flex-col justify-between overflow-hidden px-24 pb-[56px] pt-64 lg:h-[669px] lg:w-1/2 lg:px-64 lg:pb-[88px] lg:pt-96"
        >
          <Image src="/assets/cta-private-charter.webp" alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-700 ease-in-out group-hover/cta:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background-ondark-page/40" />

          <div className="flex max-w-[480px] flex-col gap-16">
            <h3 className="text-display-h2 text-text-ondark-primary">Book a private charter</h3>
            <p className="text-body-medium lg:text-body-large text-text-ondark-primary">Charter the entire boat for a private liveaboard adventure in Indonesia. Full itinerary flexibility, exclusive use, up to 14 guests.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-4 border-b border-border-onimage-primary py-4 text-button-small uppercase text-text-ondark-primary">
            Find Out More
            <span aria-hidden="true" className="block size-[16px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover/cta:translate-x-[2px] [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </span>
        </a>

        <a
          href="#"
          data-reveal
          className="group/cta relative isolate flex h-[calc(50dvh-28px)] w-full flex-col justify-between overflow-hidden px-24 pb-[56px] pt-64 lg:h-[669px] lg:w-1/2 lg:px-64 lg:pb-[88px] lg:pt-96"
        >
          <Image src="/assets/cta-shared-trip.webp" alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-700 ease-in-out group-hover/cta:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-background-ondark-page/40" />

          <div className="flex max-w-[480px] flex-col gap-16">
            <h3 className="text-display-h2 text-text-ondark-primary">Join a shared diving trip</h3>
            <p className="text-body-medium lg:text-body-large text-text-ondark-primary">Join a scheduled dive cruise departure and dive Indonesia&rsquo;s best waters alongside fellow divers</p>
          </div>
          <span className="inline-flex w-fit items-center gap-4 border-b border-border-onimage-primary py-4 text-button-small uppercase text-text-ondark-primary">
            Find a Trip
            <span aria-hidden="true" className="block size-[16px] shrink-0 bg-text-ondark-primary transition-transform duration-300 ease-in-out group-hover/cta:translate-x-[2px] [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </span>
        </a>
      </div>
    </section>
  )
}
