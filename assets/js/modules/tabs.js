const KEY_STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

export function initTabs() {
  for (const container of document.querySelectorAll("[data-tabs]")) {
    const tabs = [...container.querySelectorAll('[role="tab"]')];
    if (!tabs.length) continue;

    const select = (tab, { focus = false } = {}) => {
      for (const candidate of tabs) {
        const selected = candidate === tab;
        const panel = document.getElementById(candidate.getAttribute("aria-controls"));

        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        if (!panel) continue;

        if (selected && panel.hidden) {
          panel.hidden = false;
          panel.setAttribute("data-entering", "");
          panel.addEventListener("animationend", () => panel.removeAttribute("data-entering"), { once: true });
        } else if (!selected) {
          panel.hidden = true;
        }
      }

      if (focus) tab.focus();
      container.dispatchEvent(new CustomEvent("tabchange", { bubbles: true }));
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));

      tab.addEventListener("keydown", (event) => {
        let target;
        if (event.key in KEY_STEPS) target = tabs[(index + KEY_STEPS[event.key] + tabs.length) % tabs.length];
        else if (event.key === "Home") target = tabs[0];
        else if (event.key === "End") target = tabs.at(-1);
        if (!target) return;

        event.preventDefault();
        select(target, { focus: true });
      });
    });
  }
}
