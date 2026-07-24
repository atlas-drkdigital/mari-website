// Why Us expanding cards — desktop only in effect (mobile is a CSS scroll-carousel; the data-active it
// sets is ignored below lg since the grow variant is lg-gated). Generic + reusable: works for every
// [data-whyus] section on the page, so the same markup can be dropped on other pages unchanged.
// Hovering/focusing a card makes it active (expands to ~50% + fades its description in via CSS group-data
// variants). NO default-active card (2026-07-07, Adinda's explicit correction to the original spec): all
// four stay equal-width with no description showing until the cursor/focus actually lands on one; leaving
// the track clears the active state entirely rather than reverting to the first card.
document.querySelectorAll("[data-whyus]").forEach((section) => {
  const track = section.querySelector("[data-whyus-track]");
  const cards = Array.from(section.querySelectorAll("[data-whyus-card]"));
  if (!track || !cards.length) return;

  const setActive = (card) => {
    cards.forEach((c) => (c === card ? c.setAttribute("data-active", "") : c.removeAttribute("data-active")));
  };
  const clearActive = () => cards.forEach((c) => c.removeAttribute("data-active"));

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => setActive(card));
    card.addEventListener("focusin", () => setActive(card));
  });
  track.addEventListener("mouseleave", clearActive);

  // Pointer drag-to-scroll (mouse "grab and slide") — native touch scroll already works on its own, so
  // touch pointers are left alone here. A no-op at >=lg (track is overflow-visible there).
  // The jank in the first pass came from CSS scroll-snap fighting the manual scrollLeft writes mid-drag
  // (the browser kept trying to pull the track back toward the nearest snap point every frame). Fixed by
  // suspending snap for the duration of the drag and re-enabling it on release, letting the browser's own
  // snap settle smoothly to the nearest card afterward — the standard pattern for JS drag-scroll on a
  // snap-enabled track (same approach Splide/Swiper-style implementations use).
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
    track.style.scrollSnapType = ""; // restore snap; browser settles smoothly to the nearest card
  };

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return; // native touch scrolling handles touch
    dragging = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.style.scrollSnapType = "none"; // suspend snap so it doesn't fight the drag
  });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  track.addEventListener("dragstart", (e) => e.preventDefault()); // stop native image-drag ghosting
});
