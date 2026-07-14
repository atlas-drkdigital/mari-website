// Destinations slideshow — crossfade between full-bleed slides (not a physical scroll track), so "infinite"
// next/prev is just the destination index wrapping with modulo — no scroll-clone trickery needed.
// Backgrounds ([data-dest-bg]) and content ([data-dest-content]) are separate stacked layers (content sits
// in its own flex-1 "stage" so top/bottom content can anchor independently — see destinations.html) but both
// key off the same destination list, so one setActive() drives both.
// Mobile: swipe/drag on the stage also switches destinations (same grab-and-slide feel as Why Us), since
// tabs + arrows alone weren't a strong enough affordance on touch.
document.querySelectorAll("[data-destinations]").forEach((section) => {
  const backgrounds = Array.from(section.querySelectorAll("[data-dest-bg]"));
  const contents = Array.from(section.querySelectorAll("[data-dest-content]"));
  const tabs = Array.from(section.querySelectorAll("[data-dest-tab]"));
  const keys = backgrounds.map((s) => s.dataset.destBg);
  if (!keys.length) return;

  let index = Math.max(0, keys.indexOf(contents.find((c) => c.hasAttribute("data-active"))?.dataset.destContent));

  const setActive = (newIndex) => {
    index = ((newIndex % keys.length) + keys.length) % keys.length; // wrap both directions
    const key = keys[index];

    backgrounds.forEach((bg) => {
      const active = bg.dataset.destBg === key;
      bg.classList.toggle("opacity-100", active);
      bg.classList.toggle("opacity-0", !active);
    });

    contents.forEach((content) => {
      const active = content.dataset.destContent === key;
      content.classList.toggle("opacity-100", active);
      content.classList.toggle("opacity-0", !active);
      if (active) {
        content.removeAttribute("inert");
        content.setAttribute("data-active", "");
      } else {
        content.setAttribute("inert", "");
        content.removeAttribute("data-active");
      }
    });

    tabs.forEach((tab) => {
      const active = tab.dataset.destTab === key;
      tab.classList.toggle("border-text-ondark-primary", active);
      tab.classList.toggle("text-text-ondark-primary", active);
      tab.classList.toggle("border-text-ondark-primary/40", !active);
      tab.classList.toggle("text-text-ondark-primary/40", !active);
      if (active) {
        tab.setAttribute("data-active", "");
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      } else {
        tab.removeAttribute("data-active");
      }
    });
  };

  section.querySelector("[data-dest-prev]")?.addEventListener("click", () => setActive(index - 1));
  section.querySelector("[data-dest-next]")?.addEventListener("click", () => setActive(index + 1));

  // Swipe/drag to switch destinations (mobile touch + mouse drag alike). touch-action:pan-y (see
  // destinations.html) lets the browser's own vertical page-scroll gesture win immediately, so this only
  // ever fires for genuinely horizontal drags — without it, a touch that starts ambiguous can get claimed
  // by native scrolling before our own delta threshold ever fires, which is why this didn't work on real
  // touch devices even though simulated pointer-event tests passed.
  // DRAG-FOLLOW (2026-07-05, round 2): round 1 translated the whole background stack as one shared unit —
  // this revealed the section's own navy background color underneath while dragging, since only the ACTIVE
  // layer is ever opacity-100 and the "incoming" layer doesn't exist visually until setActive's crossfade
  // runs on release (Adinda caught this via screenshot). Fixed by translating INDIVIDUAL layers instead of
  // the shared wrapper: the active background slides out by `dx` same as before, but the "incoming" layer
  // (next or prev, based on drag direction) is also temporarily revealed, starting just off-screen and
  // sliding in as the drag progresses — a real two-photo slide instead of one photo sliding over a gap.
  // Handles direction reversal mid-drag (swaps which layer is "incoming", resets the old one) and
  // interrupted drags (pointercancel resets everything, same as a below-threshold release) — both tested.
  const stage = section.querySelector("[data-dest-stage]");
  if (stage) {
    let startX = 0, dragging = false, moved = 0, incomingBg = null, incomingDir = 0;

    const bgAt = (i) => {
      const key = keys[((i % keys.length) + keys.length) % keys.length];
      return backgrounds.find((bg) => bg.dataset.destBg === key);
    };

    const clearIncoming = () => {
      if (!incomingBg) return;
      incomingBg.style.transition = "";
      incomingBg.style.transform = "";
      incomingBg.classList.remove("opacity-100");
      incomingBg.classList.add("opacity-0");
      incomingBg = null;
      incomingDir = 0;
    };

    const setDragTransform = (dx, animated) => {
      const transition = animated ? "transform 300ms cubic-bezier(0.65,0,0.35,1)" : "none";
      const activeBg = bgAt(index);
      const width = stage.getBoundingClientRect().width || window.innerWidth;

      stage.style.transition = transition;
      stage.style.transform = dx ? `translateX(${dx}px)` : "";
      if (activeBg) {
        activeBg.style.transition = transition;
        activeBg.style.transform = dx ? `translateX(${dx}px)` : "";
      }

      const dir = dx < 0 ? 1 : dx > 0 ? -1 : 0; // 1 = revealing next (dragging left), -1 = revealing prev
      if (dir !== 0 && dir !== incomingDir) {
        clearIncoming();
        incomingDir = dir;
        incomingBg = bgAt(index + dir);
        if (incomingBg) {
          incomingBg.classList.remove("opacity-0");
          incomingBg.classList.add("opacity-100");
        }
      }
      if (incomingBg) {
        incomingBg.style.transition = transition;
        const startOffset = dir === 1 ? width : -width;
        incomingBg.style.transform = `translateX(${startOffset + dx}px)`;
      }
    };

    const resetDragStyles = () => {
      [stage, bgAt(index)].forEach((el) => {
        if (!el) return;
        el.style.transition = "";
        el.style.transform = "";
      });
      clearIncoming();
    };

    stage.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = 0;
      startX = e.clientX;
      incomingDir = 0;
      setDragTransform(0, false);
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      moved = e.clientX - startX;
      setDragTransform(moved, false);
    });
    window.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      const THRESHOLD = 50;
      const crossed = moved <= -THRESHOLD ? 1 : moved >= THRESHOLD ? -1 : 0;
      if (crossed !== 0) {
        // Threshold crossed: hand off to the crossfade SYNCHRONOUSLY, not via the delayed cleanup below.
        // Bug found 2026-07-05: the delayed resetDragStyles (below, for the cancelled-drag case) reads
        // `index` when it actually RUNS, 320ms later — but setActive() changes `index` synchronously,
        // right here, before that timeout ever fires. If `incomingBg` happens to be the SAME element
        // setActive just faded in as the new active layer, the delayed cleanup's clearIncoming() would
        // wrongly flip its opacity back to 0 right after the fade-in completed (a flicker-then-blank).
        // Clearing every drag-related inline style up front, before setActive runs, means there's nothing
        // left for a stray delayed callback to corrupt — setActive's own class-based crossfade is the only
        // thing touching opacity from this point on.
        [stage, bgAt(index), incomingBg].forEach((el) => {
          if (!el) return;
          el.style.transition = "";
          el.style.transform = "";
        });
        if (incomingBg) {
          incomingBg.classList.remove("opacity-100");
          incomingBg.classList.add("opacity-0");
        }
        incomingBg = null;
        incomingDir = 0;
        setActive(index + crossed);
      } else {
        // Didn't cross the threshold: cancel the peek, spring everything back to neutral. `index` never
        // changes in this branch, so the delayed cleanup can't race against anything.
        setDragTransform(0, true);
        window.setTimeout(resetDragStyles, 320);
      }
    });
    window.addEventListener("pointercancel", () => {
      if (!dragging) return;
      dragging = false;
      setDragTransform(0, true);
      window.setTimeout(resetDragStyles, 320);
    });
    stage.addEventListener("dragstart", (e) => e.preventDefault());
  }

  // Tab list drag-to-scroll (grab and slide) — same pattern as Why Us's mobile carousel, with one
  // important difference: this list has CSS scroll-behavior:smooth (for the tab-click scrollIntoView
  // above), and a direct `tablist.scrollLeft = x` assignment fights that — every rapid rAF-driven update
  // during a drag tries to kick off its own smooth-scroll animation instead of jumping instantly, so the
  // position never actually catches up to the pointer (confirmed: direct assignment silently no-ops here,
  // while scrollTo(..., {behavior:'instant'}) works correctly). Using scrollTo+instant sidesteps it.
  const tablist = section.querySelector("[data-dest-tablist]");
  if (tablist) {
    let tabDown = false, tabMoved = false, tabStartX = 0, tabStartScroll = 0, tabRafId = null;
    const onTabMove = (e) => {
      if (!tabDown) return;
      const dx = e.clientX - tabStartX;
      if (Math.abs(dx) > 4) tabMoved = true;
      if (tabRafId) return;
      tabRafId = requestAnimationFrame(() => {
        tablist.scrollTo({ left: tabStartScroll - dx, behavior: "instant" });
        tabRafId = null;
      });
    };
    const endTabDrag = () => {
      tabDown = false;
    };
    tablist.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return; // native touch scrolling handles touch
      tabDown = true;
      tabMoved = false;
      tabStartX = e.clientX;
      tabStartScroll = tablist.scrollLeft;
    });
    window.addEventListener("pointermove", onTabMove);
    window.addEventListener("pointerup", endTabDrag);
    window.addEventListener("pointercancel", endTabDrag);
    tablist.addEventListener("dragstart", (e) => e.preventDefault());
    tabs.forEach((tab, i) => tab.addEventListener("click", () => {
      if (tabMoved) return; // this click was the tail end of a drag, not a real tap
      setActive(i);
    }));
  } else {
    tabs.forEach((tab, i) => tab.addEventListener("click", () => setActive(i)));
  }
});
