import { loadHeaderFooter, getParam, alertMessage } from "./utils.mjs";
import { login } from "./auth.mjs";

async function init() {
  await loadHeaderFooter();

  const signupMessage = sessionStorage.getItem("signup-success");
  if (signupMessage) {
    alertMessage(signupMessage, false);
    sessionStorage.removeItem("signup-success");
  }

  const redirect = getParam("redirect") || "/index.html";
  const form = document.querySelector("#login-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = form.checkValidity();
    form.reportValidity();

    if (!isValid) return;

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    await login({ email, password }, redirect);
  });
}

init();