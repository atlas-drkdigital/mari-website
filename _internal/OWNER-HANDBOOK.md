# Owner handbook — quirks the site owner MUST be told (living document)

Started 2026-07-22 (Adinda's ask): a running list of behaviours that are correct-by-design but
not guessable from the Studio UI alone. **This is the source material for the final handoff
guide** given to the site owner — written as entries land, not reconstructed at handoff time.
Internal working doc (committed to the private repo since 2026-07-23's backup decision, still
never deployed); graduates into the real owner guide at handoff.

Format per entry: what the owner sees → what's actually true → what to do.

## Itineraries: the Destination field does NOT put an itinerary on a page
- **You see:** an itinerary document has a "Destination" field set to e.g. Komodo — but the
  itinerary doesn't show on the Komodo page.
- **What's true:** each destination page shows exactly the itineraries in that destination's own
  "Itineraries on this page" list (Destinations → the destination → Itineraries tab). The list's
  drag order is the display order; anything not in the list stays hidden — that's how you
  feature or retire an itinerary without deleting it. The itinerary's Destination field is
  grouping metadata (future Schedule & Rates page), not page placement.
- **Do:** to show an itinerary, add it to the destination's list. To hide it, remove it from the
  list — the itinerary document itself is untouched.

## Boats: every boat appears on every destination page (for now)
- **You see:** a new boat document shows up in the "About the Boats" section of ALL destination
  pages, and there's no per-destination boat list.
- **What's true:** the boats section auto-pulls every published boat. There is no
  "boats on this route" control yet — flagged for a future model when a second real boat exists.
- **Do:** nothing today (one real boat). Revisit before adding boat #2.

## Empty sections hide themselves — that's a feature, not a bug
- **You see:** a section (gallery, upcoming trips, itineraries…) is missing from a page.
- **What's true:** a section with no content (no gallery images, no trips embed code, empty
  itinerary list…) renders nothing, and its entry disappears from the page's section nav too.
- **Do:** fill the content in Studio and the section (and its nav item) reappears on its own.

## Defaults singletons: shared wording lives in ONE place, with {tokens}
- **You see:** section eyebrows/headings/button labels aren't on the destination (or boat)
  document.
- **What's true:** wording shared by every destination page lives in "Destination Defaults"
  (same idea: "Boat Defaults"). Type `{destination}` (or `{boat}` / `{siteName}`) and the site
  swaps in the right name per page.
- **Do:** edit shared chrome once in the Defaults document; edit per-page content on the page's
  own document.

## Boats section heading: singular and plural are two separate fields
- **You see:** "Boats heading (several boats)" AND "Boats heading (single boat)" in Destination
  Defaults.
- **What's true:** the site picks automatically by how many boats exist. Two explicit fields
  (not automatic pluralization) so every future language can write both forms correctly.
- **Do:** keep both filled.

## Private Charters "Benefits": each IMAGE is a benefit — there is no separate text list
- **You see:** the Benefits tab holds only a heading, an eyebrow, and a list of images.
- **What's true:** one image = one benefit. The image's **Benefit title** is the accordion
  heading, its **Benefit text** is the copy under it (and the caption when the image is
  enlarged), and the order of the images IS the order of the accordion. The image and the open
  accordion row always move together on the page — that's by design, not a glitch.
- **Do:** to add/reorder/remove a benefit, add/drag/delete an image. An image without a title
  is not shown anywhere.

## Rich-text images: click-to-zoom and caption alignment are automatic
- **You see:** no "zoom" toggle and no caption-alignment control on images inside body text.
- **What's true:** every image in body text opens enlarged when clicked, automatically. The
  caption sits under the image and follows the image's own **Alignment** choice (centred by
  default).
- **Do:** write the caption; pick Alignment once — it moves the image and its caption together.

## "About the Boats" text is edited ONCE, in Shared Components → Boats Section
- **You see:** the destination and Private Charters documents have no fields for this section's
  heading/eyebrow — just a note pointing elsewhere.
- **What's true:** the section is shared. Its texts live in **Shared Components → Boats Section**
  and change on every page at once. Typing `{destination}` inserts each page's own destination
  name (the Private Charters page reads it as "Indonesia"). The boat cards come from the Boats
  documents automatically.
- **Do:** edit the section's wording in Boats Section; edit a card's content on that boat's own
  document.

## Destinations carousel: order and visibility live in ONE list
- **You see:** Destinations → Destinations Section holds a drag list of destinations.
- **What's true:** the carousel (homepage + Private Charters) shows exactly this list, in this
  order. Leaving a destination out hides it from the carousel ONLY — it stays in the site search
  and the contact form on purpose.
- **Do:** drag to reorder; remove/add rows to hide/show. If the list is ever empty, the carousel
  falls back to showing every destination.

## Body text headings start at "H2" — there is deliberately no "H1" option
- **You see:** the big rich-text editor's style menu offers Normal, H2–H6 and Quote, but no H1.
- **What's true:** every page already has exactly one main heading (H1) — the big title in the
  page's hero, built from the hero fields. Search engines require one-and-only-one H1 per page,
  so the body editor doesn't offer a second one. Headings you add in body copy live UNDER the
  section they're in: start at H2 and step down without skipping levels.
- **Do:** use H2 for a body section's main subheadings, H3 inside those, and so on. If a page's
  main title needs changing, edit the hero fields, not the body.

## "Can't delete" on a destination, boat or itinerary: it's still placed somewhere
- **You see:** deleting a destination/boat/itinerary fails with a message naming another document.
- **What's true:** that item is still listed in a section (Destinations Section, Boats Section, or
  a destination's itinerary list). The block is protection — deleting it silently would change
  those pages without warning.
- **Do:** open the named document, remove the item from its list, then delete. To only HIDE it
  from a section, removing it from the list is all you need — no deletion required.
