const MESSAGES = {
  invalid: "Check the highlighted fields.",
  sending: "Sending…",
  sent: "Message sent. I'll reply to the email address you gave.",
  failed: "The message didn't send. Check your connection and try again, or email me directly.",
};

/**
 * Submits to Formspree in the background so visitors stay on the page.
 * Without JavaScript the form still posts normally.
 */
export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector("[data-submit]");
  const fields = [...form.querySelectorAll("input[required], textarea[required]")];

  form.noValidate = true;

  const setStatus = (text, state = "") => {
    if (!status) return;
    status.textContent = text;
    status.dataset.state = state;
  };

  const setFieldError = (field, hasError) => {
    const error = document.getElementById(`${field.id}-error`);
    field.setAttribute("aria-invalid", String(hasError));
    if (!error) return;
    error.hidden = !hasError;
    if (hasError) field.setAttribute("aria-describedby", error.id);
    else field.removeAttribute("aria-describedby");
  };

  const isValid = (field) => field.value.trim() !== "" && field.validity.valid;

  for (const field of fields) {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") setFieldError(field, !isValid(field));
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalid = fields.filter((field) => {
      const hasError = !isValid(field);
      setFieldError(field, hasError);
      return hasError;
    });

    if (invalid.length) {
      invalid[0].focus();
      setStatus(MESSAGES.invalid, "error");
      return;
    }

    submit.disabled = true;
    setStatus(MESSAGES.sending);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Form service responded with ${response.status}`);

      form.reset();
      setStatus(MESSAGES.sent, "sent");
    } catch (error) {
      console.error(error);
      setStatus(MESSAGES.failed, "error");
    } finally {
      submit.disabled = false;
    }
  });
}
