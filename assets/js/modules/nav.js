export function initNav() {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const menuButton = document.querySelector(".menu-button");
  if (!header || !nav) return;

  const menuLabel = menuButton?.querySelector("[data-menu-label]");

  const setMenuOpen = (open) => {
    menuButton?.setAttribute("aria-expanded", String(open));
    nav.toggleAttribute("data-open", open);
    if (menuLabel) menuLabel.textContent = open ? "Close" : "Menu";
  };

  menuButton?.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.hasAttribute("data-open")) {
      setMenuOpen(false);
      menuButton?.focus();
    }
  });

  window.matchMedia("(min-width: 52.0625rem)").addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });

  const updateScrolled = () => header.toggleAttribute("data-scrolled", window.scrollY > 8);
  updateScrolled();
  window.addEventListener("scroll", updateScrolled, { passive: true });

  const links = [...nav.querySelectorAll("[data-nav-link]")];
  const setCurrent = (key) => {
    for (const link of links) {
      if (link.dataset.navLink === key) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  // A thin band across the middle of the viewport decides which section is current.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.dataset.navSection ?? "");
      }
    },
    { rootMargin: "-45% 0px -54% 0px" },
  );

  for (const section of document.querySelectorAll("[data-nav-section], .hero")) {
    observer.observe(section);
  }
}
