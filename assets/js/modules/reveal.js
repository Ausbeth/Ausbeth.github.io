/**
 * Brings each [data-reveal] block into focus the first time it scrolls
 * into view. The early script in the page head only enables the hidden
 * state when motion is allowed, and undoes it if this never runs.
 */
export function initReveal() {
  const root = document.documentElement;
  if (!root.classList.contains("reveal-ready")) return;

  root.setAttribute("data-reveal-running", "");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  for (const block of document.querySelectorAll("[data-reveal]")) {
    observer.observe(block);
  }
}
