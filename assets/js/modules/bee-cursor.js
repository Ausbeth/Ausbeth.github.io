import { createBee } from "./bee-art.js";

const FOLLOW = 0.2;
const BEE_OFFSET = { x: 20, y: 18 };
const TRAIL_SIZE = 16;
const TRAIL_SPACING = 16;
const IDLE_AFTER_MS = 900;

const INTERACTIVE = 'a, button, [role="tab"], label, summary, input[type="range"], .screen--scroll';
const TYPING = 'input:not([type="range"]), textarea, select, [contenteditable]';

/**
 * Replaces the pointer with a small bee that follows it, leaves a faint
 * pollen trail and lights up a dot field in the background as it moves.
 * A gold dot marks the exact click point. Only runs with a mouse or
 * trackpad, and never when reduced motion is requested.
 */
export function initBeeCursor() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return;

  const root = document.documentElement;
  const dot = element("span", "cursor-dot");
  const bee = element("span", "cursor-bee");
  const body = element("span", "cursor-bee__body");
  const backdrop = element("div", "backdrop");
  body.append(createBee({ flying: true }));
  bee.append(body);

  const trail = Array.from({ length: TRAIL_SIZE }, () => element("span", "cursor-trail"));
  for (const part of [backdrop, ...trail, bee, dot]) {
    part.setAttribute("aria-hidden", "true");
  }
  document.body.append(backdrop, ...trail, bee, dot);

  const pointer = { x: -100, y: -100 };
  const position = { x: -100, y: -100 };
  const lastDrop = { x: 0, y: 0 };
  let facing = 1;
  let trailIndex = 0;
  let frame = 0;
  let idleTimer;
  let started = false;

  const tick = () => {
    const dx = pointer.x + BEE_OFFSET.x - position.x;
    const dy = pointer.y + BEE_OFFSET.y - position.y;
    position.x += dx * FOLLOW;
    position.y += dy * FOLLOW;

    if (Math.abs(dx) > 1.5) facing = dx > 0 ? 1 : -1;
    const tilt = Math.max(-18, Math.min(18, dy * 0.35));
    bee.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) scaleX(${facing}) rotate(${tilt * facing}deg)`;

    if (Math.hypot(position.x - lastDrop.x, position.y - lastDrop.y) > TRAIL_SPACING) {
      dropPollen(position.x - facing * 14, position.y + 4);
      lastDrop.x = position.x;
      lastDrop.y = position.y;
    }

    const settled = Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  const dropPollen = (x, y) => {
    const speck = trail[trailIndex];
    trailIndex = (trailIndex + 1) % TRAIL_SIZE;
    speck.animate(
      [
        { transform: `translate3d(${x}px, ${y}px, 0) scale(1)`, opacity: 0.55 },
        { transform: `translate3d(${x}px, ${y + 10}px, 0) scale(0.2)`, opacity: 0 },
      ],
      { duration: 900, easing: "ease-out" },
    );
  };

  const setMode = (target) => {
    let mode = "";
    if (target.closest(TYPING)) mode = "text";
    else if (target.closest(INTERACTIVE)) mode = "link";

    if (mode) root.setAttribute("data-cursor", mode);
    else root.removeAttribute("data-cursor");
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      backdrop.style.setProperty("--cursor-x", `${pointer.x}px`);
      backdrop.style.setProperty("--cursor-y", `${pointer.y}px`);

      if (!started) {
        started = true;
        position.x = pointer.x + BEE_OFFSET.x;
        position.y = pointer.y + BEE_OFFSET.y;
        root.classList.add("has-bee-cursor");
        backdrop.setAttribute("data-active", "");
      }

      setMode(event.target);
      bee.removeAttribute("data-idle");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => bee.setAttribute("data-idle", ""), IDLE_AFTER_MS);

      if (!frame) frame = requestAnimationFrame(tick);
    },
    { passive: true },
  );

  document.documentElement.addEventListener("pointerleave", () => {
    root.setAttribute("data-cursor", "hidden");
    backdrop.removeAttribute("data-active");
  });

  document.documentElement.addEventListener("pointerenter", () => {
    if (started) backdrop.setAttribute("data-active", "");
  });

  window.addEventListener("pointerdown", () => {
    body.animate([{ scale: 1 }, { scale: 0.8 }, { scale: 1 }], { duration: 280, easing: "ease-out" });
  });
}

function element(tag, className) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}
