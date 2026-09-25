const MODES = {
  1: "Data Retrieval",
  2: "Data Analysis",
  3: "Data Visualisation",
};

const HISTORY_LIMIT = 8;

/**
 * Replays AusBot's real menu. Choosing a mode reveals a screenshot of that
 * mode's actual output rather than simulating results the program never produced.
 */
export function initTerminal() {
  for (const root of document.querySelectorAll("[data-terminal]")) {
    const history = root.querySelector("[data-terminal-history]");
    const form = root.querySelector("[data-terminal-form]");
    const input = root.querySelector("[data-terminal-input]");
    const options = [...root.querySelectorAll("[data-choice]")];
    const outputs = [...root.querySelectorAll("[data-output]")];
    if (!history || !form || !input) continue;

    const print = (text, { comment = false } = {}) => {
      const line = document.createElement("p");
      line.textContent = text;
      if (comment) line.className = "is-comment";
      history.append(line);

      while (history.children.length > HISTORY_LIMIT) {
        history.firstElementChild.remove();
      }
    };

    const showOutput = (key) => {
      for (const output of outputs) output.hidden = output.dataset.output !== key;
      for (const option of options) option.setAttribute("aria-pressed", String(option.dataset.choice === key));
    };

    const choose = (raw) => {
      const choice = raw.trim();
      print(`Enter your choice: ${choice}`);

      if (choice in MODES) {
        showOutput(choice);
        print(`# ${MODES[choice]} output is shown below.`, { comment: true });
      } else if (choice === "0") {
        showOutput("idle");
        print("# AusBot closed. Choose an option to start again.", { comment: true });
      } else {
        print("# Choose 1, 2, 3 or 0.", { comment: true });
      }
    };

    showOutput("idle");

    for (const option of options) {
      option.addEventListener("click", () => choose(option.dataset.choice));
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input.value.trim()) return;
      choose(input.value);
      input.value = "";
    });
  }
}
