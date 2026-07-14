// Multi-Select Checkbox Dropdown — reusable across any [data-multiselect] instance (Contact's Preferred
// Destination + Preferred Departure Month today; a genuine reusable component, see COMPONENTS.md).
// Structure: a trigger <button> (aria-haspopup="listbox", aria-expanded) + a checkbox panel, toggled via
// [hidden]. The trigger's own label text updates live as checkboxes change: none checked -> placeholder,
// 1-2 checked -> their names joined with ", ", 3+ checked -> first 2 names + "+N more".
document.querySelectorAll("[data-multiselect]").forEach((root) => {
  const trigger = root.querySelector("[data-multiselect-trigger]");
  const panel = root.querySelector("[data-multiselect-panel]");
  const label = root.querySelector("[data-multiselect-label]");
  const placeholder = label?.textContent || "";
  const checkboxes = Array.from(root.querySelectorAll("[data-multiselect-option]"));
  if (!trigger || !panel || !label || !checkboxes.length) return;

  const close = () => {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  };

  const updateLabel = () => {
    const checked = checkboxes.filter((cb) => cb.checked).map((cb) => cb.value);
    // Trigger has no ::placeholder pseudo-class to lean on (it's a <button>, not an <input>) — toggle
    // its color manually so it matches every other field's placeholder(secondary)/filled(primary) convention.
    trigger.classList.toggle("text-text-secondary", checked.length === 0);
    trigger.classList.toggle("text-text-primary", checked.length > 0);
    if (!checked.length) {
      label.textContent = placeholder;
      return;
    }
    if (checked.length <= 2) {
      label.textContent = checked.join(", ");
      return;
    }
    label.textContent = `${checked.slice(0, 2).join(", ")} +${checked.length - 2} more`;
  };

  trigger.addEventListener("click", () => (panel.hidden ? open() : close()));
  checkboxes.forEach((cb) => cb.addEventListener("change", updateLabel));

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      close();
      trigger.focus();
    }
  });
});
