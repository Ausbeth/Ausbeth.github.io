/**
 * Screenshots are referenced by their final paths, whether or not the files
 * exist yet. A missing one switches its frame to a wireframe placeholder that
 * names the expected file; a loaded one marks the frame so it can size itself.
 */
export function initMediaFallbacks(root = document) {
  for (const image of root.querySelectorAll("img[data-asset]")) {
    const frame = image.closest(".media");
    if (!frame) continue;

    const markMissing = () => {
      frame.classList.remove("is-loaded");
      frame.setAttribute("data-missing", image.getAttribute("src"));
    };
    const markLoaded = () => {
      frame.removeAttribute("data-missing");
      frame.classList.add("is-loaded");
    };

    if (image.complete) {
      if (image.naturalWidth === 0) markMissing();
      else markLoaded();
    }

    image.addEventListener("error", markMissing);
    image.addEventListener("load", markLoaded);
  }
}
