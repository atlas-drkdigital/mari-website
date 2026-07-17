import { RichText } from '@/components/RichText'
import type { BoatData } from '@/sanity/queries'

// Figma Section/FAQ = 778:8902 (on the boat page).
//
// NOT the homepage's <Faq> component: that one is hard-coupled to HomePageData and reads the
// "featured" questions across all types. Generalising it is a real refactor with homepage risk, so
// it's deliberately deferred — see _POLISH-BACKLOG.md. This renders the boat's OWN faqSections.
//
// SEO/AEO shape per drk-seo's aeo-considerations.md, folded in-slice rather than left to an
// end-pass:
//   - native <details>/<summary>, no ARIA stacked on top (the element carries the semantics)
//   - a real heading per question, so each Q is an outline entry rather than bold text
//   - a stable #anchor per Q&A, so an answer engine can cite the exact question
// The FAQPage JSON-LD is emitted by the page, not here — it must be scoped per page, and only the
// page knows the full question set.
export function BoatFaq({ boat }: { boat: BoatData }) {
  const sections = (boat.faqSections ?? []).filter((s) => s.questions?.length)
  if (!sections.length) return null

  return (
    <section id="faq" aria-labelledby="boat-faq-heading" className="w-full bg-bg-page py-[120px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-48 page-gutter-x">
        <h2 id="boat-faq-heading" className="text-display-h2 text-text-primary">
          Frequently asked questions
        </h2>

        {sections.map((section) => (
          <div key={section._key} className="flex flex-col gap-16">
            {section.title ? (
              <h3 className="text-display-h3 text-text-primary">{section.title}</h3>
            ) : null}
            <div className="flex flex-col">
              {(section.questions ?? []).map((q, i) => {
                const anchor = slugifyQuestion(q.question) || `q-${i}`
                return (
                  <details key={anchor} id={anchor} className="group border-b-[0.75px] border-accent-subtle">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-16 py-24 marker:hidden">
                      <h4 className="text-body-large text-text-primary">{q.question}</h4>
                      <span
                        aria-hidden="true"
                        className="text-text-secondary transition-transform duration-300 ease-in-out group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    {q.answer?.length ? (
                      <div className="flex flex-col gap-16 pb-24 text-body-base text-text-primary">
                        <RichText value={q.answer} />
                      </div>
                    ) : null}
                  </details>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Anchors derive from the question text so they're readable and citable. They shift if the question
// is reworded — acceptable here (no external links to these yet); revisit if that changes.
function slugifyQuestion(question?: string): string {
  if (!question) return ''
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}
