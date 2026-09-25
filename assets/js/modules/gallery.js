const LOUPE_ZOOM = 2.6;

export function initGallery() {
  const dialog = document.querySelector("[data-lightbox-dialog]");
  const dialogImage = dialog?.querySelector("[data-lightbox-image]");
  const dialogTitle = dialog?.querySelector("[data-lightbox-title]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  for (const trigger of document.querySelectorAll("[data-lightbox]")) {
    const image = trigger.querySelector("img");
    if (!image) continue;

    trigger.addEventListener("click", () => {
      if (!dialog || !dialogImage || trigger.hasAttribute("data-missing")) return;
      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      if (dialogTitle) {
        dialogTitle.textContent = trigger.closest("figure")?.querySelector("figcaption strong")?.textContent ?? "";
      }
      dialog.showModal();
    });

    if (trigger.hasAttribute("data-loupe")) attachLoupe(trigger, image, finePointer);
  }

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function attachLoupe(trigger, image, finePointer) {
  const host = trigger.parentElement;
  const lens = document.createElement("span");
  lens.className = "loupe";
  lens.setAttribute("aria-hidden", "true");
  host.append(lens);

  const hide = () => lens.removeAttribute("data-visible");

  trigger.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || trigger.hasAttribute("data-missing") || !image.naturalWidth) return hide();

    const box = trigger.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const size = lens.offsetWidth;

    lens.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
    lens.style.backgroundImage = `url("${image.currentSrc || image.src}")`;
    lens.style.backgroundSize = `${box.width * LOUPE_ZOOM}px ${box.height * LOUPE_ZOOM}px`;
    lens.style.backgroundPosition = `${size / 2 - x * LOUPE_ZOOM}px ${size / 2 - y * LOUPE_ZOOM}px`;
    lens.setAttribute("data-visible", "");
  });

  trigger.addEventListener("pointerleave", hide);
}
