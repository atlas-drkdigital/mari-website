// Footer newsletter form — static/backend-less placeholder, same situation as assets/contact.js (no
// endpoint exists yet on this pre-Next.js build). Prevents the default navigation and clears the field.
// No fake success message here (unlike Contact) since Figma doesn't spec one for this form.
document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
  });
});
