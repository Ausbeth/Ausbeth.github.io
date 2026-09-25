const RESET_AFTER_MS = 2000;

export function initCopy() {
  for (const button of document.querySelectorAll("[data-copy]")) {
    const label = button.querySelector("[data-copy-label]");
    const defaultText = label?.textContent;
    let resetTimer;

    const flash = (text) => {
      if (label) label.textContent = text;
      button.setAttribute("data-copied", "");
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        if (label) label.textContent = defaultText;
        button.removeAttribute("data-copied");
      }, RESET_AFTER_MS);
    };

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        flash("Copied");
      } catch {
        const source = button.previousElementSibling;
        if (source) window.getSelection()?.selectAllChildren(source);
        flash("Selected, press Ctrl+C");
      }
    });
  }
}
