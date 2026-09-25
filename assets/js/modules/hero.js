import { createBee } from "./bee-art.js";

const GREETING_BEES = 4;

export function initHero() {
  initGreeting();
  initFlipChips();
}

/**
 * Hovering the greeting swaps it for the nickname. Touch screens have no
 * hover, so a tap does the same thing there.
 */
function initGreeting() {
  const greeting = document.querySelector("[data-greeting]");
  if (!greeting) return;

  const swarm = greeting.querySelector("[data-greeting-bees]");
  if (swarm) {
    for (let index = 0; index < GREETING_BEES; index += 1) {
      const holder = document.createElement("span");
      holder.className = "greeting__bee";
      holder.append(createBee({ flying: true }));
      swarm.append(holder);
    }
  }

  greeting.addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse") return;
    greeting.toggleAttribute("data-flipped");
  });
}

function initFlipChips() {
  for (const chip of document.querySelectorAll(".flip-chip")) {
    chip.addEventListener("click", () => {
      chip.setAttribute("aria-pressed", String(chip.getAttribute("aria-pressed") !== "true"));
    });
  }
}
