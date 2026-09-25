// Thresholds come from the Income Bracket Chatbot itself: below 30% and above
// 70% the model answers on its own; anything in between goes to a person.
const LOWER_LIMIT = 30;
const UPPER_LIMIT = 70;

const BANDS = {
  lower: {
    name: "lower bracket",
    title: "Lower bracket, $50,000 or under.",
    detail: "Confident enough to answer automatically.",
  },
  refer: {
    name: "refer to a person",
    title: "Refer to a person.",
    detail: "Between 30% and 70% the model is not sure enough, so the case goes to a person instead.",
  },
  upper: {
    name: "upper bracket",
    title: "Upper bracket, over $50,000.",
    detail: "Confident enough to answer automatically.",
  },
};

const bandFor = (value) => {
  if (value < LOWER_LIMIT) return "lower";
  if (value > UPPER_LIMIT) return "upper";
  return "refer";
};

export function initConfidence() {
  for (const root of document.querySelectorAll("[data-confidence]")) {
    const input = root.querySelector("[data-confidence-input]");
    const readout = root.querySelector("[data-confidence-value]");
    const verdict = root.querySelector("[data-confidence-verdict]");
    const bandLabels = [...root.querySelectorAll("[data-band]")];
    if (!input || !readout || !verdict) continue;

    let currentBand;

    const update = () => {
      const value = Number(input.value);
      const key = bandFor(value);
      const band = BANDS[key];
      const formatted = `${value.toFixed(1)}%`;

      readout.textContent = formatted;
      input.setAttribute("aria-valuetext", `${formatted}, ${band.name}`);
      root.dataset.state = key;

      for (const label of bandLabels) {
        label.toggleAttribute("data-active", label.dataset.band === key);
      }

      // Only rewrite the verdict when the band changes, so screen readers
      // are not flooded while the slider moves.
      if (key !== currentBand) {
        currentBand = key;
        const title = document.createElement("strong");
        title.textContent = band.title;
        verdict.replaceChildren(title, ` ${band.detail}`);
      }
    };

    input.addEventListener("input", update);
    update();
  }
}
