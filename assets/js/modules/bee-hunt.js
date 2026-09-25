import { createBee } from "./bee-art.js";

const STORAGE_KEY = "ausbee-hunt";
const NEAR_DISTANCE = 120;
const TOAST_MS = 2800;
const REWARD_BEES = 6;
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

/**
 * A few bees are tucked into corners of the page. Catching one flies it up
 * to the counter in the header; catching them all opens a small thank-you.
 * Progress is remembered in this browser only.
 */
export function initBeeHunt() {
  const bees = [...document.querySelectorAll("[data-hunt-bee]")];
  const counter = document.querySelector("[data-hunt-counter]");
  if (!bees.length || !counter) return;

  const countLabel = counter.querySelector("[data-hunt-count]");
  const toast = document.querySelector("[data-hunt-toast]");
  const reward = document.querySelector("[data-hunt-reward]");
  const total = bees.length;
  const found = new Set(readProgress().filter((id) => bees.some((bee) => bee.dataset.huntBee === id)));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let toastTimer;

  for (const word of document.querySelectorAll("[data-hunt-total-word]")) {
    word.textContent = NUMBER_WORDS[total] ?? String(total);
  }

  const render = () => {
    countLabel.textContent = `${found.size}/${total}`;
    counter.setAttribute("aria-label", `Bee hunt: ${found.size} of ${total} found`);
    counter.toggleAttribute("data-complete", found.size === total);
    for (const bee of bees) bee.hidden = found.has(bee.dataset.huntBee);
  };

  const say = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute("data-visible", "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.removeAttribute("data-visible"), TOAST_MS);
  };

  const bump = () => {
    counter.removeAttribute("data-bump");
    void counter.offsetWidth;
    counter.setAttribute("data-bump", "");
  };

  const openReward = () => {
    if (!reward || reward.open) return;
    const swarm = reward.querySelector("[data-reward-bees]");
    if (swarm && !swarm.childElementCount) {
      for (let index = 0; index < REWARD_BEES; index += 1) {
        swarm.append(createBee({ flying: true, className: "reward-bee" }));
      }
    }
    reward.showModal();
  };

  const catchBee = async (bee) => {
    const id = bee.dataset.huntBee;
    if (found.has(id)) return;

    found.add(id);
    saveProgress([...found]);
    const from = bee.getBoundingClientRect();
    bee.hidden = true;

    await flyToCounter(from, counter, reducedMotion.matches);
    render();
    bump();

    if (found.size === total) {
      say("That's every bee. Nicely done!");
      openReward();
    } else {
      const left = total - found.size;
      say(`Bee caught! ${left} still hiding.`);
    }
  };

  for (const bee of bees) {
    bee.addEventListener("click", () => catchBee(bee));
  }

  counter.addEventListener("click", () => {
    if (found.size === total) return openReward();
    if (found.size === 0) return say(`${NUMBER_WORDS[total] ?? total} bees are hiding on this page. Look closely as you scroll.`);
    say(`${found.size} of ${total} found. Keep looking.`);
  });

  reward?.querySelector("[data-hunt-reset]")?.addEventListener("click", () => {
    found.clear();
    saveProgress([]);
    render();
    reward.close();
    say("The bees are back in hiding.");
  });

  reward?.addEventListener("click", (event) => {
    if (event.target === reward) reward.close();
  });

  watchProximity(bees, found);
  render();
}

/** Bees start to wiggle when the pointer comes close, as a gentle hint. */
function watchProximity(bees, found) {
  let frame = 0;
  let pointer = null;

  const check = () => {
    frame = 0;
    for (const bee of bees) {
      if (found.has(bee.dataset.huntBee) || !pointer) {
        bee.removeAttribute("data-near");
        continue;
      }
      const box = bee.getBoundingClientRect();
      const distance = Math.hypot(pointer.x - (box.left + box.width / 2), pointer.y - (box.top + box.height / 2));
      bee.toggleAttribute("data-near", box.width > 0 && distance < NEAR_DISTANCE);
    }
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(check);
    },
    { passive: true },
  );
}

function flyToCounter(from, counter, instant) {
  const to = counter.getBoundingClientRect();
  if (instant || !from.width || !to.width) return Promise.resolve();

  const flyer = createBee({ flying: true, className: "hunt-flyer" });
  document.body.append(flyer);

  const start = `translate(${from.left}px, ${from.top}px)`;
  const peak = `translate(${(from.left + to.left) / 2}px, ${Math.min(from.top, to.top) - 80}px) scale(1.3)`;
  const end = `translate(${to.left + 4}px, ${to.top + 4}px) scale(0.7)`;

  const flight = flyer.animate(
    [{ transform: start }, { transform: peak, offset: 0.45 }, { transform: end, opacity: 0.4 }],
    { duration: 850, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
  );

  return flight.finished.catch(() => {}).finally(() => flyer.remove());
}

function readProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveProgress(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Without storage the hunt still works; it just starts fresh next visit.
  }
}
