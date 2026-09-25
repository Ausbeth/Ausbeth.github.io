export function initProjectFilter() {
  const group = document.querySelector("[data-filters]");
  if (!group) return;

  const buttons = [...group.querySelectorAll("[data-filter]")];
  const rows = [...document.querySelectorAll(".index__row[data-tags]")];
  const status = document.querySelector("[data-filter-status]");

  const matches = (row, filter) => filter === "all" || row.dataset.tags.split(/\s+/).includes(filter);
  const labelOf = (button) => button.dataset.label;

  for (const button of buttons) {
    button.dataset.label = button.textContent.trim();

    const count = document.createElement("span");
    count.className = "filter__count";
    count.setAttribute("aria-hidden", "true");
    count.textContent = rows.filter((row) => matches(row, button.dataset.filter)).length;
    button.append(count);

    button.addEventListener("click", () => apply(button.dataset.filter));
  }

  function apply(filter) {
    let shown = 0;
    for (const row of rows) {
      const visible = matches(row, filter);
      row.hidden = !visible;
      if (visible) shown += 1;
    }

    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    }

    if (status) {
      const noun = shown === 1 ? "project" : "projects";
      const active = buttons.find((button) => button.dataset.filter === filter);
      status.textContent = filter === "all" ? `Showing all ${shown} projects` : `Showing ${shown} ${noun} in ${labelOf(active)}`;
    }
  }
}
