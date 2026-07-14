// FAQ accordion — only one item open at a time, site-wide (matches the mega menu's "one panel open"
// convention). Height animation uses the grid-template-rows 0fr->1fr trick (see faq.html) instead of
// max-height, since it animates to a TRUE auto/content height with no fixed value to guess/measure —
// content-agnostic, works for any answer length without the fixed-height anti-flicker workaround Why Us
// needed. Clicking the currently-open item closes it (setActive(null) = collapse everything).
document.querySelectorAll("[data-faq]").forEach((section) => {
  const items = Array.from(section.querySelectorAll("[data-faq-item]"));

  const setActive = (target) => {
    items.forEach((item) => {
      const active = item === target;
      const trigger = item.querySelector("[data-faq-trigger]");
      const question = item.querySelector("[data-faq-question]");
      const chevron = item.querySelector("[data-faq-chevron]");
      const answer = item.querySelector("[data-faq-answer]");

      item.classList.toggle("opacity-80", !active);
      item.classList.toggle("border-border-onimage-primary", active);
      item.classList.toggle("border-accent-ondark-subtle", !active);
      if (active) item.setAttribute("data-faq-active", "");
      else item.removeAttribute("data-faq-active");

      trigger.setAttribute("aria-expanded", String(active));
      question.classList.toggle("text-editorial-h5", active);
      question.classList.toggle("text-body-large", !active);
      chevron.classList.toggle("rotate-180", active);
      answer.classList.toggle("grid-rows-[1fr]", active);
      answer.classList.toggle("grid-rows-[0fr]", !active);
    });
  };

  items.forEach((item) => {
    item.querySelector("[data-faq-trigger]").addEventListener("click", () => {
      setActive(item.hasAttribute("data-faq-active") ? null : item);
    });
  });
});
