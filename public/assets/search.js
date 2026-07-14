// Destination search — static phase only.
// Desktop (>=lg): CSS :focus-within reveals an inline dropdown; typing filters it, clicking fills the field.
// Mobile (<lg): tapping the field opens the #mobile-search full-screen takeover instead of focusing in place.
// The real search / autocomplete arrives as a component in the Next.js migration.
function wireFilterList(input, list, onSelect) {
  const items = Array.from(list.querySelectorAll("li"));
  const nameOf = (li) => (li.querySelector("span")?.textContent || li.textContent || "").trim();

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    items.forEach((li) => {
      li.hidden = q !== "" && !nameOf(li).toLowerCase().includes(q);
    });
  });

  items.forEach((li) => {
    li.querySelector("button")?.addEventListener("click", () => {
      onSelect(nameOf(li));
      items.forEach((i) => (i.hidden = false));
    });
  });
}

document.querySelectorAll("[data-search]").forEach((root) => {
  const input = root.querySelector("[data-search-input]");
  const list = root.querySelector("ul");
  if (!input || !list) return;
  wireFilterList(input, list, (name) => {
    input.value = name;
    input.blur();
  });
});

// Mobile full-screen takeover — opened from the hero's search field instead of the inline dropdown.
const mobileSearch = document.getElementById("mobile-search");
const heroInput = document.querySelector("[data-search-input]");

if (mobileSearch && heroInput) {
  const mobileInput = mobileSearch.querySelector("[data-search-mobile-input]");
  const mobileList = mobileSearch.querySelector("[data-search-mobile-list]");
  const mq = window.matchMedia("(max-width: 1023.98px)");

  const open = () => {
    mobileSearch.classList.remove("hidden");
    mobileSearch.classList.add("flex");
    document.documentElement.classList.add("overflow-hidden");
    if (mobileInput) mobileInput.value = heroInput.value;
    // Focus the MODAL itself (tabindex="-1" in the markup), not the input -- focusing a text input
    // immediately triggers the on-screen keyboard before the user has even seen the destinations list,
    // which is both poor UX and a suspected contributor to the iOS viewport-height glitches (the keyboard
    // animating in at the exact moment the modal opens/resizes). The user now taps the input themselves
    // when they actually want to type, same as any normal list-then-search pattern. Focusing the modal
    // container (rather than leaving focus on whatever was behind it) still satisfies the accessibility
    // requirement that opening a modal moves focus somewhere inside it.
    mobileSearch.focus();
  };

  const close = () => {
    mobileSearch.classList.add("hidden");
    mobileSearch.classList.remove("flex");
    document.documentElement.classList.remove("overflow-hidden");
    // NOT returning focus to heroInput here: it has its own `focus` listener bound to openOnMobile below,
    // so calling heroInput.focus() on close would immediately re-open this same takeover -- an infinite
    // loop. Left unchanged from the original (pre-existing) behavior, which didn't move focus on close
    // either -- only the open-side auto-focus-into-the-keyboard behavior was actually the ask here.
  };

  // `click` fires after every input method (mouse, touch, keyboard activation) with no timing
  // races, unlike mousedown+preventDefault (which a first pass relied on and turned out unreliable
  // across touch/emulated-touch browsers). `focus` is kept as a second, redundant safety net for
  // keyboard-only Tab navigation. Both just blur the real field and open the overlay — harmless if
  // both happen to fire for the same interaction.
  const openOnMobile = () => {
    if (!mq.matches) return;
    heroInput.blur();
    open();
  };
  heroInput.closest("[data-search]")?.addEventListener("click", openOnMobile);
  heroInput.addEventListener("focus", openOnMobile);

  if (mobileInput && mobileList) {
    wireFilterList(mobileInput, mobileList, (name) => {
      heroInput.value = name;
      close();
    });
  }

  mobileSearch.querySelector("[data-search-close]")?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileSearch.classList.contains("hidden")) close();
  });
}
