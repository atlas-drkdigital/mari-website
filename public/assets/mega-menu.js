// Desktop mega menus (Destinations, Resources) — static phase: no routing, buttons just swap the preview.
// Click-only to open/close (not hover) — matches the explicit "Close" affordance in the Figma panel.
// Only one menu open at a time. The header's dark appearance while open, the "thin white line" divider, and
// each trigger's amber label + rotated chevron are ALL pure CSS now, driven off the header's data-nav="mega"
// state (set via window.MariNav.setMegaOpen) and each trigger's aria-expanded — see nav.html. This file only
// toggles panel visibility, aria-expanded, and reports "any menu open?" to the nav theme controller.
(() => {
  const menus = [];

  const syncNavTheme = () => window.MariNav?.setMegaOpen(menus.some((m) => m.isOpen()));

  function createMegaMenu(key, { onOpen } = {}) {
    const trigger = document.querySelector(`[data-mega-trigger="${key}"]`);
    const panel = document.getElementById(`mega-menu-${key}`);
    if (!trigger || !panel) return null;

    let open = false;

    const close = () => {
      if (!open) return;
      open = false;
      panel.classList.add("hidden");
      panel.classList.remove("flex");
      trigger.setAttribute("aria-expanded", "false");
      // reset the slide-in so it replays fresh next time the panel opens
      panel.querySelectorAll("[data-reveal]").forEach((el) => el.removeAttribute("data-revealed"));
      syncNavTheme();
    };

    const openMenu = () => {
      if (open) return;
      menus.forEach((m) => m !== menu && m.close());
      open = true;
      panel.classList.remove("hidden");
      panel.classList.add("flex");
      trigger.setAttribute("aria-expanded", "true");
      // wait a frame so the display change registers first, else the transition can't play
      requestAnimationFrame(() => {
        panel.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", ""));
      });
      syncNavTheme();
      onOpen?.();
    };

    trigger.addEventListener("click", () => (open ? close() : openMenu()));
    panel.querySelector("[data-mega-close]")?.addEventListener("click", close);

    const menu = { trigger, panel, isOpen: () => open, open: openMenu, close };
    menus.push(menu);
    return menu;
  }

  // Destinations — image/overlay crossfade per hovered or focused item.
  const destPanel = document.getElementById("mega-menu-destinations");
  if (destPanel) {
    const items = Array.from(destPanel.querySelectorAll("[data-dest-item]"));
    const layers = Array.from(destPanel.querySelectorAll("[data-dest-layer], [data-dest-overlay]"));
    const defaultDest = items[0]?.dataset.destItem;

    const setActiveDestination = (dest) => {
      items.forEach((item) => {
        const active = item.dataset.destItem === dest;
        item.querySelector("[data-dest-name]")?.classList.toggle("text-accent-ondark-muted", active);
        item.querySelector("[data-dest-name]")?.classList.toggle("text-text-ondark-primary", !active);
        item.querySelector("[data-dest-tagline]")?.classList.toggle("text-text-ondark-primary", active);
        item.querySelector("[data-dest-tagline]")?.classList.toggle("text-text-ondark-primary/40", !active);
      });
      layers.forEach((el) => {
        const active = (el.dataset.destLayer || el.dataset.destOverlay) === dest;
        el.classList.toggle("opacity-100", active);
        el.classList.toggle("opacity-0", !active);
        // subtle zoom-in on the active destination image only (not the text overlay)
        if (el.hasAttribute("data-dest-layer")) el.classList.toggle("scale-105", active);
      });
    };

    // Scroll affordance — see nav.html's comment above the two overlay divs for the full rationale.
    // Bottom "scroll for more" fade is the default; swaps to a top "scroll to top" fade once scrolled to
    // the very bottom. Hidden entirely (both) if the list doesn't overflow — nothing to scroll.
    const list = destPanel.querySelector("[data-dest-list]");
    const moreHint = destPanel.querySelector("[data-dest-scroll-more]");
    const topHint = destPanel.querySelector("[data-dest-scroll-top]");
    const updateScrollHints = () => {
      if (!list || !moreHint || !topHint) return;
      const hasOverflow = list.scrollHeight > list.clientHeight + 1;
      if (!hasOverflow) {
        moreHint.classList.remove("opacity-100");
        moreHint.classList.add("opacity-0");
        topHint.classList.remove("opacity-100");
        topHint.classList.add("opacity-0");
        return;
      }
      const atBottom = list.scrollTop >= list.scrollHeight - list.clientHeight - 1;
      moreHint.classList.toggle("opacity-100", !atBottom);
      moreHint.classList.toggle("opacity-0", atBottom);
      topHint.classList.toggle("opacity-100", atBottom);
      topHint.classList.toggle("opacity-0", !atBottom);
    };

    createMegaMenu("destinations", {
      onOpen: () => {
        setActiveDestination(defaultDest);
        // panel was `display:none` until now, so scrollHeight/clientHeight only measure correctly once
        // it's actually visible — recheck on every open, not just once at page load.
        requestAnimationFrame(updateScrollHints);
      },
    });
    items.forEach((item) => {
      const activate = () => setActiveDestination(item.dataset.destItem);
      item.addEventListener("mouseenter", activate);
      item.addEventListener("focus", activate);
    });

    if (list) {
      list.addEventListener("scroll", updateScrollHints, { passive: true });
      window.addEventListener("resize", updateScrollHints);
      updateScrollHints();
    }
  }

  // Resources — plain list, no per-item behavior.
  createMegaMenu("resources");

  document.addEventListener("click", (e) => {
    menus.forEach((m) => {
      if (!m.isOpen()) return;
      if (!m.panel.contains(e.target) && !m.trigger.contains(e.target)) m.close();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menus.forEach((m) => m.isOpen() && m.close());
  });
})();
