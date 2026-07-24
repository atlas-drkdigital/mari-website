// Testimonials card track — mobile drag-to-scroll (mouse "grab and slide"; native touch scroll already
// works on its own) plus desktop/mobile prev/next arrows that advance by one card. Same drag pattern
// as assets/why-us.js and assets/latest-articles.js.
// Arrows use scrollIntoView on the TARGET card. Tried `behavior:'smooth'` first (matches this site's
// default luxury-ease-everything convention) but it never actually completed in testing — stuck at ~2px
// regardless of wait time (tested up to 3s) or whether scroll-snap was suspended first, while
// `behavior:'instant'` reliably worked every time. Given real functional certainty matters more than an
// animation I can't confirm actually runs, this uses 'instant' deliberately — not a placeholder, a
// verified choice. The drag interaction (below) is unaffected and still tracks the pointer smoothly in
// real time; only the arrow-click jump is instant.
// LINEAR carousel (2026-07-05, not infinite like Destinations — Adinda explicitly doesn't want wraparound
// here). Both arrows hide entirely if the track has no overflow at all (nothing to scroll — e.g. very few
// cards on a wide screen); otherwise prev/next individually disable+fade at the start/end rather than
// wrapping around. `disabled` (not just a class) so it's also unclickable/unfocusable, not just dimmed.
document.querySelectorAll("[data-testimonials]").forEach((section) => {
  const track = section.querySelector("[data-testimonial-track]");
  if (!track) return;
  const cards = Array.from(track.querySelectorAll("article"));
  if (!cards.length) return;
  const prevBtn = section.querySelector("[data-testimonial-prev]");
  const nextBtn = section.querySelector("[data-testimonial-next]");

  const currentIndex = () => {
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0, closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    return closest;
  };

  const goTo = (dir) => {
    const next = Math.min(cards.length - 1, Math.max(0, currentIndex() + dir));
    cards[next].scrollIntoView({ behavior: "instant", block: "nearest", inline: "start" });
    updateArrows();
  };

  const updateArrows = () => {
    const hasOverflow = track.scrollWidth > track.clientWidth + 1;
    [prevBtn, nextBtn].forEach((btn) => { if (btn) btn.hidden = !hasOverflow; });
    if (!hasOverflow) return;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    if (prevBtn) prevBtn.disabled = atStart;
    if (nextBtn) nextBtn.disabled = atEnd;
  };

  prevBtn?.addEventListener("click", () => goTo(-1));
  nextBtn?.addEventListener("click", () => goTo(1));
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  let dragging = false, startX = 0, startScroll = 0, rafId = null;

  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      track.scrollLeft = startScroll - dx;
      rafId = null;
    });
  };
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    track.style.scrollSnapType = "";
  };

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return; // native touch scrolling handles touch
    dragging = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.style.scrollSnapType = "none";
  });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  track.addEventListener("dragstart", (e) => e.preventDefault());

  // Read More expand/collapse — height-animated via the grid-template-rows 0fr->1fr trick (same as the
  // FAQ accordion), so a card's own natural content height drives the animation with no fixed value to
  // guess. Cards are default flex `align-items: stretch` (no explicit override), so when one card grows
  // taller, its row siblings — and the section as a whole — stretch to match automatically; no extra CSS
  // needed for "the container expands accordingly."
  cards.forEach((card) => {
    const toggle = card.querySelector("[data-testimonial-readmore]");
    const more = card.querySelector("[data-testimonial-more]");
    if (!toggle || !more) return;
    let expanded = false;
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      more.classList.toggle("grid-rows-[1fr]", expanded);
      more.classList.toggle("grid-rows-[0fr]", !expanded);
      toggle.textContent = expanded ? "Read less" : "Read more";
    });
  });
});
