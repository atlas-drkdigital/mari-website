// Contact form — static/backend-less placeholder (no endpoint exists yet on this pre-Next.js build).
// Prevents the default navigation and reveals Figma's "thank you" feedback message, standing in for the
// real submit handler that lands with the eventual backend/Next.js migration.
document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const feedback = form.parentElement.querySelector("[data-contact-feedback]");
  const placeholderSelects = Array.from(form.querySelectorAll("[data-placeholder-select]"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    feedback?.removeAttribute("hidden");
    form.reset();
    // form.reset() doesn't fire "change", so re-sync the placeholder-select color manually.
    placeholderSelects.forEach((select) => select.dispatchEvent(new Event("change")));
  });
});

// Native <select> has no ::placeholder pseudo-class — toggle its text color manually so the closed
// control matches every other field's placeholder(secondary)/filled(primary) color convention.
document.querySelectorAll("[data-placeholder-select]").forEach((select) => {
  const sync = () => {
    select.classList.toggle("text-text-secondary", select.value === "");
    select.classList.toggle("text-text-primary", select.value !== "");
  };
  select.addEventListener("change", sync);
  sync();
});
