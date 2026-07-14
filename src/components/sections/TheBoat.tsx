import Image from 'next/image'

// Ported from ../v1-static-homepage/sections/the-boat.html. Figma Home/Section/The Boat
// 218:1327 — homepage teaser linking out to the full boat page (not built yet, href="#").
// Pure hover effect (CSS scale), no interactivity — Server Component.
export function TheBoat() {
  return (
    <section id="the-boat" aria-labelledby="the-boat-heading" className="flex w-full items-center bg-bg-page py-96 lg:py-80 min-h-[min(100dvh,1080px)]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-48 page-gutter-x lg:flex-row lg:gap-64">
        <a
          href="#"
          aria-label="Learn more about the Mari phinisi"
          data-reveal
          className="group/boat relative block aspect-[529/794] w-full overflow-hidden lg:w-[48%] lg:shrink-0"
        >
          <Image
            src="/assets/the-boat.webp"
            alt="The Mari phinisi under sail against a clear blue sky"
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover transition-transform duration-[1100ms] ease-in-out group-hover/boat:scale-105"
          />
        </a>

        <div className="flex flex-1 flex-col gap-24" data-reveal="left">
          <div className="flex flex-col gap-24">
            <p className="text-eyebrow uppercase text-text-eyebrow">The Boat</p>
            <h2 id="the-boat-heading" className="text-display-h2 text-text-primary">Traditional phinisi liveaboard for serious divers</h2>
          </div>
          <div className="flex flex-col gap-16 text-body-large text-text-primary">
            <p>Explore Indonesia&rsquo;s most renowned dive destinations, from Komodo and Flores to the Banda Sea, Raja Ampat, and beyond aboard a premium 30-meter ironwood Phinisi.</p>
            <p>With experienced dive guides, tons of spaces to share, comfortable cabins, delicious hearty food, and a professional crew of 14 to cater to your needs, you&rsquo;re guaranteed an excellent dive liveaboard experience in Indonesia&rsquo;s top destinations aboard the Mari.</p>
          </div>
          <a href="#" className="group inline-flex w-fit items-center gap-4 border-b border-action-primary py-4 text-button-small uppercase text-action-primary transition-colors duration-300 ease-in-out hover:border-accent-muted hover:text-accent-muted">
            More about the boat
            <span aria-hidden="true" className="block size-[16px] shrink-0 bg-action-primary transition-[background-color,transform] duration-300 ease-in-out group-hover:translate-x-[2px] group-hover:bg-accent-muted [mask-image:url('/assets/icon-arrow-forward.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
          </a>
        </div>
      </div>
    </section>
  )
}
