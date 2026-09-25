const PIXELS_PER_SECOND = 38;

/**
 * Turns the skills list into a seamless loop by following it with a copy
 * that is hidden from assistive technology. With reduced motion the list
 * simply stays put.
 */
export function initMarquee() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (const viewport of document.querySelectorAll("[data-marquee]")) {
    const list = viewport.querySelector("ul");
    if (!list) continue;

    const track = document.createElement("div");
    track.className = "stack__track";

    const copy = list.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.removeAttribute("aria-labelledby");
    copy.inert = true;

    track.append(list, copy);
    viewport.append(track);
    viewport.setAttribute("data-running", "");

    const setSpeed = () => {
      track.style.setProperty("--marquee-duration", `${Math.round(list.scrollWidth / PIXELS_PER_SECOND)}s`);
    };
    setSpeed();
    document.fonts?.ready.then(setSpeed);
  }
}
