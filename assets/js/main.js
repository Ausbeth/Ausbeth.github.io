import { initMediaFallbacks } from "./modules/media.js";
import { initNav } from "./modules/nav.js";
import { initReveal } from "./modules/reveal.js";
import { initHero } from "./modules/hero.js";
import { initMarquee } from "./modules/marquee.js";
import { initTabs } from "./modules/tabs.js";
import { initScreens } from "./modules/screens.js";
import { initTerminal } from "./modules/terminal.js";
import { initConfidence } from "./modules/confidence.js";
import { initGallery } from "./modules/gallery.js";
import { initProjectFilter } from "./modules/project-filter.js";
import { initCopy } from "./modules/copy.js";
import { initContactForm } from "./modules/contact-form.js";
import { initBeeCursor } from "./modules/bee-cursor.js";
import { initBeeHunt } from "./modules/bee-hunt.js";

const features = [
  initMediaFallbacks,
  initNav,
  initReveal,
  initHero,
  initMarquee,
  initTabs,
  initScreens,
  initTerminal,
  initConfidence,
  initGallery,
  initProjectFilter,
  initCopy,
  initContactForm,
  initBeeCursor,
  initBeeHunt,
];

// One broken feature should never take the rest of the page down with it.
for (const init of features) {
  try {
    init();
  } catch (error) {
    console.error(`${init.name} failed to start`, error);
  }
}
