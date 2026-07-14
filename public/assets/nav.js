// Nav theme controller — owns the header's data-nav value ("top" | "mega" | "light"), the single source
// of truth both this file (scroll) and mega-menu.js (mega open/close) feed into. Exposed as window.MariNav
// so mega-menu.js (loaded after this) can report its open state without the two scripts fighting over the
// header's bg/text classes. Priority: an open mega menu (dark) always wins over the scrolled-light state.
(() => {
  const header = document.getElementById("nav");
  if (!header) return;

  let scrolled = false;
  let megaOpen = false;

  const apply = () => {
    header.dataset.nav = megaOpen ? "mega" : scrolled ? "light" : "top";
  };

  const recompute = () => {
    // Flip to light at a fixed scroll distance, not "wait for the whole hero to clear" — the old
    // hero.offsetHeight-based threshold meant scrolling almost the entire (near-full-viewport-tall) hero
    // before anything happened, which read as unresponsive/awkward. 80px on desktop, 40px on mobile (mobile
    // wants near-instant feedback) — both small, fixed distances, not tied to hero height at all.
    const isMobile = window.innerWidth < 1024; // matches the site's lg breakpoint
    const flipAt = isMobile ? 40 : 80;
    scrolled = window.scrollY > flipAt;
    apply();
  };

  window.MariNav = {
    setMegaOpen(v) {
      megaOpen = v;
      apply();
    },
  };

  window.addEventListener("scroll", recompute, { passive: true });
  window.addEventListener("resize", recompute);
  recompute();
})();

// Hero scroll-down arrow -> smooth-scroll to whatever the next <section> after the hero is (generic, not
// hardcoded to why-us). Skips non-section siblings (e.g. #mobile-search) and offsets for the fixed nav.
(() => {
  const btn = document.querySelector("[data-scroll-next]");
  const hero = document.getElementById("hero");
  const header = document.getElementById("nav");
  if (!btn || !hero) return;

  btn.addEventListener("click", () => {
    let el = hero.nextElementSibling;
    while (el && el.tagName !== "SECTION") el = el.nextElementSibling;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0);
    window.scrollTo({ top, behavior: "smooth" });
  });
})();

// Mobile nav toggle — lightweight vanilla JS (static phase only, no mobile Figma frame yet).
// Opens/closes the full-screen menu overlay and locks background scroll while open.
(() => {
  const menu = document.getElementById("mobile-menu");
  const opener = document.querySelector("[data-nav-open]");
  const closer = document.querySelector("[data-nav-close]");
  if (!menu || !opener || !closer) return;

  const open = () => {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    document.documentElement.classList.add("overflow-hidden");
    opener.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    document.documentElement.classList.remove("overflow-hidden");
    opener.setAttribute("aria-expanded", "false");
  };

  opener.addEventListener("click", open);
  closer.addEventListener("click", close);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.classList.contains("hidden")) close();
  });
})();

// Mobile menu accordions (Destinations / Resources) — same expand/collapse for both, matched by
// data-mobile-mega-trigger="X" / data-mobile-mega-panel="X". Independent (opening one doesn't close
// the other); no image column like the desktop mega menu, just the destination/resource list.
document.querySelectorAll("[data-mobile-mega-trigger]").forEach((trigger) => {
  const key = trigger.dataset.mobileMegaTrigger;
  const panel = document.querySelector(`[data-mobile-mega-panel="${key}"]`);
  const label = trigger.querySelector("[data-mobile-mega-label]");
  const chevron = trigger.querySelector("[data-mobile-mega-chevron]");
  if (!panel) return;

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("hidden", expanded);
    label?.classList.toggle("text-accent-ondark-muted", !expanded);
    label?.classList.toggle("text-text-ondark-primary", expanded);
    chevron?.classList.toggle("bg-accent-ondark-muted", !expanded);
    chevron?.classList.toggle("bg-text-ondark-primary", expanded);
    chevron?.classList.toggle("rotate-180", !expanded);
  });
});
