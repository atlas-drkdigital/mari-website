// Scroll reveal — fades/slides [data-reveal] elements in as they enter the viewport by adding
// [data-revealed] (the visual is pure CSS, see src/input.css). Graceful: if IntersectionObserver is
// unsupported OR the user prefers reduced motion, reveal everything immediately (the CSS also keeps
// content fully visible under reduced-motion, so this is belt-and-suspenders).
(() => {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  const reveal = (el) => el.setAttribute("data-revealed", "");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(reveal);
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => io.observe(el));
})();
