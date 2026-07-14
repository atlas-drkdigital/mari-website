// Latest Articles card track — mobile-only drag-to-scroll (mouse "grab and slide"); native touch scroll
// already works on its own, so touch pointers are left alone here. A no-op at >=lg (track is
// overflow-visible there). Same pattern as assets/why-us.js's track dragging, minus the hover-expand logic
// (blog cards don't have an active/expanded state — this is scroll-only).
document.querySelectorAll("[data-blog]").forEach((section) => {
  const track = section.querySelector("[data-blog-track]");
  if (!track) return;

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
  track.addEventListener("dragstart", (e) => e.preventDefault());
});
