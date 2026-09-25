/** Shows a slim progress bar on a device frame while its screenshot is being scrolled. */
export function initScreens() {
  for (const screen of document.querySelectorAll(".screen--scroll")) {
    const frame = screen.closest(".browser, .phone");
    if (!frame) continue;

    frame.setAttribute("data-scroll-progress", "");
    let idleTimer;

    screen.addEventListener(
      "scroll",
      () => {
        const distance = screen.scrollHeight - screen.clientHeight;
        const progress = distance > 0 ? screen.scrollTop / distance : 0;
        frame.style.setProperty("--scroll-progress", progress.toFixed(3));
        frame.setAttribute("data-scrolling", "");

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => frame.removeAttribute("data-scrolling"), 900);
      },
      { passive: true },
    );
  }
}
