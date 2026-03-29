import { loadHeaderFooter } from "./utils.mjs";
import { register } from "./auth.mjs";

async function init() {
  await loadHeaderFooter();

  const form = document.querySelector("#register-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = form.checkValidity();
    form.reportValidity();

    if (!isValid) return;

    const name = document.querySelector("#name").value.trim();
    const address = document.querySelector("#address").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    await register(
      {
        name,
        address,
        email,
        password
      },
      "/login/index.html"
    );
  });
}

init();