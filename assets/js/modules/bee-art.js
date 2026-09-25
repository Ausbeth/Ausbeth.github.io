const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Builds an inline copy of the bee drawn in the page's sprite, so its wings
 * can be animated (a <use> reference cannot be styled from outside).
 */
export function createBee({ flying = false, className = "" } = {}) {
  const symbol = document.getElementById("bee");
  const svg = document.createElementNS(SVG_NS, "svg");

  svg.setAttribute("viewBox", symbol?.getAttribute("viewBox") ?? "0 0 40 32");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("class", ["bee", flying && "bee--flying", className].filter(Boolean).join(" "));

  if (symbol) {
    for (const part of symbol.children) svg.append(part.cloneNode(true));
  }

  return svg;
}
